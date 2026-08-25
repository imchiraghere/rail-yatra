import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { NOSTALGIC_POETRY } from '../data/trainData';

export const PoetryWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cyclePoetry = () => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % NOSTALGIC_POETRY.length);
        setIsVisible(true);
      }, 1000); // Wait for fade out before changing text
    };

    const intervalId = setInterval(cyclePoetry, 15000); // Change every 15 seconds
    return () => clearInterval(intervalId);
  }, []);

  const currentPoetry = NOSTALGIC_POETRY[currentIndex];

  return (
    <div
      className={`fixed bottom-16 right-6 z-30 max-w-sm hidden md:block transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
    >
      <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-amber-500/20 shadow-[0_8px_30px_rgba(245,158,11,0.08)] group hover:border-amber-500/40 hover:bg-slate-900/60 transition-all duration-500">
        <div className="text-amber-500/30 text-4xl font-serif absolute -top-1 right-4 select-none">
          “
        </div>
        <div className="space-y-1.5 text-sm text-amber-100/90 font-serif leading-relaxed pr-6">
          {currentPoetry.lines.map((line, lIdx) => (
            <p key={lIdx}>{line}</p>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-amber-500/10 flex items-center justify-between text-[11px] text-amber-400/70 font-mono">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-red-400/70 fill-current" />
            {currentPoetry.poet}
          </span>
          <span className="text-slate-500">Coach S-5, Window Seat</span>
        </div>
      </div>
    </div>
  );
};
