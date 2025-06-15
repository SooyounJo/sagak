import { useEffect, useRef, useState } from 'react';

const baseImages = ['/2d/11.png', '/2d/22.png', '/2d/33.png', '/2d/44.png'];

function getRandomImage() {
  return baseImages[Math.floor(Math.random() * baseImages.length)];
}

export default function SlotAnimation({ width = 120, height = 80, speed = 1.5 }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [images, setImages] = useState(() => {
    // 초기에 8개 랜덤 이미지로 채움
    return Array(8).fill(0).map(getRandomImage);
  });
  const posRef = useRef(0);

  useEffect(() => {
    let frame;
    let pos = posRef.current;
    function animate() {
      pos += speed;
      if (pos >= height) {
        pos = 0;
        // 맨 앞 이미지 제거, 맨 뒤에 랜덤 이미지 추가
        setImages(prev => {
          const next = prev.slice(1);
          next.push(getRandomImage());
          return next;
        });
      }
      if (animRef.current) {
        animRef.current.style.transform = `translateY(-${pos}px)`;
      }
      posRef.current = pos;
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [height, speed]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        overflow: 'hidden',
        borderRadius: 16,
        background: '#2ecc40',
        boxShadow: '0 2px 16px #000a',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        ref={animRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          transition: 'none',
        }}
      >
        {images.map((src, i) => (
          <img
            key={i + '-' + src}
            src={src}
            alt={`slot-${i}`}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 80,
              maxWidth: 120,
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
              margin: '12px auto',
              display: 'block',
              position: 'relative',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
} 