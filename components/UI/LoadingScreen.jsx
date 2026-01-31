import React, { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const fullText = 'SAID ABDELAZIZ';

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8">
          {text}
          <span className="animate-pulse">|</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">Full-Stack JavaScript Developer</p>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md px-4 mt-4 sm:mt-6 md:mt-8">
        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
          <span>Loading Experience...</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center mt-6 sm:mt-8 px-4">
        Powered by React • Three.js • React Three Fiber
      </p>
    </div>
  );
}