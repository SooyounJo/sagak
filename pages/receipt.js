import { useEffect, useRef, useState } from 'react';
import GLBPersonaAnimation from '../components/GLBPersonaAnimation';

export default function ReceiptPage() {
  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [animate, setAnimate] = useState(false);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      background: '#f6f6f6',
      overflow: 'hidden',
    }}>
      {/* 좌측 3분의 2에 3D GLB 모델 (애니메이션) */}
      <div style={{ flex: 2, height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <GLBPersonaAnimation src={'/3d/main.glb'} animate={animate} />
      </div>
      {/* 우측 3분의 1 초록색 박스 + 안내문구/버튼 */}
      <div style={{ flex: 1, height: '100vh', background: '#39ff14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 80, lineHeight: 1.5, textShadow: '0 2px 8px #1a1a1a55' }}>
          시온의 불량한 요소를<br/>모두 제거하는게 좋겠어요!
        </div>
        <button
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 48,
            transform: 'translateX(-50%)',
            background: '#fff',
            color: '#39ff14',
            fontWeight: 700,
            fontSize: 20,
            border: 'none',
            borderRadius: 28,
            padding: '14px 44px',
            boxShadow: '0 2px 16px 0 #39ff1444',
            cursor: 'pointer',
            letterSpacing: 1.1,
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
          onClick={() => setAnimate(true)}
        >
          모두제거하기
        </button>
      </div>
    </div>
  );
} 