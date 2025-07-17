import { useEffect, useRef } from 'react';

function MagentaCursor() {
  const cursorRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div ref={cursorRef} style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 60% 40%, #ff00cc 70%, #ff99ff 100%)',
      boxShadow: '0 0 24px 8px #ff00cc88, 0 0 64px 16px #ff99ff44',
      pointerEvents: 'auto',
      zIndex: 9999,
      mixBlendMode: 'normal',
      transform: 'translate(-50%, -50%)',
      transition: 'background 0.2s',
    }} />
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