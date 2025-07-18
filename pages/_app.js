import { useEffect, useRef, useState } from 'react';

function MagentaCursor() {
  const cursorRef = useRef(null);
  const [rings, setRings] = useState([]);
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    // 클릭 시 링 효과
    const handleClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const id = Math.random().toString(36).slice(2);
      setRings((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRings((prev) => prev.filter(r => r.id !== id));
      }, 600);
    };
    window.addEventListener('mousedown', handleClick);
    // 호버 효과: 버튼 등 인터랙티브 요소 위에서 커서 커지고 밝아짐
    const handleHover = (e) => {
      if (!cursorRef.current) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button')) {
        cursorRef.current.style.width = '54px';
        cursorRef.current.style.height = '54px';
        cursorRef.current.style.background = 'radial-gradient(circle at 60% 40%, #ff66e6 70%, #fff0ff 100%)';
        cursorRef.current.style.boxShadow = '0 0 36px 16px #ff00ccbb, 0 0 96px 32px #ff99ff66';
      } else {
        cursorRef.current.style.width = '38px';
        cursorRef.current.style.height = '38px';
        cursorRef.current.style.background = 'radial-gradient(circle at 60% 40%, #ff00cc 70%, #ff99ff 100%)';
        cursorRef.current.style.boxShadow = '0 0 24px 8px #ff00cc88, 0 0 64px 16px #ff99ff44';
      }
    };
    window.addEventListener('mousemove', handleHover);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('mousemove', handleHover);
    };
  }, []);
  return (
    <>
      <div ref={cursorRef} style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(255,0,204,0.7)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'background 0.2s',
      }} />
      {rings.map(ring => (
        <span key={ring.id} style={{
          position: 'fixed',
          left: ring.x,
          top: ring.y,
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '3px solid #ff00cc',
          boxShadow: '0 0 24px 8px #ff00cc88',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%) scale(1)',
          animation: 'cursor-ring-pop 0.6s cubic-bezier(.4,1.6,.6,1) forwards',
        }} />
      ))}
      <style jsx global>{`
        html, body, * { cursor: none !important; }
        @keyframes cursor-ring-pop {
          0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          60% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.7); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.2); }
        }
      `}</style>
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MagentaCursor />
      <Component {...pageProps} />
      <style jsx global>{`
        html, body, * { cursor: none !important; }
      `}</style>
    </>
  );
}

export default MyApp; 