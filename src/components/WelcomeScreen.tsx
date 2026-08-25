import React from 'react';
import { Train } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  return (
    <div
      onClick={onEnter}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-slate-100 cursor-pointer animate-fade-in group"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-slate-950 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-8 p-6 text-center max-w-lg animate-slide-up">

        {/* Icon & Title */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-500">
            <Train className="w-10 h-10 text-amber-400 drop-shadow-lg" />
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 drop-shadow-sm mb-2">
              Indian Railway Nostalgia
            </h1>
            <p className="text-slate-400 font-serif text-lg italic">
              "हर सफर अपने अंदर एक दास्तान समेटे होता है।"
            </p>
          </div>
        </div>

        {/* Start Instruction */}
        <div className="pt-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-amber-500/30 px-8 py-4 rounded-2xl shadow-xl shadow-amber-900/20 group-hover:border-amber-500/50 group-hover:shadow-amber-900/40 transition-all duration-300">
            <p className="text-amber-200 font-medium text-lg flex items-center gap-3">
              <span className="animate-pulse">🎧</span>
              Click anywhere to begin the journey
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Please wear headphones for the best 3D audio experience
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
