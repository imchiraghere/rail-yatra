/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TrainInterior } from './components/TrainInterior';
import { MusicPlayerBar } from './components/MusicPlayerBar';
import { JourneyStatusHeader } from './components/JourneyStatusHeader';
import { AmbientMixerDrawer } from './components/AmbientMixerDrawer';
import { PlaylistDrawer } from './components/PlaylistDrawer';
import { PoetryDiaryModal } from './components/PoetryDiaryModal';
import { CustomAudioModal } from './components/CustomAudioModal';
import { LoadingScreen } from './components/LoadingScreen';
import { OfflinePage } from './components/OfflinePage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PoetryWidget } from './components/PoetryWidget';
import { soundEngine } from './audio/soundEngine';
import { PLAYLIST, INITIAL_JOURNEY, STATIONS } from './data/trainData';
import { TimeMode, AmbientSettings, Song, JourneyInfo } from './types';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

// @ts-ignore
import bgVideo from '../assets/background.mp4';

export default function App() {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [timeMode, setTimeMode] = useState<TimeMode>('golden_hour');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimalMode, setIsMinimalMode] = useState(false);
  const [showBranding, setShowBranding] = useState(true);

  // YouTube State
  const [ytPlayer, setYtPlayer] = useState<YouTubePlayer | null>(null);
  const [useYoutube, setUseYoutube] = useState(true);
  const [ytSongInfo, setYtSongInfo] = useState({ title: 'Loading Playlist...', duration: 300, index: 0, author: 'YouTube Music', id: 'init' });

  // Drawers & Modals
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isPoetryOpen, setIsPoetryOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Journey details
  const [journey, setJourney] = useState<JourneyInfo>(INITIAL_JOURNEY);

  // Ambient sound levels
  const [ambientSettings, setAmbientSettings] = useState<AmbientSettings>({
    masterVolume: 1.0,
    trainRhythm: 0.10,
    trainSpeed: 'medium',
    fanHum: 0.10,
    fanSpeed: 'medium',
    windBreeze: 0.10,
    chaiVendor: 0.20,
    rainIntensity: 0.0,
    locoHornEnabled: true
  });

  const currentSong = PLAYLIST[currentSongIndex];

  // Online/offline detection
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Switch time mode with corresponding ambient rain adjustments
  const handleSelectTimeMode = (mode: TimeMode) => {
    setTimeMode(mode);
    if (mode === 'monsoon') {
      setAmbientSettings((prev) => ({ ...prev, rainIntensity: 0.8 }));
      soundEngine.setRainIntensity(0.8);
      showToast('🌧️ बरसात की यात्रा (Monsoon Journey)');
    } else if (mode === 'midnight') {
      setAmbientSettings((prev) => ({ ...prev, rainIntensity: 0.0 }));
      soundEngine.setRainIntensity(0.0);
      showToast('🌙 रात का सन्नाटा (Midnight Express)');
    } else if (mode === 'morning') {
      setAmbientSettings((prev) => ({ ...prev, rainIntensity: 0.0 }));
      soundEngine.setRainIntensity(0.0);
      showToast('☕ सुबह की चाय (Morning Dawn)');
    } else {
      setAmbientSettings((prev) => ({ ...prev, rainIntensity: 0.0 }));
      soundEngine.setRainIntensity(0.0);
      showToast('🌅 शाम का सफर (Golden Hour)');
    }
  };

  const handleCycleTimeMode = () => {
    const modes: TimeMode[] = ['golden_hour', 'monsoon', 'midnight', 'morning'];
    const nextIdx = (modes.indexOf(timeMode) + 1) % modes.length;
    handleSelectTimeMode(modes[nextIdx]);
  };

  // Sound Engine Controls
  const handleTogglePlay = () => {
    soundEngine.init();
    setHasStartedAudio(true);

    if (isPlaying) {
      if (useYoutube && ytPlayer) {
        ytPlayer.pauseVideo();
      } else {
        soundEngine.pauseMusic();
      }
      setIsPlaying(false);
    } else {
      if (useYoutube && ytPlayer) {
        ytPlayer.playVideo();
      } else {
        soundEngine.playSong(currentSong.audioKey);
      }
      setIsPlaying(true);
    }
  };

  const handleSelectSong = (song: Song) => {
    setUseYoutube(false);
    if (ytPlayer) ytPlayer.pauseVideo();

    const idx = PLAYLIST.findIndex((s) => s.id === song.id);
    if (idx !== -1) {
      setCurrentSongIndex(idx);
      soundEngine.init();
      setHasStartedAudio(true);
      soundEngine.playSong(song.audioKey);
      setIsPlaying(true);
      showToast(`🎵 Playing: ${song.title}`);
    }
    setIsPlaylistOpen(false);
  };

  const handleNextSong = useCallback(() => {
    if (useYoutube && ytPlayer) {
      ytPlayer.nextVideo();
    } else {
      const nextIdx = (currentSongIndex + 1) % PLAYLIST.length;
      setCurrentSongIndex(nextIdx);
      const nextSong = PLAYLIST[nextIdx];
      if (isPlaying) {
        soundEngine.playSong(nextSong.audioKey);
        showToast(`🎵 ${nextSong.title}`);
      }
    }
  }, [currentSongIndex, isPlaying, useYoutube, ytPlayer]);

  const handlePrevSong = () => {
    if (useYoutube && ytPlayer) {
      ytPlayer.previousVideo();
    } else {
      const prevIdx = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
      setCurrentSongIndex(prevIdx);
      const prevSong = PLAYLIST[prevIdx];
      if (isPlaying) {
        soundEngine.playSong(prevSong.audioKey);
        showToast(`🎵 ${prevSong.title}`);
      }
    }
  };

  const handlePullLocoHorn = () => {
    soundEngine.init();
    setHasStartedAudio(true);
    soundEngine.playLocoHorn();
    showToast('🚂 WAP-7 Twin-Tone Horn Sounded!');
  };

  const handleChaiCall = () => {
    soundEngine.init();
    setHasStartedAudio(true);
    soundEngine.triggerChaiCall();
    showToast('☕ "चाय... गरम चाय!"');
  };

  const handleSamosaCall = () => {
    soundEngine.init();
    setHasStartedAudio(true);
    soundEngine.triggerSamosaCall();
    showToast('🥟 "समोसा... गरम समोसा!"');
  };

  const handleStationAnnouncement = () => {
    soundEngine.init();
    setHasStartedAudio(true);
    soundEngine.playStationAnnouncement();
    showToast('📢 Station announcement!');
  };

  const handleChaiSip = () => {
    soundEngine.init();
    soundEngine.triggerChaiCall();
    showToast('☕ गर्म कुल्हड़ वाली चाय की चुस्की!');
  };

  const handleToggleFanSpeed = () => {
    const speeds: ('off' | 'slow' | 'medium' | 'fast')[] = ['off', 'slow', 'medium', 'fast'];
    const nextIdx = (speeds.indexOf(ambientSettings.fanSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setAmbientSettings((prev) => ({ ...prev, fanSpeed: nextSpeed }));
    soundEngine.startFanAmbience(nextSpeed);
    showToast(`💨 Railway Fan: ${nextSpeed.toUpperCase()}`);
  };

  const handleUpdateAmbientSettings = (newSettings: Partial<AmbientSettings>) => {
    setAmbientSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.trainRhythm !== undefined) {
        soundEngine.setChannelVolume('track', updated.trainRhythm);
      }
      if (newSettings.trainSpeed !== undefined) {
        soundEngine.startTrackRhythm(updated.trainSpeed);
        const speedMap = { slow: 60, medium: 88, fast: 110 };
        setJourney((j) => ({ ...j, speedKmh: speedMap[updated.trainSpeed] }));
      }
      if (newSettings.fanHum !== undefined) {
        soundEngine.setChannelVolume('fan', updated.fanHum);
      }
      if (newSettings.fanSpeed !== undefined) {
        soundEngine.startFanAmbience(updated.fanSpeed);
      }
      if (newSettings.windBreeze !== undefined) {
        soundEngine.setChannelVolume('wind', updated.windBreeze);
      }
      if (newSettings.chaiVendor !== undefined) {
        soundEngine.setChannelVolume('chai', updated.chaiVendor);
      }
      if (newSettings.rainIntensity !== undefined) {
        soundEngine.setRainIntensity(updated.rainIntensity);
      }
      return updated;
    });
  };

  const handleToggleMute = () => {
    soundEngine.init();
    if (isMuted) {
      soundEngine.setMasterVolume(ambientSettings.masterVolume);
      if (ytPlayer) ytPlayer.unMute();
      setIsMuted(false);
      showToast('🔊 Audio Unmuted');
    } else {
      soundEngine.setMasterVolume(0);
      if (ytPlayer) ytPlayer.mute();
      setIsMuted(true);
      showToast('🔇 Audio Muted');
    }
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    setYtPlayer(event.target);
    event.target.setVolume(100);
    // Explicitly cue the playlist to ensure it loads
    event.target.cuePlaylist({ list: 'PLluqBUTOXDHUjNguM2wgfaVJhC0OHTTqB' });
    const data = event.target.getVideoData();
    setYtSongInfo(prev => ({ ...prev, title: data?.title || 'YouTube Track', author: data?.author || 'YouTube' }));
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) { // Playing
      setIsPlaying(true);
      const data = event.target.getVideoData();
      const dur = event.target.getDuration();
      setYtSongInfo({
        title: data.title || 'Unknown Title',
        author: data.author || 'YouTube',
        duration: dur,
        index: event.target.getPlaylistIndex(),
        id: data.video_id || `yt-${event.target.getPlaylistIndex()}`
      });
    } else if (event.data === 2) { // Paused
      setIsPlaying(false);
    } else if (event.data === 0) { // Ended
      // React YouTube playlist automatically moves to next song
    }
  };

  const effectiveSong = useYoutube ? {
    id: ytSongInfo.id,
    title: ytSongInfo.title,
    artist: ytSongInfo.author,
    album: 'YouTube Music Playlist',
    duration: ytSongInfo.duration || 300,
    genre: 'YouTube Playlist',
    coverColor: '#cc0000',
    mood: 'Vibe',
    lyricsSnippet: '',
    audioKey: 'yt'
  } : currentSong;

  const handleSeek = (timeSec: number) => {
    if (useYoutube && ytPlayer) {
      ytPlayer.seekTo(timeSec, true);
    }
  };

  // Simulate journey distance increments
  useEffect(() => {
    const timer = setInterval(() => {
      setJourney((prev) => {
        const nextKm = prev.currentKm + 1;
        if (nextKm >= prev.totalDistanceKm) {
          return { ...prev, currentKm: 0 };
        }
        return { ...prev, currentKm: nextKm };
      });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Show loader on first visit
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // Show offline page when network is lost
  if (isOffline) {
    return <OfflinePage />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col justify-between select-none">

      {/* 1. TOP HEADER STATUS BAR */}
      {!isMinimalMode && (
        <JourneyStatusHeader
          journey={journey}
          timeMode={timeMode}
          onPullLocoHorn={handlePullLocoHorn}
          onChaiCall={handleChaiCall}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
        />
      )}

      {/* 2. THE MAIN TRAIN COACH INTERIOR WITH MOVING PARALLAX WINDOW */}
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center overflow-hidden">

        {/* Local Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-20 opacity-80"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* {!isMinimalMode && (
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <TrainInterior
              timeMode={timeMode}
              speedKmh={journey.speedKmh}
              ambientSettings={ambientSettings}
              onToggleFanSpeed={handleToggleFanSpeed}
              onChaiSip={handleChaiSip}
              onPullLocoHorn={handlePullLocoHorn}
              onCycleTimeMode={handleCycleTimeMode}
              showBranding={showBranding && !isMinimalMode}
            />
          </div>
        )} */}
      </div>

      {/* 3. FULL-PAGE WELCOME SCREEN FOR AUDIO INIT */}
      {!hasStartedAudio && (
        <WelcomeScreen
          onEnter={() => {
            soundEngine.init();
            setHasStartedAudio(true);
            handleTogglePlay();
          }}
        />
      )}

      {/* 4. TOAST NOTIFICATION BADGE */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-amber-500/50 backdrop-blur-md px-4 py-1.5 rounded-full text-amber-200 text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2 transition-all">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* POETRY WIDGET */}
      <PoetryWidget />

      {/* 5. FLOATING BOTTOM MUSIC PLAYER */}
      <div className="relative z-30 pb-4 sm:pb-6">
        <MusicPlayerBar
          currentSong={effectiveSong}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onPrevSong={handlePrevSong}
          onNextSong={handleNextSong}
          timeMode={timeMode}
          onSelectTimeMode={handleSelectTimeMode}
          onOpenMixer={() => setIsMixerOpen(true)}
          onOpenPoetry={() => setIsPoetryOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          isMinimalMode={isMinimalMode}
          onToggleMinimalMode={() => {
            setIsMinimalMode(!isMinimalMode);
            showToast(isMinimalMode ? 'Standard Mode' : 'Cinematic Wallpaper Mode');
          }}
          onSeek={handleSeek}
        />
      </div>

      {/* 6. MODALS & DRAWERS */}
      <AmbientMixerDrawer
        isOpen={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        settings={ambientSettings}
        onUpdateSettings={handleUpdateAmbientSettings}
        onPullLocoHorn={handlePullLocoHorn}
        onChaiCall={handleChaiCall}
        onSamosaCall={handleSamosaCall}
        onStationAnnouncement={handleStationAnnouncement}
      />

      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playlist={PLAYLIST}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSelectSong={handleSelectSong}
      />

      <PoetryDiaryModal
        isOpen={isPoetryOpen}
        onClose={() => setIsPoetryOpen(false)}
      />

      <CustomAudioModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCustomTrackLoaded={(title, artist) => {
          showToast(`Now Playing: ${title}`);
        }}
      />

      {/* Hidden YouTube Player */}
      <div className="hidden pointer-events-none">
        <YouTube
          // videoId="l2dL5SN5jO4"
          opts={{
            playerVars: {
              listType: 'playlist',
              list: 'PLluqBUTOXDHUjNguM2wgfaVJhC0OHTTqB',
              // list: 'PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4',
              autoplay: 0,
              controls: 0,
            }
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>

    </main>
  );
}
