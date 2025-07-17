import { useState } from 'react';
import CharacterViewer from '../components/CharacterViewer';

function ReceiptBox() {
  return (
    <div style={{
      padding: 32,
      color: '#222',
      fontWeight: 600,
      fontSize: 24,
      letterSpacing: 1.2,
    }}>
      <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 24 }}>Receipt</div>
      <div>여기에 결제/행위 결과 UI가 들어갑니다.</div>
    </div>
  );
}

export default function ReceiptPage() {
  const [started, setStarted] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f6f6f6', overflow: 'hidden', position: 'relative' }}>
      {/* 3D 모델 */}
      <div
        style={{
          position: 'absolute',
          left: started ? '5%' : '50%',
          top: '50%',
          transform: started ? 'translateY(-50%)' : 'translate(-50%, -50%)',
          transition: 'all 0.7s cubic-bezier(.7,1.5,.5,1)',
          zIndex: 30,
        }}
      >
        <CharacterViewer />
      </div>
      {/* 결제창 */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 420,
          height: '100vh',
          background: '#fff',
          boxShadow: '-8px 0 32px #0002',
          zIndex: 40,
          transition: 'transform 0.7s cubic-bezier(.7,1.5,.5,1)',
          transform: started ? 'translateX(0)' : 'translateX(100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ReceiptBox />
      </div>
      {/* 시작하기 버튼 */}
      {!started && (
        <button
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 60,
            transform: 'translateX(-50%)',
            zIndex: 50,
            padding: '18px 54px',
            fontSize: '1.3rem',
            fontWeight: 700,
            borderRadius: 32,
            border: 'none',
            background: 'rgba(46,204,64,0.7)',
            color: '#fff',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            letterSpacing: 1.5,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.15s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setStarted(true)}
        >
          시작하기
        </button>
      )}
    </div>
  );
} 