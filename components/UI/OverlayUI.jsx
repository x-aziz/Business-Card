import React from 'react';
import StatsDisplay from './StatsDisplay';
import CTAButtons from './CTAButtons';

export default function OverlayUI() {
  return (
    <>
      {/* Stats - responsive positioning
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <StatsDisplay />
      </div> */}
      
      {/* CTA Buttons - responsive positioning */}
      {/* <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10">
        <CTAButtons />
      </div> */}
      
      {/* Tooltip - responsive and hide on mobile */}
      {/* <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-gray-900/80 backdrop-blur-sm px-3 py-2 sm:px-4 rounded-lg border border-cyan-500/30 animate-pulse">
          <p className="text-cyan-300 text-xs sm:text-sm">
            Hover over the card, then click to lift and rotate
          </p>
        </div>
      </div> */}
    </>
  );
}