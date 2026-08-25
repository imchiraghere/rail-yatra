import React, { useState } from 'react';
import { MovingWindow } from './MovingWindow';
import { TimeMode, AmbientSettings } from '../types';

interface TrainInteriorProps {
  timeMode: TimeMode;
  speedKmh: number;
  ambientSettings: AmbientSettings;
  onToggleFanSpeed: () => void;
  onChaiSip: () => void;
  onPullLocoHorn: () => void;
  onCycleTimeMode: () => void;
  showBranding: boolean;
}

export const TrainInterior: React.FC<TrainInteriorProps> = ({
  timeMode,
  speedKmh,
  ambientSettings,
  onToggleFanSpeed,
  onChaiSip,
  onPullLocoHorn,
  onCycleTimeMode,
  showBranding
}) => {
  const [isChaiSteaming, setIsChaiSteaming] = useState(true);
  const [windowGrillOpen, setWindowGrillOpen] = useState(false);

  // Fan rotation speed class
  const getFanAnimation = () => {
    switch (ambientSettings.fanSpeed) {
      case 'slow':
        return 'animate-spin [animation-duration:1.4s]';
      case 'fast':
        return 'animate-spin [animation-duration:0.35s]';
      case 'medium':
        return 'animate-spin [animation-duration:0.65s]';
      case 'off':
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-transparent flex items-center justify-center">
      {/* 21:9 / 16:9 responsive cinematic container */}
      <div className="relative w-full h-full max-w-[2560px] aspect-[21/9] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
        
        {/* ============================================================ */}
        {/* 1. LEFT & RIGHT MOVING WINDOW BACKDROPS                     */}
        {/* ============================================================ */}
        {/* Left Main Window (Where passenger is looking out) */}
        <div 
          onClick={onCycleTimeMode}
          title="Click to change journey time (Golden Dusk / Monsoon / Midnight / Morning)"
          className="absolute left-[3.2%] top-[34%] w-[25.5%] h-[38%] z-0 rounded-md overflow-hidden cursor-pointer shadow-inner border border-amber-900/30 group"
        >
          <MovingWindow 
            timeMode={timeMode} 
            speedKmh={speedKmh} 
            rainIntensity={ambientSettings.rainIntensity} 
          />
          {/* Subtle window glass glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-amber-200/15 pointer-events-none" />
          
          {/* Window Safety Grill Bars */}
          {!windowGrillOpen && (
            <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none px-2 py-1 opacity-70">
              <div className="w-full h-[3px] bg-gradient-to-r from-slate-700 via-slate-400 to-slate-800 rounded shadow" />
              <div className="w-full h-[3px] bg-gradient-to-r from-slate-700 via-slate-400 to-slate-800 rounded shadow" />
              <div className="w-full h-[3px] bg-gradient-to-r from-slate-700 via-slate-400 to-slate-800 rounded shadow" />
            </div>
          )}

          {/* Time mode badge on hover */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-amber-200/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none">
            <span>सफ़र का समय बदलें</span>
            <span className="text-amber-400 font-semibold uppercase">{timeMode.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Distant Right Corridor Window */}
        <div className="absolute right-[22%] top-[40%] w-[11%] h-[24%] z-0 rounded-sm overflow-hidden opacity-85 border border-slate-700/50">
          <MovingWindow 
            timeMode={timeMode} 
            speedKmh={speedKmh} 
            rainIntensity={ambientSettings.rainIntensity} 
          />
        </div>

        {/* Far End Aisle Window / Door */}
        <div className="absolute left-[51.5%] top-[46%] w-[4.5%] h-[16%] z-0 rounded-xs overflow-hidden opacity-90 border border-slate-800">
          <MovingWindow 
            timeMode={timeMode} 
            speedKmh={speedKmh} 
            rainIntensity={ambientSettings.rainIntensity} 
          />
        </div>

        {/* ============================================================ */}
        {/* 2. THE AUTHENTIC SLEEPER COACH VECTOR & 2.5D ILLUSTRATION    */}
        {/* ============================================================ */}
        <svg 
          viewBox="0 0 1920 820" 
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Coach Wall & Ceiling Gradients */}
            <linearGradient id="coachCeiling" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Indian Railways Classic Deep Blue Rexine */}
            <linearGradient id="rexineBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="40%" stopColor="#172554" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="rexineHighlight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </linearGradient>

            {/* Golden hour warm lighting gradient on seats */}
            <linearGradient id="goldenGlowLeft" x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={timeMode === 'golden_hour' ? '0.45' : timeMode === 'morning' ? '0.35' : '0.1'} />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Metal Ladder Brushed Finish */}
            <linearGradient id="metalLadder" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Aged Coach Wall Paint */}
            <linearGradient id="coachWall" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="60%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Aisle Floor Perspective */}
            <linearGradient id="aisleFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* --- CEILING & CURVED COACH ROOF --- */}
          <path d="M 0 0 L 1920 0 L 1920 180 Q 960 40 0 180 Z" fill="url(#coachCeiling)" />
          {/* Ceiling Longitudinal Ribs */}
          <path d="M 0 60 Q 960 15 1920 60" stroke="#1e293b" strokeWidth="4" fill="none" />
          <path d="M 0 110 Q 960 30 1920 110" stroke="#0f172a" strokeWidth="6" fill="none" />
          <path d="M 0 150 Q 960 45 1920 150" stroke="#334155" strokeWidth="3" fill="none" />

          {/* --- AISLE FLOOR PERSPECTIVE (Guides eye down center) --- */}
          <polygon points="680,820 1240,820 1060,480 880,480" fill="url(#aisleFloor)" />
          {/* Floor Anti-Slip Strips */}
          <line x1="740" y1="800" x2="1180" y2="800" stroke="#1e293b" strokeWidth="5" />
          <line x1="780" y1="740" x2="1140" y2="740" stroke="#1e293b" strokeWidth="4" />
          <line x1="820" y1="670" x2="1100" y2="670" stroke="#1e293b" strokeWidth="3" />
          <line x1="855" y1="590" x2="1070" y2="590" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="875" y1="520" x2="1050" y2="520" stroke="#1e293b" strokeWidth="2" />

          {/* --- FAR END COACH VESTIBULE & CORRIDOR (Vanishing point) --- */}
          <rect x="940" y="320" width="130" height="230" fill="#0f172a" />
          {/* Corridor Inter-Coach Door */}
          <rect x="955" y="350" width="100" height="190" fill="#1e293b" stroke="#475569" strokeWidth="3" />
          <rect x="975" y="380" width="60" height="70" fill="#38bdf8" opacity="0.3" stroke="#64748b" strokeWidth="2" />
          {/* Far end emergency handle */}
          <circle cx="965" cy="460" r="4" fill="#dc2626" />

          {/* --- COMPARTMENT PARTITION WALL (CENTER-LEFT) --- */}
          <path d="M 580 80 L 860 80 L 860 520 L 580 620 Z" fill="url(#coachWall)" stroke="#1e293b" strokeWidth="4" />

          {/* "जय माता दी" Traditional Plaque on Top Partition */}
          <g transform="translate(640, 68)">
            <rect x="0" y="0" width="180" height="42" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
            <rect x="4" y="4" width="172" height="34" rx="4" fill="#f8fafc" />
            <text x="90" y="27" textAnchor="middle" fill="#1e293b" fontSize="22" fontWeight="900" fontFamily="serif">
              जय माता दी
            </text>
          </g>

          {/* Emergency Alarm Chain box (लाल जंजीर) */}
          <g transform="translate(865, 120)">
            <rect x="0" y="0" width="22" height="45" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
            <circle cx="11" cy="22" r="6" fill="#fee2e2" />
            {/* Chain handle */}
            <path d="M 11 45 L 11 85 M 3 85 L 19 85" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
            <text x="11" y="105" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="bold">खींचें</text>
          </g>

          {/* --- LEFT SIDE: UPPER & MIDDLE SLEEPER BERTHS --- */}
          {/* Upper Berth (UB 43) */}
          <g>
            <rect x="0" y="60" width="600" height="190" rx="10" fill="url(#rexineBlue)" stroke="#0f172a" strokeWidth="4" />
            {/* Rexine Seams & Cushion Stitching */}
            <line x1="0" y1="120" x2="600" y2="120" stroke="#1e40af" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="0" y1="180" x2="600" y2="180" stroke="#1e40af" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="0" y="60" width="600" height="35" fill="url(#rexineHighlight)" />
            {/* Seat badge */}
            <rect x="520" y="90" width="55" height="24" rx="3" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="547" y="107" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">43 UB</text>
          </g>

          {/* Middle Berth (MB 42 - Folded or Horizontal) */}
          <g>
            <rect x="500" y="270" width="370" height="70" rx="6" fill="url(#rexineBlue)" stroke="#0f172a" strokeWidth="3" />
            {/* Middle Berth Suspension Chain */}
            <line x1="840" y1="70" x2="840" y2="280" stroke="#94a3b8" strokeWidth="4" strokeDasharray="8 4" />
            <rect x="790" y="290" width="55" height="22" rx="3" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="817" y="306" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">42 MB</text>
          </g>

          {/* --- LEFT SIDE: LOWER BERTH (LB 41) & PASSENGER SEAT --- */}
          <g>
            {/* Seat Base Cushion */}
            <path d="M 0 430 L 780 430 Q 820 430 830 470 L 780 820 L 0 820 Z" fill="url(#rexineBlue)" stroke="#0f172a" strokeWidth="5" />
            {/* Golden Sunlight highlight overlay on seat */}
            <path d="M 0 430 L 780 430 Q 820 430 830 470 L 780 820 L 0 820 Z" fill="url(#goldenGlowLeft)" />
            
            {/* Rexine stitched segments */}
            <line x1="0" y1="520" x2="810" y2="520" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="8 6" />
            <line x1="0" y1="620" x2="800" y2="620" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="8 6" />
            <line x1="0" y1="720" x2="790" y2="720" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="8 6" />

            {/* Backrest Cushion */}
            <rect x="0" y="430" width="400" height="390" rx="8" fill="#172554" stroke="#0f172a" strokeWidth="4" />
            <rect x="0" y="430" width="400" height="390" fill="url(#goldenGlowLeft)" />

            {/* Seat Number Stencil */}
            <rect x="710" y="470" width="60" height="26" rx="3" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="740" y="488" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="bold">41 SL</text>
          </g>

          {/* Left Window Frame Arch & Moldings */}
          <g>
            {/* Outer metallic window frame */}
            <path d="M 50 260 L 510 260 Q 530 260 530 280 L 530 570 Q 530 590 510 590 L 50 590 Z" fill="none" stroke="#334155" strokeWidth="16" />
            <path d="M 50 260 L 510 260 Q 530 260 530 280 L 530 570 Q 530 590 510 590 L 50 590 Z" fill="none" stroke="#64748b" strokeWidth="6" />
            {/* Window lift handle latch */}
            <rect x="250" y="575" width="60" height="12" rx="4" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
            {/* Indian Railways Switch Board below window (Mobile Charging Socket) */}
            <rect x="180" y="605" width="110" height="65" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <circle cx="210" cy="635" r="5" fill="#1e293b" />
            <circle cx="240" cy="635" r="5" fill="#1e293b" />
            <rect x="265" y="625" width="16" height="20" rx="2" fill="#dc2626" />
            <text x="235" y="660" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">220V 50Hz</text>
          </g>

          {/* --- RIGHT SIDE: SLEEPER BERTHS & METAL CORNER LADDER --- */}
          {/* Right Upper Berth */}
          <g>
            <rect x="1190" y="320" width="730" height="90" rx="8" fill="url(#rexineBlue)" stroke="#0f172a" strokeWidth="4" />
            <line x1="1190" y1="360" x2="1920" y2="360" stroke="#1e40af" strokeWidth="2" strokeDasharray="6 4" />
          </g>

          {/* Right Lower Berth */}
          <g>
            <path d="M 1140 560 L 1920 560 L 1920 820 L 1220 820 Z" fill="url(#rexineBlue)" stroke="#0f172a" strokeWidth="5" />
            {/* Seat stitches */}
            <line x1="1170" y1="640" x2="1920" y2="640" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="8 6" />
            <line x1="1200" y1="730" x2="1920" y2="730" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="8 6" />
          </g>

          {/* Stainless Steel Climbing Ladder on Right (Iconic Sleeper Element) */}
          <g transform="translate(1320, 0)">
            {/* Left Rail */}
            <rect x="0" y="0" width="14" height="820" rx="4" fill="url(#metalLadder)" stroke="#475569" strokeWidth="2" />
            {/* Right Rail */}
            <rect x="95" y="0" width="14" height="820" rx="4" fill="url(#metalLadder)" stroke="#475569" strokeWidth="2" />
            {/* Ladder Rungs with Gripped Pattern */}
            <rect x="10" y="240" width="88" height="12" rx="4" fill="url(#metalLadder)" stroke="#334155" strokeWidth="2" />
            <rect x="10" y="390" width="88" height="12" rx="4" fill="url(#metalLadder)" stroke="#334155" strokeWidth="2" />
            <rect x="10" y="540" width="88" height="12" rx="4" fill="url(#metalLadder)" stroke="#334155" strokeWidth="2" />
            <rect x="10" y="690" width="88" height="12" rx="4" fill="url(#metalLadder)" stroke="#334155" strokeWidth="2" />
          </g>

          {/* Wire Luggage Basket / Overhead Rack on Right */}
          <g transform="translate(1540, 290)">
            <rect x="0" y="0" width="220" height="110" rx="8" fill="none" stroke="#94a3b8" strokeWidth="4" />
            <line x1="0" y1="35" x2="220" y2="35" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="0" y1="70" x2="220" y2="70" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="45" y1="0" x2="45" y2="110" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="110" y1="0" x2="110" y2="110" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="175" y1="0" x2="175" y2="110" stroke="#cbd5e1" strokeWidth="2.5" />
          </g>

          {/* Lower Berth Plaque on back wall: "जय माता दी" */}
          <g transform="translate(890, 615)">
            <rect x="0" y="0" width="130" height="30" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
            <text x="65" y="21" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="bold">
              जय माता दी
            </text>
          </g>

          {/* ============================================================ */}
          {/* 3. NOSTALGIC PASSENGER (SEATED THOUGHTFULLY BY WINDOW)       */}
          {/* ============================================================ */}
          <g id="passenger" className="transition-transform duration-700">
            {/* Lower Torso / Legs Seated Naturally */}
            {/* Trousers (Dark slate grey) */}
            <path d="M 605 595 L 660 595 L 720 790 L 670 800 L 635 680 L 610 800 L 565 790 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            {/* Leather shoes */}
            <ellipse cx="585" cy="805" rx="30" ry="12" fill="#451a03" />
            <ellipse cx="695" cy="805" rx="30" ry="12" fill="#451a03" />

            {/* Upper Torso: Casual Light Shirt with Golden Hour warm wash */}
            <path 
              d="M 590 435 Q 630 420 680 435 L 730 520 L 710 610 L 580 610 L 560 520 Z" 
              fill={timeMode === 'golden_hour' ? '#fef3c7' : timeMode === 'midnight' ? '#cbd5e1' : '#f8fafc'} 
              stroke="#475569" 
              strokeWidth="3" 
            />
            {/* Collar & Buttons */}
            <path d="M 625 430 L 640 460 L 655 430" stroke="#334155" strokeWidth="2.5" fill="none" />
            <line x1="640" y1="460" x2="640" y2="600" stroke="#64748b" strokeWidth="2" strokeDasharray="3 14" />
            
            {/* Pocket logo */}
            <rect x="670" y="490" width="22" height="24" rx="2" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <path d="M 674 502 Q 681 496 688 502" stroke="#64748b" strokeWidth="1.5" fill="none" />

            {/* Left Arm Resting casually on berth */}
            <path d="M 720 500 L 760 560 L 730 635 L 705 635" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
            <path d="M 720 500 L 755 550 L 740 560 L 710 520 Z" fill={timeMode === 'golden_hour' ? '#fef3c7' : '#f8fafc'} />
            {/* Watch on left wrist */}
            <rect x="725" y="618" width="12" height="8" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />

            {/* Right Arm with red sacred thread (कलावा / मोली) */}
            <path d="M 570 495 L 545 565 L 565 625 L 585 625" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
            <path d="M 570 495 L 550 550 L 565 555 L 585 510 Z" fill={timeMode === 'golden_hour' ? '#fef3c7' : '#f8fafc'} />
            {/* Red Kalawa thread */}
            <line x1="565" y1="608" x2="575" y2="608" stroke="#dc2626" strokeWidth="3" />

            {/* Passenger Neck & Face (Looking left toward the window) */}
            {/* Neck */}
            <path d="M 625 410 L 625 435 L 655 435 L 655 410 Z" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" />
            
            {/* Face Profile (Gentle, handsome Indian youth, calm nostalgic gaze) */}
            <path 
              d="M 618 360 Q 600 375 608 405 Q 618 430 648 425 Q 668 415 668 375 Q 660 345 618 360 Z" 
              fill="#fde68a" 
              stroke="#b45309" 
              strokeWidth="2.5" 
            />
            {/* Nose & Jaw looking window-side */}
            <path d="M 606 378 L 598 392 L 608 396 Q 612 414 624 416" stroke="#b45309" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Calm thoughtful Eye looking out */}
            <ellipse cx="616" cy="380" rx="4" ry="2.5" fill="#1e293b" />
            <path d="M 610 374 Q 618 370 624 374" stroke="#451a03" strokeWidth="2" fill="none" />
            {/* Subtle gentle smile */}
            <path d="M 612 404 Q 620 407 626 403" stroke="#9a3412" strokeWidth="2" fill="none" />

            {/* Natural Wavy Black Hair with golden rim lighting */}
            <path 
              d="M 615 355 Q 598 335 625 320 Q 655 310 675 330 Q 685 355 675 385 Q 668 360 645 350 Q 628 350 615 355 Z" 
              fill="#0f172a" 
            />
            {/* Golden hair highlight on window side */}
            <path d="M 602 342 Q 620 322 648 322" stroke="#f59e0b" strokeWidth="3" fill="none" opacity={timeMode === 'golden_hour' ? '0.85' : '0.2'} />

            {/* Earphone in ear with wire trailing into shirt */}
            <circle cx="642" cy="382" r="3.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <path d="M 642 385 Q 644 420 640 445" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
          </g>

          {/* ============================================================ */}
          {/* 4. BELONGINGS ON BERTH: BLANKET, KULHAD, TRAVEL BAG, PHONE   */}
          {/* ============================================================ */}
          {/* Folded Indian Railway Blanket with Red Stripe */}
          <g transform="translate(390, 720)">
            <rect x="0" y="0" width="160" height="50" rx="8" fill="#78350f" stroke="#451a03" strokeWidth="3" />
            <rect x="0" y="15" width="160" height="16" fill="#b91c1c" />
            <line x1="0" y1="23" x2="160" y2="23" stroke="#fef08a" strokeWidth="2" strokeDasharray="5 5" />
            <rect x="10" y="-18" width="140" height="24" rx="6" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
          </g>

          {/* Vintage Leather Duffle Bag under berth */}
          <g transform="translate(800, 800)">
            <ellipse cx="60" cy="0" rx="70" ry="25" fill="#7c2d12" stroke="#451a03" strokeWidth="3" />
            <path d="M 20 -15 Q 60 -30 100 -15" stroke="#451a03" strokeWidth="4" fill="none" />
            <rect x="52" y="-12" width="16" height="24" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
          </g>

          {/* Mobile Phone on Berth next to passenger */}
          <g transform="translate(770, 725)">
            <rect x="0" y="0" width="38" height="68" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
            <rect x="3" y="5" width="32" height="52" rx="3" fill="#38bdf8" opacity="0.4" />
            <circle cx="19" cy="62" r="3" fill="#94a3b8" />
          </g>
        </svg>

        {/* ============================================================ */}
        {/* 5. INTERACTIVE CEILING FAN (CENTRAL AISLE TOP)               */}
        {/* ============================================================ */}
        <div 
          onClick={onToggleFanSpeed}
          title={`Click to change railway fan speed (Current: ${ambientSettings.fanSpeed})`}
          className="absolute left-[54%] top-[2%] -translate-x-1/2 z-30 cursor-pointer group flex flex-col items-center"
        >
          {/* Fan Mounting Stem */}
          <div className="w-4 h-10 bg-gradient-to-b from-slate-900 via-slate-700 to-slate-800 rounded-xs shadow" />
          {/* Fan Motor Housing */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950 border-2 border-slate-600 shadow-2xl flex items-center justify-center">
            {/* Protective Wire Cage Grille */}
            <div className="absolute inset-0 rounded-full border border-slate-400/40 pointer-events-none" />
            <div className="absolute inset-1.5 rounded-full border border-slate-400/30 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-slate-400/30" />
              <div className="h-full w-[1px] bg-slate-400/30" />
            </div>

            {/* Rotating 3 Metal Fan Blades */}
            <div className={`relative w-16 h-16 ${getFanAnimation()}`}>
              {/* Blade 1 */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-slate-400 to-slate-700 rounded-t-full shadow-md" />
              {/* Blade 2 */}
              <div className="absolute bottom-2 left-1 w-7 h-4 bg-gradient-to-l from-slate-400 to-slate-700 rounded-l-full shadow-md -rotate-45" />
              {/* Blade 3 */}
              <div className="absolute bottom-2 right-1 w-7 h-4 bg-gradient-to-r from-slate-400 to-slate-700 rounded-r-full shadow-md rotate-45" />
              {/* Center Hub */}
              <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-amber-400/80 border border-slate-800 shadow" />
            </div>
          </div>

          {/* Fan tooltip on hover */}
          <span className="mt-1 px-2 py-0.5 rounded bg-black/70 text-[10px] text-amber-200 tracking-wider font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            FAN: {ambientSettings.fanSpeed.toUpperCase()}
          </span>
        </div>

        {/* ============================================================ */}
        {/* 6. INTERACTIVE CHAI KULHAD WITH RISING STEAM                */}
        {/* ============================================================ */}
        <div 
          onClick={onChaiSip}
          title="Click to take a sip of hot Indian Railway Chai (चाय गरम)"
          className="absolute left-[44%] bottom-[24%] z-30 cursor-pointer group flex flex-col items-center"
        >
          {/* Animated Chai Steam Wisps */}
          {isChaiSteaming && (
            <div className="relative w-8 h-10 pointer-events-none">
              <div className="absolute bottom-0 left-2 w-1.5 h-6 bg-gradient-to-t from-amber-100/60 to-transparent rounded-full animate-pulse blur-[1px]" />
              <div className="absolute bottom-1 left-4 w-1.5 h-8 bg-gradient-to-t from-white/50 to-transparent rounded-full animate-bounce [animation-duration:2.5s] blur-[1px]" />
            </div>
          )}

          {/* Terracotta Earthen Kulhad / Glass */}
          <div className="relative w-8 h-10 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-b-md rounded-t-xs border border-amber-900 shadow-xl flex items-start justify-center pt-0.5 group-hover:scale-110 transition-transform">
            {/* Steaming hot golden tea surface */}
            <div className="w-6 h-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-inner" />
          </div>
          
          <span className="mt-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] text-amber-300 font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
            चाय पिएं ☕
          </span>
        </div>

        {/* ============================================================ */}
        {/* 7. INTERACTIVE EMERGENCY CHAIN (LOCO HORN TRIGGER)          */}
        {/* ============================================================ */}
        <div 
          onClick={onPullLocoHorn}
          title="Click to sound the Indian Railways Electric Locomotive Horn (WAP-7 Twin Horn)"
          className="absolute left-[45.5%] top-[14%] z-30 cursor-pointer group flex flex-col items-center"
        >
          <div className="w-3 h-8 bg-red-600 rounded-sm shadow-md group-hover:bg-red-500 transition-colors" />
          <div className="w-5 h-5 rounded-full border-2 border-red-500 -mt-1 group-active:translate-y-2 transition-transform shadow-lg bg-black/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-red-400" />
          </div>
          <span className="mt-1 px-1.5 py-0.5 rounded bg-red-950/90 border border-red-700 text-[9px] text-red-200 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            सीटी बजाएं 🚂
          </span>
        </div>

        {/* ============================================================ */}
        {/* 8. CENTER TITLE "ट्रेन वाला" (BRANDING AS IN SCREENSHOT)   */}
        {/* ============================================================ */}
        {showBranding && (
          <div className="absolute top-[16%] left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center select-none">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-sans">
              ट्रेन वाला
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium tracking-widest uppercase mt-1 drop-shadow-md">
              Indian Railway Nostalgia Music
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
