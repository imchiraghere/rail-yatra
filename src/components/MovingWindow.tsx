import React, { useEffect, useRef } from 'react';
import { TimeMode } from '../types';

interface MovingWindowProps {
  timeMode: TimeMode;
  speedKmh: number;
  rainIntensity: number;
}

export const MovingWindow: React.FC<MovingWindowProps> = ({
  timeMode,
  speedKmh,
  rainIntensity
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Parallax layers state
    let bgOffset = 0;
    let midOffset = 0;
    let foreOffset = 0;
    let poleOffset = 0;

    // Rain particles
    interface RainDrop {
      x: number;
      y: number;
      len: number;
      speedY: number;
      speedX: number;
      alpha: number;
    }
    const rainDrops: RainDrop[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 25 + 15,
      speedY: Math.random() * 18 + 12,
      speedX: -(Math.random() * 8 + 6),
      alpha: Math.random() * 0.7 + 0.3
    }));

    // Glass condensation water droplets
    interface GlassDrop {
      x: number;
      y: number;
      r: number;
      vy: number;
    }
    const glassDrops: GlassDrop[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3.5 + 1.5,
      vy: Math.random() * 0.4 + 0.05
    }));

    const render = () => {
      const speedMultiplier = speedKmh / 80;
      bgOffset = (bgOffset + 0.4 * speedMultiplier) % width;
      midOffset = (midOffset + 1.8 * speedMultiplier) % width;
      foreOffset = (foreOffset + 4.5 * speedMultiplier) % width;
      poleOffset = (poleOffset + 14.0 * speedMultiplier) % (width * 1.5);

      // --- 1. SKY GRADIENT ACCORDING TO TIME MODE ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (timeMode === 'golden_hour') {
        skyGrad.addColorStop(0, '#312e81'); // deep dusk blue
        skyGrad.addColorStop(0.3, '#b45309'); // warm amber
        skyGrad.addColorStop(0.65, '#f59e0b'); // golden orange
        skyGrad.addColorStop(1, '#fed7aa'); // soft horizon peach
      } else if (timeMode === 'monsoon') {
        skyGrad.addColorStop(0, '#1e293b');
        skyGrad.addColorStop(0.5, '#334155');
        skyGrad.addColorStop(1, '#475569');
      } else if (timeMode === 'midnight') {
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(0.6, '#0f172a');
        skyGrad.addColorStop(1, '#1e1b4b');
      } else {
        // Morning
        skyGrad.addColorStop(0, '#1e3a8a');
        skyGrad.addColorStop(0.4, '#ec4899');
        skyGrad.addColorStop(0.75, '#f97316');
        skyGrad.addColorStop(1, '#fef08a');
      }

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sun or Moon
      if (timeMode === 'golden_hour') {
        const sunGrad = ctx.createRadialGradient(width * 0.72, height * 0.48, 5, width * 0.72, height * 0.48, 80);
        sunGrad.addColorStop(0, 'rgba(255, 247, 237, 0.95)');
        sunGrad.addColorStop(0.3, 'rgba(251, 191, 36, 0.6)');
        sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width * 0.72, height * 0.48, 80, 0, Math.PI * 2);
        ctx.fill();
      } else if (timeMode === 'midnight') {
        // Glowing Crescent Moon & Stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 40; i++) {
          const sx = ((i * 73 + bgOffset * 0.1) % width);
          const sy = (i * 37) % (height * 0.45);
          ctx.globalAlpha = 0.3 + 0.7 * Math.sin(i + bgOffset * 0.02);
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.22, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(width * 0.78, height * 0.2, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 2. DISTANT HILL RANGES (Vindhyachal / Western Ghats) ---
      const hillGrad = ctx.createLinearGradient(0, height * 0.35, 0, height);
      if (timeMode === 'golden_hour') {
        hillGrad.addColorStop(0, 'rgba(120, 53, 15, 0.6)');
        hillGrad.addColorStop(1, 'rgba(67, 20, 7, 0.8)');
      } else if (timeMode === 'monsoon') {
        hillGrad.addColorStop(0, 'rgba(30, 41, 59, 0.7)');
        hillGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
      } else if (timeMode === 'midnight') {
        hillGrad.addColorStop(0, 'rgba(15, 23, 42, 0.8)');
        hillGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      } else {
        hillGrad.addColorStop(0, 'rgba(124, 45, 18, 0.5)');
        hillGrad.addColorStop(1, 'rgba(76, 29, 149, 0.7)');
      }

      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 40; x += 30) {
        const hillY = height * 0.45 + Math.sin((x + bgOffset) * 0.005) * 28 + Math.cos((x + bgOffset * 0.5) * 0.012) * 14;
        ctx.lineTo(x, hillY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // --- 3. MIDGROUND: RURAL FIELDS, PALM & NEEM TREES, VILLAGE HUTS ---
      const fieldGrad = ctx.createLinearGradient(0, height * 0.48, 0, height);
      if (timeMode === 'golden_hour') {
        fieldGrad.addColorStop(0, '#65a30d'); // golden green
        fieldGrad.addColorStop(0.5, '#4d7c0f');
        fieldGrad.addColorStop(1, '#365314');
      } else if (timeMode === 'monsoon') {
        fieldGrad.addColorStop(0, '#15803d'); // lush emerald
        fieldGrad.addColorStop(1, '#14532d');
      } else if (timeMode === 'midnight') {
        fieldGrad.addColorStop(0, '#064e3b');
        fieldGrad.addColorStop(1, '#022c22');
      } else {
        fieldGrad.addColorStop(0, '#84cc16');
        fieldGrad.addColorStop(1, '#4d7c0f');
      }

      ctx.fillStyle = fieldGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 30; x += 20) {
        const fieldY = height * 0.52 + Math.sin((x + midOffset) * 0.008) * 12;
        ctx.lineTo(x, fieldY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Midground Palms and Mango Trees
      for (let i = -1; i < 8; i++) {
        const treeX = ((i * 140 - midOffset) % (width + 200) + width + 200) % (width + 200) - 100;
        const treeBaseY = height * 0.56;
        const treeHeight = 55 + (i % 3) * 15;

        // Tree trunk
        ctx.strokeStyle = timeMode === 'golden_hour' ? '#451a03' : '#1e293b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(treeX, treeBaseY);
        ctx.quadraticCurveTo(treeX + 4, treeBaseY - treeHeight * 0.6, treeX - 3, treeBaseY - treeHeight);
        ctx.stroke();

        // Palm fronds
        ctx.fillStyle = timeMode === 'golden_hour' ? '#3f6212' : timeMode === 'monsoon' ? '#166534' : '#064e3b';
        for (let angle = -Math.PI * 0.8; angle <= -Math.PI * 0.2; angle += 0.22) {
          ctx.beginPath();
          const fx = treeX - 3 + Math.cos(angle) * 32;
          const fy = treeBaseY - treeHeight + Math.sin(angle) * 18;
          ctx.moveTo(treeX - 3, treeBaseY - treeHeight);
          ctx.lineTo(fx, fy);
          ctx.lineTo(treeX - 3, treeBaseY - treeHeight + 6);
          ctx.fill();
        }

        // Little Village Hut
        if (i % 3 === 0) {
          const hutX = treeX + 50;
          const hutY = treeBaseY - 2;
          // Wall
          ctx.fillStyle = timeMode === 'golden_hour' ? '#b45309' : '#475569';
          ctx.fillRect(hutX, hutY - 14, 22, 16);
          // Roof
          ctx.fillStyle = timeMode === 'golden_hour' ? '#991b1b' : '#334155';
          ctx.beginPath();
          ctx.moveTo(hutX - 3, hutY - 14);
          ctx.lineTo(hutX + 11, hutY - 26);
          ctx.lineTo(hutX + 25, hutY - 14);
          ctx.closePath();
          ctx.fill();
        }
      }

      // --- 4. FOREGROUND CROP BEDS WITH HORIZONTAL MOTION BLUR ---
      ctx.fillStyle = timeMode === 'golden_hour' ? 'rgba(77, 124, 15, 0.95)' : 'rgba(20, 83, 45, 0.95)';
      ctx.fillRect(0, height * 0.68, width, height * 0.32);

      // Fast-moving blur streaks
      ctx.strokeStyle = timeMode === 'golden_hour' ? 'rgba(254, 240, 138, 0.35)' : 'rgba(74, 222, 128, 0.25)';
      ctx.lineWidth = 2.5;
      for (let k = 0; k < 14; k++) {
        const lineY = height * 0.7 + (k * (height * 0.28)) / 14;
        const lineX = ((k * 80 - foreOffset * 2.5) % width + width) % width;
        ctx.beginPath();
        ctx.moveTo(lineX, lineY);
        ctx.lineTo(lineX + 140, lineY);
        ctx.stroke();
      }

      // --- 5. INDIAN RAILWAY OVERHEAD ELECTRIFICATION (OHE) POLES ---
      // Steel lattice poles speeding past with high-tension catenary wires
      const poleX = ((width * 1.5 - poleOffset) % (width * 1.5)) - 40;
      if (poleX >= -60 && poleX <= width + 60) {
        // Main Mast (Steel I-beam / Lattice)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(poleX, 0);
        ctx.lineTo(poleX, height);
        ctx.stroke();

        // Cantilever horizontal arm & insulators
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(poleX - 40, height * 0.18);
        ctx.lineTo(poleX + 30, height * 0.14);
        ctx.stroke();

        // Ceramic Insulators
        ctx.fillStyle = '#dc2626'; // Indian railway red insulator
        ctx.fillRect(poleX + 18, height * 0.12, 8, 14);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(poleX + 20, height * 0.14, 4, 10);
      }

      // Continuous Catenary Wire
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.16);
      ctx.bezierCurveTo(width * 0.3, height * 0.22, width * 0.7, height * 0.22, width, height * 0.16);
      ctx.stroke();

      // --- 6. MONSOON RAIN DROPS ANIMATION ---
      if (rainIntensity > 0.05) {
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)';
        ctx.lineWidth = 1.4;
        rainDrops.forEach((d) => {
          d.y += d.speedY * (rainIntensity + 0.5);
          d.x += d.speedX * (speedMultiplier + 0.2);
          if (d.y > height) {
            d.y = -20;
            d.x = Math.random() * width + 50;
          }
          if (d.x < 0) {
            d.x = width + 20;
          }

          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.speedX * 0.8, d.y + d.len);
          ctx.stroke();
        });

        // Sliding Glass Condensation Drops
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        glassDrops.forEach((g) => {
          g.y += g.vy;
          if (g.y > height) {
            g.y = Math.random() * 20;
            g.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // --- 7. GOLDEN DUSK GOD RAYS OVERLAY ---
      if (timeMode === 'golden_hour') {
        const rayGrad = ctx.createLinearGradient(width * 0.8, 0, 0, height);
        rayGrad.addColorStop(0, 'rgba(253, 224, 71, 0.18)');
        rayGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.08)');
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rayGrad;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [timeMode, speedKmh, rainIntensity]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
