import React, { useState, useEffect } from 'react';
import { Train, Clock, Compass, Volume2, VolumeX, Sparkles, Coffee, BellRing } from 'lucide-react';
import { JourneyInfo, TimeMode } from '../types';

interface JourneyStatusHeaderProps {
  journey: JourneyInfo;
  timeMode: TimeMode;
  onPullLocoHorn: () => void;
  onChaiCall: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPlaylist: () => void;
}

export const JourneyStatusHeader: React.FC<JourneyStatusHeaderProps> = ({
  journey,
  timeMode,
  onPullLocoHorn,
  onChaiCall,
  isMuted,
  onToggleMute,
  onOpenPlaylist
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update every second so colon blinks or changes immediately, but display can be minutes
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getEmojiForTime = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 20) return '🌇';
    return '🌙';
  };

  return (
    <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between pointer-events-none z-30">
      {/* Left: Time Pill */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        <div className="group relative bg-black/40 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)] text-amber-200 text-xs sm:text-sm font-semibold hover:bg-black/60 transition-all duration-500 overflow-hidden cursor-default">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[pulse_3s_ease-in-out_infinite]" />
          <span className="text-sm sm:text-base drop-shadow-md group-hover:scale-110 transition-transform duration-300">
            {getEmojiForTime(currentTime)}
          </span>
          <span className="relative z-10 tracking-wide font-mono">
            {formatTime(currentTime)}
          </span>
        </div>

        {/* Coach and Seat Badge */}
        <div className="hidden sm:flex group relative bg-black/40 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)] text-slate-300 text-xs font-mono hover:bg-black/60 transition-all duration-500 cursor-default">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[pulse_3s_ease-in-out_infinite]" />
          <span className="text-amber-400 font-bold relative z-10">Coach {journey.coachNumber}</span>
          <span className="text-slate-500 relative z-10">•</span>
          <span className="relative z-10">Seat {journey.seatNumber}</span>
        </div>
      </div>

      {/* Center: Journey Distance Pill */}
      <div className="pointer-events-auto group hidden min-[400px]:block mr-10 -translate-y-3">
        <div className="relative bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-emerald-500/40 hover:border-emerald-400/60 px-4 py-1.5 rounded-full flex items-center gap-2 sm:gap-2.5 shadow-[0_4px_16px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_24px_rgba(16,185,129,0.25)] text-slate-200 text-xs sm:text-sm font-medium transition-all duration-500 overflow-hidden cursor-default">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[pulse_3s_ease-in-out_infinite]" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399] relative z-10" />
          <span className="font-semibold text-emerald-300 tracking-wide relative z-10">{journey.currentKm} km</span>
          <span className="text-slate-300/80 hidden md:inline relative z-10">on the railway</span>
          <span className="text-slate-500 hidden lg:inline relative z-10">•</span>
          <span className="text-amber-300/90 text-[15px] hidden lg:inline relative z-10 drop-shadow-md font-medium font-display tracking-widest">
            {journey.trainNameHindi}
          </span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Instant Chai Call */}
        <button
          onClick={onChaiCall}
          title="Chai Vendor Call (चाय गरम चाय)"
          className="relative group bg-black/40 hover:bg-amber-950/70 active:scale-95 border border-amber-500/40 hover:border-amber-400/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_4px_12px_rgba(245,158,11,0.1)] hover:shadow-[0_4px_20px_rgba(245,158,11,0.3)] text-amber-300 text-xs transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Coffee className="w-4 h-4 text-amber-400 relative z-10 group-hover:-rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline relative z-10 font-medium font-display tracking-widest text-[14px]">चाय</span>
        </button>

        {/* Loco Horn Button */}
        <button
          onClick={onPullLocoHorn}
          title="Sound Train Horn (WAP-7 Horn)"
          className="relative group bg-black/40 hover:bg-red-950/70 active:scale-95 border border-red-500/40 hover:border-red-400/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.1)] hover:shadow-[0_4px_20px_rgba(239,68,68,0.3)] text-red-300 text-xs transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <BellRing className="w-4 h-4 text-red-400 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline relative z-10 font-medium font-display tracking-widest text-[14px]">हॉर्न</span>
        </button>

        {/* Mute / Unmute Master */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute All Sounds' : 'Mute Master Audio'}
          className="relative group bg-black/40 hover:bg-white/10 active:scale-95 p-1.5 sm:p-2 rounded-full border border-white/20 hover:border-white/40 text-slate-300 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-red-400 transition-transform group-hover:scale-110" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>
    </div>
  );
};
