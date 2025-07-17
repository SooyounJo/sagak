import { useEffect, useState } from 'react';

export default function GlitchOverlay() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 180);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!active) return null;

  return (
    <>
      {/* 빨강 채널 */}
      <div style={{
        pointerEvents: 'none',
        position: 'fixed',
        left: 0, top: 0, width: '100vw', height: '100vh',
        zIndex: 9999,
        background: 'rgba(255,0,80,0.12)',
        mixBlendMode: 'screen',
        filter: 'blur(1.5px) contrast(2) brightness(1.2)',
        transform: 'translate(-4px, 0) skewX(-8deg) scaleY(1.04)',
        opacity: 0.85,
        animation: 'glitch1 0.18s',
      }} />
      {/* 파랑 채널 */}
      <div style={{
        pointerEvents: 'none',
        position: 'fixed',
        left: 0, top: 0, width: '100vw', height: '100vh',
        zIndex: 9999,
        background: 'rgba(0,200,255,0.13)',
        mixBlendMode: 'screen',
        filter: 'blur(1.5px) contrast(2) brightness(1.2)',
        transform: 'translate(5px, 0) skewX(8deg) scaleY(0.98)',
        opacity: 0.7,
        animation: 'glitch2 0.18s',
      }} />
      {/* 라인 깨짐 */}
      <div style={{
        pointerEvents: 'none',
        position: 'fixed',
        left: 0, top: '60%', width: '100vw', height: 8,
        zIndex: 10000,
        background: 'linear-gradient(90deg, #fff 10%, #0ff 60%, #f0f 100%)',
        opacity: 0.5,
        transform: 'skewX(-20deg) translateY(-2px)',
        filter: 'blur(1.5px)',
        animation: 'glitchline 0.18s',
      }} />
      <style>{`
        @keyframes glitch1 {
          0% { opacity: 0.7; transform: translate(-2px,0) skewX(-2deg);}
          50% { opacity: 1; transform: translate(-8px,0) skewX(-12deg);}
          100% { opacity: 0.7; transform: translate(-4px,0) skewX(-8deg);}
        }
        @keyframes glitch2 {
          0% { opacity: 0.5; transform: translate(2px,0) skewX(2deg);}
          50% { opacity: 1; transform: translate(10px,0) skewX(16deg);}
          100% { opacity: 0.5; transform: translate(5px,0) skewX(8deg);}
        }
        @keyframes glitchline {
          0% { opacity: 0.2; }
          50% { opacity: 0.7; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </>
  );
} 