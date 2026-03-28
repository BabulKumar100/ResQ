'use client';

import { useRef, useEffect } from 'react';

interface DroneCanvasProps {
  drone: {
    name?: string;
    batteryPct?: number;
    fuelPct?: number;
    altitude?: number;
    speed?: number;
    heading?: number;
    headingLabel?: string;
    isRecording?: boolean;
    status?: string;
  } | null;
}

export default function DroneCanvas({ drone }: DroneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let targetX = 220, targetY = 180;
    let targetVX = (Math.random() - 0.5) * 2;
    let targetVY = (Math.random() - 0.5) * 2;

    const bat = drone?.batteryPct ?? drone?.fuelPct ?? 84;
    const alt = drone?.altitude ?? 450;
    const spd = drone?.speed ?? 65;
    const hdg = drone?.heading ?? 104;
    const hdgLabel = drone?.headingLabel ?? 'ESE';
    const rec = drone?.isRecording !== false;

    function draw() {
      const W = canvas!.width, H = canvas!.height;
      
      // Clear with dark bg
      ctx!.fillStyle = '#060a0f';
      ctx!.fillRect(0, 0, W, H);

      // Scrolling terrain grid
      ctx!.strokeStyle = 'rgba(16,185,129,0.08)';
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < 15; i++) {
        const y = ((frame * 1.2 + i * 32) % H);
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(W, y); ctx!.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const x = i * (W / 11);
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, H); ctx!.stroke();
      }

      // Random buildings in background
      ctx!.fillStyle = 'rgba(16,185,129,0.04)';
      [80, 170, 300, 430, 560, 650].forEach((bx, bi) => {
        const bh = 40 + bi * 15;
        ctx!.fillRect(bx, H - bh, 35 + bi * 5, bh);
      });

      // Target random walk
      targetX += targetVX;
      targetY += targetVY;
      targetVX += (Math.random() - 0.5) * 0.5;
      targetVY += (Math.random() - 0.5) * 0.5;
      targetVX = Math.max(-2, Math.min(2, targetVX));
      targetVY = Math.max(-1.5, Math.min(1.5, targetVY));
      targetX = Math.max(70, Math.min(W - 70, targetX));
      targetY = Math.max(50, Math.min(H - 60, targetY));

      // Target box
      ctx!.strokeStyle = 'rgba(239,68,68,0.85)';
      ctx!.lineWidth = 1.5;
      ctx!.strokeRect(targetX - 42, targetY - 32, 84, 64);

      // Corner brackets
      const cx = targetX, cy2 = targetY;
      [[-42,-32],[42,-32],[-42,32],[42,32]].forEach(([ox,oy]) => {
        const sx = ox < 0 ? 1 : -1, sy = oy < 0 ? 1 : -1;
        ctx!.beginPath(); ctx!.moveTo(cx+ox, cy2+oy); ctx!.lineTo(cx+ox+sx*14, cy2+oy); ctx!.stroke();
        ctx!.beginPath(); ctx!.moveTo(cx+ox, cy2+oy); ctx!.lineTo(cx+ox, cy2+oy+sy*14); ctx!.stroke();
      });

      // Target label
      ctx!.fillStyle = 'rgba(239,68,68,0.9)';
      ctx!.font = 'bold 9px monospace';
      ctx!.fillText('TARGET_LOCK:', targetX - 40, targetY - 38);
      ctx!.fillText('GROUND VEHICLE', targetX - 40, targetY - 28);

      // Center reticle
      const rx = W / 2, ry = H / 2;
      ctx!.strokeStyle = '#10b981';
      ctx!.lineWidth = 1;
      ctx!.beginPath(); ctx!.arc(rx, ry, 44, 0, Math.PI * 2); ctx!.stroke();
      [[0,-70],[0,70],[-70,0],[70,0]].forEach(([dx,dy]) => {
        ctx!.beginPath(); ctx!.moveTo(rx+dx*0.55, ry+dy*0.55); ctx!.lineTo(rx+dx*0.85, ry+dy*0.85); ctx!.stroke();
      });
      // Rotating outer arc
      ctx!.save();
      ctx!.translate(rx, ry);
      ctx!.rotate(frame * 0.025);
      ctx!.beginPath();
      ctx!.arc(0, 0, 58, 0, Math.PI * 1.4);
      ctx!.strokeStyle = 'rgba(16,185,129,0.5)';
      ctx!.stroke();
      ctx!.restore();
      // Center dot
      ctx!.fillStyle = '#10b981';
      ctx!.beginPath(); ctx!.arc(rx, ry, 3, 0, Math.PI * 2); ctx!.fill();

      // Telemetry — bottom left
      ctx!.fillStyle = 'rgba(16,185,129,0.85)';
      ctx!.font = '10px monospace';
      const lines = [
        `ALT: ${alt}m`,
        `SPD: ${spd + Math.round(Math.sin(frame * 0.05) * 3)}km/h`,
        `HDG: ${hdg}° ${hdgLabel}`,
        `BAT: ${bat}%`,
      ];
      ctx!.fillStyle = 'rgba(0,0,0,0.4)';
      ctx!.fillRect(8, 8, 130, 64);
      ctx!.fillStyle = 'rgba(16,185,129,0.9)';
      lines.forEach((l, i) => ctx!.fillText(l, 14, 24 + i * 13));

      // Lat/Lng — top right
      ctx!.fillStyle = 'rgba(0,0,0,0.4)';
      ctx!.fillRect(W - 140, 8, 132, 38);
      ctx!.fillStyle = 'rgba(16,185,129,0.5)';
      ctx!.font = '9px monospace';
      ctx!.fillText(`LAT: 34.050${(frame % 9)}`, W - 136, 22);
      ctx!.fillText(`LNG: -118.24${(frame % 9)}`, W - 136, 35);

      // Battery bar
      const barW = 80, barPct = bat / 100;
      const barColor = bat > 50 ? '#10b981' : bat > 20 ? '#f59e0b' : '#ef4444';
      ctx!.fillStyle = 'rgba(0,0,0,0.5)';
      ctx!.fillRect(8, H - 28, barW + 4, 16);
      ctx!.fillStyle = barColor;
      ctx!.fillRect(10, H - 26, barW * barPct, 12);
      ctx!.fillStyle = '#fff';
      ctx!.font = '9px monospace';
      ctx!.fillText(`${bat}%`, 10 + barW + 6, H - 17);

      // REC indicator
      if (rec) {
        ctx!.fillStyle = frame % 60 < 30 ? '#ef4444' : 'rgba(0,0,0,0)';
        ctx!.beginPath(); ctx!.arc(W - 16, 18, 6, 0, Math.PI * 2); ctx!.fill();
        ctx!.fillStyle = 'rgba(239,68,68,0.9)';
        ctx!.font = 'bold 10px monospace';
        ctx!.fillText('REC', W - 44, 22);
      }

      // Screen corner frames
      ctx!.strokeStyle = 'rgba(16,185,129,0.35)';
      ctx!.lineWidth = 1.5;
      [[0,0],[W,0],[0,H],[W,H]].forEach(([px,py]) => {
        const sx = px === 0 ? 1 : -1, sy = py === 0 ? 1 : -1;
        ctx!.beginPath(); ctx!.moveTo(px, py); ctx!.lineTo(px+sx*22, py); ctx!.stroke();
        ctx!.beginPath(); ctx!.moveTo(px, py); ctx!.lineTo(px, py+sy*22); ctx!.stroke();
      });

      frame++;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [drone]);

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={460}
      className="w-full h-full object-cover"
    />
  );
}
