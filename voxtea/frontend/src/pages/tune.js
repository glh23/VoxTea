// Inspiration: 
// https://github.com/zplata/tuner-app/blob/main/app.js          
// https://github.com/citronneur/onlinetuner.co/tree/master/js
// https://github.com/qiuxiang/tuner/tree/master/app
// https://github.com/cwilso/PitchDetect/blob/4190bc705747fbb3f82eb465ea18a2dfb5873080/js/pitchdetect.js#L283
// https://ccrma.stanford.edu/~pdelac/154/m154paper.htm            using autocorrelation to detect pitch instead but similar approach

import React, { useState, useEffect, useRef } from "react";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";

const GuitarTuner = () => {
    const [note, setNote] = useState(null);
    const [frequency, setFrequency] = useState(null);
    const [isTuning, setIsTuning] = useState(false);
    const canvasRef = useRef(null);
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    useEffect(() => {
        let audioContext, dataArray, analyser, source, bufferLength, stream;

        const startTuning = async () => {
            setIsTuning(true);
            // Get data from the microphone
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            // Set the Size of the fast fourier transform which I'm not using any more
            //analyser.fftSize = 8192;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Float32Array(bufferLength);

            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // Function below
            processAudio();
        };

        const stopTuning = () => {
            setIsTuning(false);
            if (audioContext) audioContext.close();
            if (stream) stream.getTracks().forEach(track => track.stop());
        };

        const processAudio = () => {
            if (!isTuning) return;

            analyser.getFloatTimeDomainData(dataArray); 
            const freq = autoCorrelate(dataArray, audioContext.sampleRate);

            if (freq) {
                const detectedNote = getClosestNote(freq);
                setFrequency(freq.toFixed(2));
                setNote(detectedNote);

                // Function below
                frequencyGraph(dataArray);
                if (note) tuningPin(freq);
            }

            requestAnimationFrame(processAudio);
        };

        const frequencyGraph = (dataArray) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const barWidth = (width / bufferLength) * 3;
            let barHeight;
            let x = 0;

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * height;
                ctx.fillStyle = barHeight > 0 ? '#ffffff' : '#ff004b';
                ctx.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        const tuningPin = (freq) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;
            const rectHeight = 30;
            const y = height - rectHeight;

            ctx.clearRect(0, y, width, rectHeight);

            if (!freq || !note) return;

            const targetFreq = getTargetFrequency(note);
            const diff = freq - targetFreq;

            let leftColor = "transparent";
            let middleColor = "transparent";
            let rightColor = "transparent";

            if (Math.abs(diff) < 3) {
                middleColor = "#50c681";
            } else if (diff < -10) {
                leftColor = Math.abs(diff) < 15 ? "#c6bc50" : "#c65095";
            } else if (diff > 10) {
                rightColor = Math.abs(diff) < 15 ? "#c6bc50" : "#c65095";
            }

            ctx.fillStyle = leftColor;
            ctx.fillRect(0, y, width / 3, rectHeight);

            ctx.fillStyle = middleColor;
            ctx.fillRect(width / 3, y, width / 3, rectHeight);

            ctx.fillStyle = rightColor;
            ctx.fillRect(width / 3 * 2, y, width / 3, rectHeight);
        };

        const getTargetFrequency = (note) => {
            const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            const baseFreq = 16.35;
            const noteIndex = notes.indexOf(note.slice(0, -1));
            const octave = parseInt(note.slice(-1));
            return baseFreq * Math.pow(2, (noteIndex + octave * 12) / 12);
        };

        if (isTuning) startTuning();
        else stopTuning();

        return () => {
            if (audioContext) audioContext.close();
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isTuning]); 

    const autoCorrelate = (buffer, sampleRate) => {
        let size = buffer.length;
        let bestOffset = -1;
        let bestCorr = 0;
        let rootMeanSquare = 0;
        let foundCorr = false;
        let lastCorr = 1;

        // Is there any sound?
        for (let i = 0; i < size; i++) {
            let x = buffer[i];
            rootMeanSquare += x * x;
        }
        rootMeanSquare = Math.sqrt(rootMeanSquare / size);
        if (rootMeanSquare < 0.01) return null;

        // Loop through all of the different offsets to find the one that matches best
        for (let offset = 0; offset < size / 2; offset++) {
            let correlation = 0;
            for (let i = 0; i < size / 2; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }
            correlation = 1 - (correlation / (size / 2));

            // Stop is the the correlation is good enough
            if (correlation > 0.97 && correlation > lastCorr) {
                foundCorr = true;
                // If this is the best correlation save the offset
                if (correlation > bestCorr) {
                    bestCorr = correlation;
                    bestOffset = offset;
                }
            } else if (foundCorr) {
                // Use the offset to calculate the frequency
                let frequency = sampleRate / bestOffset;
                return frequency;
            }
            lastCorr = correlation;
        }

        return null;
    };

    const getClosestNote = (freq) => {
        const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const baseFreq = 16.35;
        const noteFreq = Array.from({ length: 96 }, (_, i) => baseFreq * Math.pow(2, i / 12));

        // Find the closest note frequency
        const closestNote = noteFreq.reduce((prev, curr, index) =>
            Math.abs(curr - freq) < Math.abs(noteFreq[prev] - freq) ? index : prev, 0
        );

        const noteName = notes[closestNote % 12];
        const octave = Math.floor(closestNote / 12);
        return `${noteName}${octave}`;
    };

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
            <TopBar />
            <h1>Guitar Tuner</h1>
            <button
                onClick={() => setIsTuning(!isTuning)}
                style={{
                    backgroundColor: isTuning ? '#50c681' : '#304463',
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
            <BottomBar />
        </div>
    );
};

export default GuitarTuner;
