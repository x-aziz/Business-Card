import React, { useState } from "react";

export default function CTAButtons() {
  const [hireMeHover, setHireMeHover] = useState(false);

  const handleHireMe = () => {
    window.location.href =
      "mailto:said.abd.el.aziz.cs@gmail.com?subject=Hiring%20Inquiry";
  };

  const SocialIcon = ({ icon, label, url, colorClass }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative ${colorClass} rounded-full p-1.5 sm:p-2 transition-all duration-300 hover:scale-110 text-sm sm:text-base`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span>{icon}</span>
        {hovered && (
          <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
            {label}
          </div>
        )}
      </a>
    );
  };

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4 max-w-[140px] sm:max-w-xs">
      {/* Hire Me Button */}
      <button
        onClick={handleHireMe}
        onMouseEnter={() => setHireMeHover(true)}
        onMouseLeave={() => setHireMeHover(false)}
        className="relative overflow-hidden px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-lg font-semibold btn-hover w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        <div
          className={`absolute inset-0 bg-cyan-500/30 blur-xl ${hireMeHover ? "animate-pulse" : ""}`}
        />
        <span className="relative z-10 text-white flex items-center justify-center space-x-1 sm:space-x-2">
          <span className="text-sm sm:text-base">🚀</span>
          <span>Hire Me</span>
        </span>
      </button>

      {/* Secondary Buttons */}
      <div className="flex space-x-1.5 sm:space-x-2 md:space-x-3">
        <button className="flex-1 px-2 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 btn-hover">
          <span className="flex items-center justify-center space-x-1">
            <span className="text-sm sm:text-base">✨</span>
            <span className="hidden sm:inline">Portfolio</span>
          </span>
        </button>

        <button className="flex-1 px-2 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 btn-hover">
          <span className="flex items-center justify-center space-x-1">
            <span className="text-sm sm:text-base">📄</span>
            <span className="hidden sm:inline">Resume</span>
          </span>
        </button>
      </div>

      {/* Social Icons */}
      <div className="flex space-x-1.5 sm:space-x-2 md:space-x-3 mt-3 sm:mt-4 md:mt-6 justify-center">
        <SocialIcon
          icon="💼"
          label="LinkedIn"
          url="https://linkedin.com/in/said-abdelaziz"
          colorClass="bg-blue-500/20 hover:bg-blue-500/30"
        />
        <SocialIcon
          icon="💻"
          label="GitHub"
          url="https://github.com/x-aziz"
          colorClass="bg-gray-700/50 hover:bg-gray-600/50"
        />
        <SocialIcon
          icon="💻"
          label="Portfolio"
          url="https://abdelaziz-portfolio-vercel.vercel.app"
          colorClass="bg-gray-700/50 hover:bg-gray-600/50"
        />
        <SocialIcon
          icon="📧"
          label="Email"
          url="mailto:said.abd.el.aziz.cs@gmail.com"
          colorClass="bg-cyan-500/20 hover:bg-cyan-500/30"
        />
      </div>
    </div>
  );
}
