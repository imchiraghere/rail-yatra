import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Train } from 'lucide-react';

export const OfflinePage: React.FC = () => {
  const [dots, setDots] = useState('');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)'
        }} />
        {/* Faded railway tracks pattern */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/5 to-transparent w-full"
            style={{ top: `${10 + i * 12}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 max-w-sm w-full text-center">

        {/* Icon cluster */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute w-28 h-28 rounded-full bg-red-500/10 animate-pulse" />
          <div className="w-20 h-20 rounded-full bg-slate-900 border border-red-500/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <WifiOff className="w-9 h-9 text-red-400" />
          </div>
          {/* Pulsing rings */}
          {[1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-red-500/20 animate-ping"
              style={{
                width: `${i * 40 + 80}px`,
                height: `${i * 40 + 80}px`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Stalled train emoji */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl grayscale opacity-50">🚂</span>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white font-display tracking-widest">
            ट्रेन रुकी हुई है
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            No internet connection.<br />
            The train can't move without a signal!
          </p>
          <p className="text-white/30 text-xs tracking-widest">Waiting for network{dots}</p>
        </div>

        {/* Retry button */}
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="relative group flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-amber-400/50 backdrop-blur-xl px-6 py-3 rounded-full text-white font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-amber-400 ${retrying ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span>{retrying ? 'Retrying...' : 'Try Again'}</span>
        </button>

        {/* Tip */}
        <p className="text-white/20 text-xs">
          Meanwhile, the chai is getting cold ☕
        </p>
      </div>
    </div>
  );
};
