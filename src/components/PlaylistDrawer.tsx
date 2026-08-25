import React from 'react';
import { X, Play, Music, Sparkles } from 'lucide-react';
import { Song } from '../types';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Song[];
  currentSong: Song;
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
}

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({
  isOpen,
  onClose,
  playlist,
  currentSong,
  isPlaying,
  onSelectSong
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-amber-500/30 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] p-5 text-slate-100 backdrop-blur-xl animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-400 drop-shadow-md" />
            <div>
              <h3 className="text-base font-bold text-amber-300">
                सफ़र के सदाबहार नग़मे (Train Playlist)
              </h3>
              <p className="text-xs text-slate-400">
                Curated Indian Sleeper Nostalgia Tracks & Lo-Fi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of songs */}
        <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-1">
          {playlist.map((song, idx) => {
            const isCurrent = song.id === currentSong.id;
            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelectSong(song);
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between gap-3 border hover:-translate-y-0.5 hover:shadow-lg ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-900/20 border-amber-500/50 text-amber-200 shadow-amber-900/20'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    style={{ backgroundColor: song.coverColor }}
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow border border-white/20"
                  >
                    {isCurrent && isPlaying ? (
                      <span className="animate-pulse">▶</span>
                    ) : (
                      <span>0{idx + 1}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                      {song.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {song.artist}
                    </p>
                    <p className="text-[11px] text-amber-400/70 truncate italic mt-0.5">
                      {song.lyricsSnippet}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-slate-700 block">
                    {song.genre}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
