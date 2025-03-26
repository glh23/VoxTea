// Insporation: 
// https://github.com/zplata/tuner-app/blob/main/app.js          
// https://github.com/citronneur/onlinetuner.co/tree/master/js
// https://github.com/qiuxiang/tuner/tree/master/app
// https://github.com/cwilso/PitchDetect/blob/4190bc705747fbb3f82eb465ea18a2dfb5873080/js/pitchdetect.js#L283
// https://ccrma.stanford.edu/~pdelac/154/m154paper.htm            using autocorrelation to detect pitch instead but similar approach

import React, { useState, useEffect, useRef } from "react";

const GuitarTuner = () => {
    const [note, setNote] = useState(null);
    const [frequency, setFrequency] = useState(null);
    const [isTuning, setIsTuning] = useState(false);
    const canvasRef = useRef(null);

    // isTuning
    useEffect(() => {
        let audioContext, dataArray,  analyser,  source, bufferLength, stream;

        const startTuning = async  () => {
            setIsTuning(true);
            // Get the  mic, get analyser for frequency and time, set FFT for the bin count
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 8192;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Float32Array(bufferLength);

            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            processAudio();
        };

        // Turn it off
        const stopTuning =()=>{
            setIsTuning(false);
            if (audioContext) audioContext.close();
            if (stream) stream.getTracks().forEach(track => track.stop());
        };

        const processAudio =()=>{
            if (!isTuning) return;

            // Use my auto-correlate function to get the frequency
            analyser.getFloatTimeDomainData(dataArray);
            const freq = autoCorrelate(dataArray, audioContext.sampleRate);

            // Get the note that matches the frequency
            if (freq){
                const detectedNote = getClosestNote(freq);
                setFrequency(freq.toFixed(2));
                setNote(detectedNote);

                // Draw the frequency graph and the tuning pin
                drawFrequencyGraph(dataArray);
                if (note) drawTuningPin(freq); 
            }
            // 
            requestAnimationFrame(processAudio);
        };

        // Make the notes by doing maths
        const getTargetFrequency = (note) => {
            const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            const baseFreq = 16.35;
            const noteIndex = notes.indexOf(note.slice(0, -1));
            const octave = parseInt(note.slice(-1));
            return baseFreq * Math.pow(2, (noteIndex + octave * 12) / 12);
        };

        // ON / OFF button 
        if (isTuning) startTuning();
        else stopTuning();

        return () => {
            if (audioContext) audioContext.close();
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isTuning]);



    

    // Find the fundamental frequency function 2, the empire strikes back
    const autoCorrelate = (buffer, sampleRate) => {
        let size = buffer.length;
        let bestOffset = -1;
        let bestCorr = 0;
        let rootMeanSquare = 0;
        let foundCorr = false;
        let lastCorr = 1;

        // Get all of the Square roots and then find the average
        for (let i = 0; i < size; i++) {
            let x = buffer[i];
            rootMeanSquare += x * x;
        }
        rootMeanSquare = Math.sqrt(rootMeanSquare / size);

        // Check if the sound is too quite
        if (rootMeanSquare < 0.01) return null;

        // Hill climbing to find the best offset
        for (let offset = 0; offset < size / 2; offset++) {
            let correlation = 0;
            
            // Find the correlation for the offset 
            for (let i = 0; i < size / 2; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }
            // Normalize the correlation
            correlation = 1 - (correlation / (size / 2));

            // See if the current offset is better that the previous best
            if (correlation > 0.95 && correlation > lastCorr) {
                foundCorr = true;
                if (correlation > bestCorr) {
                    bestCorr = correlation;
                    bestOffset = offset;
                }
            } 
            else if (foundCorr) {
                // Get the frequency of the offset using the sample rate that I passed in
                let frequency = sampleRate / bestOffset;
                return frequency;
            }
            // Update for the next loop
            lastCorr = correlation;
        }

        return null;
    };

    const getClosestNote = (freq) => {
        const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const baseFreq = 16.35;
        const noteFreq = Array.from({ length: 96 }, (_, i) => baseFreq * Math.pow(2, i / 12));

        const closestNote = noteFreq.reduce((prev, curr, index) =>
            Math.abs(curr - freq) < Math.abs(noteFreq[prev] - freq) ? index : prev, 0
        );

        const noteName = notes[closestNote % 12];
        const octave = Math.floor(closestNote / 12);
        return `${noteName}${octave}`;
    };

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
            <h1>Guitar Tuner</h1>
            <button
                onClick={() => setIsTuning(!isTuning)}
                style={{
                    backgroundColor: isTuning ? '#50c681' : ' #304463 ',
                    padding: "10px 20px",
                    fontSize: "18px",
                    margin: "10px",
                    border: "none",
                    cursor: "pointer"
                }}>
                {isTuning ? "Stop Tuning" : "Start Tuning"}
            </button>
            <h2>Detected Note: {note || "Waiting..."}</h2>
            <p>Frequency: {frequency ? `${frequency} Hz` : "Waiting..."}</p>
            <canvas ref={canvasRef} width="600" height="200" style={{ border: "1px solid #DB2F62", backgroundColor: "black", marginTop: "20px" }}></canvas>
        </div>
    );
};

export default GuitarTuner;
