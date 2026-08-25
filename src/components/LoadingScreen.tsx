import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Boarding the train...');
  const [fadeOut, setFadeOut] = useState(false);

  const steps = [
    { pct: 15, text: 'Preparing your berth... 🛏️' },
    { pct: 35, text: 'Loading ambient sounds... 🎶' },
    { pct: 55, text: 'Chai wala is ready... ☕' },
    { pct: 75, text: 'Train is departing... 🚂' },
    { pct: 92, text: 'Almost there... धक-धक' },
    { pct: 100, text: 'Welcome aboard! 🌅' },
  ];

  useEffect(() => {
    let stepIdx = 0;
    const run = () => {
      if (stepIdx >= steps.length) {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 700);
        }, 400);
        return;
      }
      const step = steps[stepIdx];
      setProgress(step.pct);
      setStatusText(step.text);
      stepIdx++;
      const delay = stepIdx === steps.length ? 600 : Math.random() * 400 + 350;
      setTimeout(run, delay);
    };
    const initial = setTimeout(run, 300);
    return () => clearTimeout(initial);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Animated background track lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-32 flex flex-col justify-end gap-3 opacity-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-[200%] h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-[slideLeft_2.5s_linear_infinite]"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </div>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,6,23,0.85) 100%)'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 max-w-sm w-full">

        {/* Animated Train Icon with glowing orbit */}
        <div className="relative flex flex-col items-center justify-center w-32 h-32">
          <div className="absolute w-32 h-32 rounded-full bg-amber-500/10 animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="absolute w-24 h-24 rounded-full bg-amber-500/15 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-600/20 to-orange-900/20 border border-amber-500/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.25)]">
            <span className="text-5xl animate-[bounce_1.6s_ease-in-out_infinite]">🚂</span>
          </div>
          {/* Spinning orbit */}
          <div className="absolute w-32 h-32 rounded-full border border-amber-500/15 animate-spin" style={{ animationDuration: '5s' }}>
            {[0, 120, 240].map((deg) => (
              <div
                key={deg}
                className="absolute w-2 h-2 rounded-full bg-amber-400"
                style={{
                  top: '50%', left: '50%',
                  boxShadow: '0 0 6px rgba(245,158,11,0.8)',
                  transform: `rotate(${deg}deg) translateX(60px) translate(-50%, -50%)`
                }}
              />
            ))}
          </div>
        </div>

        {/* App Title */}
        <div className="text-center space-y-1.5">
          <h1 className="text-4xl font-bold text-white font-display tracking-widest drop-shadow-lg">
            ट्रेन वाला
          </h1>
          <p className="text-xs text-amber-400/70 tracking-[0.25em] uppercase font-light">
            Indian Railway Nostalgia
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-3">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-orange-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(245,158,11,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 transition-all duration-500">{statusText}</span>
            <span className="text-amber-400 font-mono font-bold">{progress}%</span>
          </div>
        </div>

        {/* Bouncing dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom track slogan */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 text-white/15 text-xs tracking-[0.3em] uppercase">
          <div className="w-10 h-px bg-white/15" />
          <span>धक धक धक धक</span>
          <div className="w-10 h-px bg-white/15" />
        </div>
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
