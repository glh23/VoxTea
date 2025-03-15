import React, { useRef, useState, useEffect } from "react";
import "./myAudioPlayer.css"; // Make sure to style it separately

const AudioPlayer = ({ audioSrc, onPlayNext, onPlayPrevious, isLiked, onLikeToggle }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = audioRef.current;

    const updateProgress = () => {
      if (audioElement && !isNaN(audioElement.duration) && audioElement.duration > 0) {
        const percentage = (audioElement.currentTime / audioElement.duration) * 100;
        if (isPlaying) setProgress(percentage);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateProgress);
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", updateProgress);
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleSeek = (event) => {
    const newTime = (parseFloat(event.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(event.target.value));
  };

  const adjustVolume = (amount) => {
    if (audioRef.current) {
      let newVolume = Math.max(0, Math.min(1, audioRef.current.volume + amount));
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} crossOrigin="anonymous" key={audioSrc}>
        <source src={audioSrc} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <input
        className="slider"
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
      />

      <div className="controls">
        <img
          src="/voxtea/fast-backward-button.png"
          alt="Previous"
          className="skip-button"
          onClick={onPlayPrevious}
        />
        
        <img
          src={isPlaying ? "/voxtea/pause-button.png" : "/voxtea/play-button.png"}
          alt={isPlaying ? "Pause" : "Play"}
          className="play-pause-button"
          onClick={togglePlayPause}
        />

        <img
          src="/voxtea/fast-forward-button.png"
          alt="Next"
          className="skip-button"
          onClick={onPlayNext}
        />
      </div>

      <div className="extra-controls">
        <img
          src="/voxtea/volume-down.png"
          alt="Volume Down"
          className="volume-button"
          onClick={() => adjustVolume(-0.1)}
        />
        <img
          src={isLiked ? "/voxtea/favourite(1).png" : "/voxtea/favourite.png"}
          alt={isLiked ? "Unlike" : "Like"}
          className="like-button"
          onClick={onLikeToggle}
        />
        <img
          src="/voxtea/volume-up.png"
          alt="Volume Up"
          className="volume-button"
          onClick={() => adjustVolume(0.1)}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
