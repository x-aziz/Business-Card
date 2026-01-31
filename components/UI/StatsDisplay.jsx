import React, { useState, useEffect } from 'react';

export default function StatsDisplay() {
  const [views, setViews] = useState(0);
  const [projects, setProjects] = useState(0);
  const [score, setScore] = useState(0);
  const [experience, setExperience] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setViews(Math.floor(119 * progress));
      setProjects(Math.floor(6 * progress));
      setScore(parseFloat((98.5 * progress).toFixed(1)));
      setExperience(parseFloat((2.5 * progress).toFixed(1)));

      if (step >= steps) {
        clearInterval(timer);
        setViews(119);
        setProjects(6);
        setScore(98.5);
        setExperience(2.5);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 backdrop-blur-sm max-w-[160px] sm:max-w-xs">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-white font-semibold text-[10px] sm:text-xs md:text-sm">METRICS</h3>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[8px] sm:text-xs text-gray-400">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
        <div className="glass rounded p-1.5 sm:p-2 md:p-3">
          <div className="text-base sm:text-xl md:text-2xl font-bold text-cyan-300">{views}</div>
          <div className="text-[8px] sm:text-xs text-gray-400">Views</div>
        </div>

        <div className="glass rounded p-1.5 sm:p-2 md:p-3">
          <div className="text-base sm:text-xl md:text-2xl font-bold text-purple-300">{projects}+</div>
          <div className="text-[8px] sm:text-xs text-gray-400">Projects</div>
        </div>

        <div className="glass rounded p-1.5 sm:p-2 md:p-3">
          <div className="text-base sm:text-xl md:text-2xl font-bold text-green-300">{score}/100</div>
          <div className="text-[8px] sm:text-xs text-gray-400">Score</div>
        </div>

        <div className="glass rounded p-1.5 sm:p-2 md:p-3">
          <div className="text-base sm:text-xl md:text-2xl font-bold text-blue-300">{experience}+ yrs</div>
          <div className="text-[8px] sm:text-xs text-gray-400">Exp</div>
        </div>
      </div>
    </div>
  );
}