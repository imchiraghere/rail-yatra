import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  BookOpen,
  Upload,
  Shuffle,
  Repeat,
  Maximize2,
  Minimize2,
  Radio,
  Train,
  ListMusic
} from 'lucide-react';
import { Song, TimeMode } from '../types';

interface MusicPlayerBarProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevSong: () => void;
  onNextSong: () => void;
  timeMode: TimeMode;
  onSelectTimeMode: (mode: TimeMode) => void;
  onOpenMixer: () => void;
  onOpenPoetry: () => void;
  onOpenUpload: () => void;
  onOpenPlaylist: () => void;
  isMinimalMode: boolean;
  onToggleMinimalMode: () => void;
  onSeek?: (timeSec: number) => void;
}

export const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onPrevSong,
  onNextSong,
  timeMode,
  onSelectTimeMode,
  onOpenMixer,
  onOpenPoetry,
  onOpenUpload,
  onOpenPlaylist,
  isMinimalMode,
  onToggleMinimalMode,
  onSeek
}) => {
  const [progress, setProgress] = useState(0); // percentage
  const [currentTimeSec, setCurrentTimeSec] = useState(88);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(true);

  // Advance playback timer when music is playing
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentTimeSec((prev) => {
          const next = prev + 1;
          if (next >= currentSong.duration) {
            onNextSong();
            return 0;
          }
          setProgress((next / currentSong.duration) * 100);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSong.duration, onNextSong]);

  // Reset when song changes
  useEffect(() => {
    setCurrentTimeSec(0);
    setProgress(0);
  }, [currentSong.id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setProgress(newPercent);
    const newTime = Math.floor((newPercent / 100) * currentSong.duration);
    setCurrentTimeSec(newTime);
    if (onSeek) {
      onSeek(newTime);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pointer-events-auto flex flex-col items-center">
      {/* Mood Selector Tabs floating above player bar */}
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-1 bg-black/20 p-1.5 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => onSelectTimeMode('golden_hour')}
          className={`px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13.5px] transition-all duration-300 flex items-center gap-2 ${timeMode === 'golden_hour'
            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
            : 'text-white/50 hover:text-white/90 hover:bg-white/5 border border-transparent'
            }`}
        >
          <span className="text-sm sm:text-base drop-shadow-md">🌅</span>
          <span className="hidden sm:inline font-medium font-display tracking-widest text-[15px]">
            शाम का सफर
          </span>
          <span className="sm:hidden font-medium tracking-wide">Golden</span>
        </button>

        <button
          onClick={() => onSelectTimeMode('monsoon')}
          className={`px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13.5px] transition-all duration-300 flex items-center gap-2 ${timeMode === 'monsoon'
            ? 'bg-sky-500/20 text-sky-200 border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
            : 'text-white/50 hover:text-white/90 hover:bg-white/5 border border-transparent'
            }`}
        >
          <span className="text-sm sm:text-base drop-shadow-md">🌧️</span>
          <span className="hidden sm:inline font-medium font-display tracking-widest text-[15px]">
            बरसात की यात्रा
          </span>
          <span className="sm:hidden font-medium tracking-wide">Monsoon</span>
        </button>

        <button
          onClick={() => onSelectTimeMode('midnight')}
          className={`px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13.5px] transition-all duration-300 flex items-center gap-2 ${timeMode === 'midnight'
            ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
            : 'text-white/50 hover:text-white/90 hover:bg-white/5 border border-transparent'
            }`}
        >
          <span className="text-sm sm:text-base drop-shadow-md">🌙</span>
          <span className="hidden sm:inline font-medium font-display tracking-widest text-[15px]">
            रात का सन्नाटा
          </span>
          <span className="sm:hidden font-medium tracking-wide">Midnight</span>
        </button>

        <button
          onClick={() => onSelectTimeMode('morning')}
          className={`px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13.5px] transition-all duration-300 flex items-center gap-2 ${timeMode === 'morning'
            ? 'bg-orange-500/20 text-orange-200 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
            : 'text-white/50 hover:text-white/90 hover:bg-white/5 border border-transparent'
            }`}
        >
          <span className="text-sm sm:text-base drop-shadow-md">☕</span>
          <span className="hidden sm:inline font-medium font-display tracking-widest text-[15px]">
            सुबह की चाय
          </span>
          <span className="sm:hidden font-medium tracking-wide">Morning</span>
        </button>
      </div>

      {/* Main Glassmorphic Pill Player */}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[50px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-1.5 sm:p-2.5 text-white flex items-center gap-3 transition-all relative overflow-hidden">

        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-[50px] pointer-events-none border border-white/5" />

        {/* Left: Album Artwork (Circular Vinyl Style) */}
        <div
          onClick={onOpenPlaylist}
          className={`relative w-12 h-12 sm:w-[56px] sm:h-[56px] rounded-full flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden border border-white/10 cursor-pointer group ml-1 animate-[spin_10s_linear_infinite] ${!isPlaying ? '[animation-play-state:paused]' : ''}`}
          style={{ backgroundColor: currentSong.coverColor || '#1e293b' }}
        >
          {/* Vinyl Image / Inner graphics */}
          <div className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop')` }}></div>
          {/* Vinyl Grooves */}
          <div className="absolute inset-1.5 rounded-full border border-black/40" />
          <div className="absolute inset-3.5 rounded-full border border-black/20" />
          {/* Center Hole */}
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-black/40 z-10 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Center: Info & Progress */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
          <h4 className="text-[13px] sm:text-[15px] font-bold text-white truncate drop-shadow-md tracking-wide">
            {currentSong.title}
          </h4>
          <p className="text-[11px] sm:text-[12px] text-white/60 truncate mb-1 mt-0 font-medium">
            {currentSong.artist}
          </p>

          {/* Progress Bar inside info section */}
          <div className="w-full flex flex-col gap-1 pr-2">
            <div
              onClick={handleSeek}
              className="w-full h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
            >
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full transition-all duration-150 relative group-hover:bg-amber-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </div>
            {/* Time display */}
            <div className="text-[9px] sm:text-[10px] text-white/50 font-medium tracking-wider">
              {formatTime(currentTimeSec)} / {formatTime(currentSong.duration)}
            </div>
          </div>
        </div>

        {/* Right: Playback Controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 pr-2">
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center transition-all hidden sm:flex ${isShuffle ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/60 hover:text-white'}`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPrevSong}
            className="w-8 h-8 flex items-center justify-center cursor-pointer text-white/70 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all mx-0.5"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={onNextSong}
            className="w-8 h-8 cursor-pointer flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Queue / Tools toggle menu button */}
          <button
            onClick={onOpenPlaylist}
            className="w-8 h-8 flex items-center justify-center cursor-pointer text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all hidden sm:flex"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Extra Action Buttons (Mixer, Poetry, etc) floating below */}
      {!isMinimalMode && (
        <div className="flex items-center gap-2 sm:gap-3 mt-4 text-white/70">
          <button onClick={onOpenMixer} className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors bg-white/5 backdrop-blur-sm" title="Ambient Mixer">
            <Sliders className="w-4 h-4" />
          </button>
          <button onClick={onOpenPoetry} className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors bg-white/5 backdrop-blur-sm" title="Train Poetry">
            <BookOpen className="w-4 h-4" />
          </button>
          {/* <button onClick={onOpenUpload} className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors bg-white/5 backdrop-blur-sm" title="Upload">
            <Upload className="w-4 h-4" />
          </button> */}
          {/* <button onClick={onToggleMinimalMode} className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors bg-white/5 backdrop-blur-sm" title="Minimal Mode">
            <Maximize2 className="w-4 h-4" />
          </button> */}
        </div>
      )}
    </div>
  );
};
