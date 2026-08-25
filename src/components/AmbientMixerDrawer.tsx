import React from 'react';
import { X, Volume2, Wind, Disc, Coffee, CloudRain, BellRing, Gauge } from 'lucide-react';
import { AmbientSettings } from '../types';

interface AmbientMixerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AmbientSettings;
  onUpdateSettings: (newSettings: Partial<AmbientSettings>) => void;
  onPullLocoHorn: () => void;
  onChaiCall: () => void;
  onSamosaCall?: () => void;
  onStationAnnouncement?: () => void;
}

export const AmbientMixerDrawer: React.FC<AmbientMixerDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onPullLocoHorn,
  onChaiCall,
  onSamosaCall,
  onStationAnnouncement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-amber-500/30 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] p-5 text-slate-100 backdrop-blur-xl animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">🚂</span>
            <div>
              <h3 className="text-base font-bold text-amber-300">
                रेलवे साउंडस्केप मिक्सर (Railway Mixer)
              </h3>
              <p className="text-xs text-slate-400">
                Adjust authentic train ambience, wheels rhythm & atmosphere
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

        {/* Mixer Channels */}
        <div className="space-y-4 py-4 max-h-[65vh] overflow-y-auto pr-1">

          {/* 1. Track Click-Clack Rhythm (पहियों की धक-धक) */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-2 hover:border-amber-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Disc className="w-4 h-4 text-amber-400" />
                <span>Track Rhythm (पटरियों की धक-धक)</span>
              </div>
              <span className="text-xs font-mono text-amber-300">
                {Math.round(settings.trainRhythm * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.trainRhythm}
              onChange={(e) => onUpdateSettings({ trainRhythm: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />

            {/* Train Speed selector */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" /> Speed:
              </span>
              {(['slow', 'medium', 'fast'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => onUpdateSettings({ trainSpeed: spd })}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium uppercase transition-all ${settings.trainSpeed === spd
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                  {spd} ({spd === 'slow' ? '60 km/h' : spd === 'medium' ? '88 km/h' : '110 km/h'})
                </button>
              ))}
            </div>
          </div>

          {/* 2. Indian Railway Ceiling Fan (छत का पंखा) */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-2 hover:border-sky-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>Ceiling Fan Hum (पंखा)</span>
              </div>
              <span className="text-xs font-mono text-sky-300">
                {Math.round(settings.fanHum * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.fanHum}
              onChange={(e) => onUpdateSettings({ fanHum: parseFloat(e.target.value) })}
              className="w-full accent-sky-400 cursor-pointer"
            />

            {/* Fan speed buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              {(['off', 'slow', 'medium', 'fast'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => onUpdateSettings({ fanSpeed: spd })}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium uppercase transition-all ${settings.fanSpeed === spd
                    ? 'bg-sky-400 text-slate-950 font-bold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Window Breeze & Open Air (खिड़की की हवा) */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-2 hover:border-teal-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Wind className="w-4 h-4 text-teal-400" />
                <span>Window Breeze (हवा का झोंका)</span>
              </div>
              <span className="text-xs font-mono text-teal-300">
                {Math.round(settings.windBreeze * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.windBreeze}
              onChange={(e) => onUpdateSettings({ windBreeze: parseFloat(e.target.value) })}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>

          {/* 4. Chai Vendor Station Ambience ("चाय गरम...") */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-2 hover:border-amber-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Coffee className="w-4 h-4 text-amber-500" />
                <span>Chai Vendor Calls ("चाय गरम...")</span>
              </div>
              <span className="text-xs font-mono text-amber-400">
                {Math.round(settings.chaiVendor * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.chaiVendor}
              onChange={(e) => onUpdateSettings({ chaiVendor: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />

            <button
              onClick={onChaiCall}
              className="w-full py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-medium transition-colors"
            >
              Test Chai Call ☕ ("चाय... गरम चाय!")
            </button>
          </div>

          {/* 5. Monsoon Rain on Coach Roof (बरसात) */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-2 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span>Monsoon Rain on Tin Roof (बारिश)</span>
              </div>
              <span className="text-xs font-mono text-blue-300">
                {Math.round(settings.rainIntensity * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.rainIntensity}
              onChange={(e) => onUpdateSettings({ rainIntensity: parseFloat(e.target.value) })}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          {/* 6. Sound Effect Buttons */}
          <div className="pt-2 grid grid-cols-1 gap-2.5">
            <button
              onClick={onPullLocoHorn}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-700/80 to-amber-700/80 hover:from-red-600 hover:to-amber-600 border border-red-500/30 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <BellRing className="w-4 h-4" />
              🚂 Blow Locomotive Horn (WAP-7)
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onChaiCall}
                className="py-2.5 rounded-xl bg-amber-900/50 hover:bg-amber-800/70 border border-amber-500/30 text-amber-200 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                ☕ Chai Wala
              </button>
              {/* <button
                onClick={onSamosaCall}
                className="py-2.5 rounded-xl bg-orange-900/50 hover:bg-orange-800/70 border border-orange-500/30 text-orange-200 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                🥟 Samosa Wala
              </button> */}
              <button
                onClick={onStationAnnouncement}
                className="w-full py-2 rounded-xl bg-indigo-900/50 hover:bg-indigo-800/60 border border-indigo-500/30 text-indigo-200 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                📢 Station Announcement (PA System)
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
