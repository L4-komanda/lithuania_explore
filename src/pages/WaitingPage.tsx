import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MP3_FILE_PATH = "src/lib/waiting_music.mp3";

const WaitingPage: React.FC = () => {
  const [dots, setDots] = useState(".");
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return ".";
        }
        return prevDots + ".";
      });
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("loggedIn", "true");
      setTimeout(() => navigate("/"), 150);
      setTimeout(() => window.location.reload(), 150);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.play().catch((error) => {
        console.warn("Audio autoplay was prevented:", error);
      });

      return () => {
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <p className="text-3xl font-bold mb-2 text-xl text-gray-700 dark:text-gray-300">
            Prašome palaukti
            <span className="text-3xl font-bold mb-2 inline-block w-3 text-left">
              {dots}
            </span>
          </p>
        </div>
      </div>
      <audio ref={audioRef} src={MP3_FILE_PATH} loop />
    </div>
  );
};

export default WaitingPage;
