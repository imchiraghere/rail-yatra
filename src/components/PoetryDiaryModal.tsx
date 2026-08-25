import React from 'react';
import { X, Feather, Heart, BookOpen } from 'lucide-react';
import { NOSTALGIC_POETRY } from '../data/trainData';

interface PoetryDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PoetryDiaryModal: React.FC<PoetryDiaryModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-amber-500/30 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] p-6 text-slate-100 backdrop-blur-xl animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-amber-400 drop-shadow" />
            <div>
              <h3 className="text-base font-bold text-amber-300">
                सफ़र के बोल और यादें (Train Diary & Poetry)
              </h3>
              <p className="text-xs text-slate-400">
                Poetic musings of Indian railway journeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poetry cards */}
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
          {NOSTALGIC_POETRY.map((item, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="bg-gradient-to-br from-slate-800/40 to-slate-800/20 p-5 rounded-xl border border-amber-500/20 relative group hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] transition-all duration-300 animate-slide-up opacity-0 [animation-fill-mode:forwards]"
            >
              <div className="text-amber-500/30 text-3xl font-serif absolute top-2 right-4 select-none">
                “
              </div>
              <div className="space-y-1.5 text-sm sm:text-base text-amber-100 font-serif leading-relaxed">
                {item.lines.map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400 fill-current" />
                  {item.poet}
                </span>
                <span className="text-slate-500">Coach S-5, Seat 41</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          "हर सफ़र अपने अंदर एक दास्तान समेटे होता है।" 🚂
        </div>

      </div>
    </div>
  );
};
