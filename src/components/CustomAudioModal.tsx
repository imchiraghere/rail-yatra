import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Music, Check } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface CustomAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomTrackLoaded: (title: string, artist: string) => void;
}

export const CustomAudioModal: React.FC<CustomAudioModalProps> = ({
  isOpen,
  onClose,
  onCustomTrackLoaded
}) => {
  const [streamUrl, setStreamUrl] = useState('');
  const [songName, setSongName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playCustomAudioFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    onCustomTrackLoaded(cleanName, 'My Sleeper Track');
    setStatusMessage(`Loaded "${cleanName}" successfully!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;

    soundEngine.playCustomStreamUrl(streamUrl.trim());
    const title = songName.trim() || 'Custom Railway Stream';
    onCustomTrackLoaded(title, 'Online Audio');
    setStatusMessage(`Playing "${title}"!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl p-5 text-slate-100 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-amber-300">
                अपना मनपसंद गाना चलाएं (Play Your Music)
              </h3>
              <p className="text-xs text-slate-400">
                Load your MP3 or audio stream alongside train sounds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="space-y-4 py-4">
          {/* Option 1: File Upload */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-600 hover:border-amber-400 transition-colors text-center">
            <Upload className="w-7 h-7 text-amber-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-200">
              Upload an MP3 / WAV from your device
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Listen to your favorite old melodies with the train wheels
            </p>
            <label className="mt-3 inline-block px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow">
              Choose Audio File
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
            <div className="w-12 h-[1px] bg-slate-700" />
            <span>OR STREAM URL</span>
            <div className="w-12 h-[1px] bg-slate-700" />
          </div>

          {/* Option 2: Stream URL */}
          <form onSubmit={handleUrlSubmit} className="space-y-2">
            <input
              type="text"
              placeholder="Track name (optional)"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/stream.mp3"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!streamUrl.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Play
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
