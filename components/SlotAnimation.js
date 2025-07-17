import { useEffect, useRef, useState } from 'react';

// 항상 같은 이미지가 내려오는 슬롯 애니메이션
export function RecSlotAnimation({ width = 160, height = 80, speed = 1.5 }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [images, setImages] = useState(() => {
    // 초기에 8개 모두 rec.png로 채움
    return Array(8).fill('/2d/rec.png');
  });
  const posRef = useRef(0);

  useEffect(() => {
    let frame;
    let pos = posRef.current;
    function animate() {
      pos += speed;
      if (pos >= height) {
        pos = 0;
        // 맨 앞 이미지 제거, 맨 뒤에 rec.png 추가
        setImages(prev => {
          const next = prev.slice(1);
          next.push('/2d/rec.png');
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
        width: '100%',
        height: '100%',
        overflow: 'hidden',
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
            key={i}
            src={src}
            alt={`rec-slot-${i}`}
            style={{
              width: '130%',
              height: '130%',
              objectFit: 'cover',
              margin: 0,
              userSelect: 'none',
              pointerEvents: 'none',
              display: 'block',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
} 