import CharacterViewer from '../components/CharacterViewer';
import KiaTitleViewer from '../components/KiaTitleViewer';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#181a1b',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* 상단 안내 문구 - 네온그린 배경, 흰색 글씨, 중앙 */}
      <div style={{
        position: 'absolute',
        top: 38,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        fontSize: 15,
        color: '#fff',
        opacity: 0.98,
        letterSpacing: 0.5,
        fontWeight: 500,
        background: '#39ff14',
        padding: '4px 18px',
        borderRadius: 12,
        pointerEvents: 'none',
        userSelect: 'none',
        boxShadow: '0 2px 12px 0 #39ff1433',
      }}>
        불량한 시온의 사회생활을 위한 자아를 만들어주세요!
      </div>
      {/* 상단 타이틀 - 화면 중앙 50%에서 아주 미세하게 우측으로 이동, 진한 그림자 효과 */}
      <div style={{ position: 'absolute', top: 0, left: '50%', width: 600, zIndex: 50, transform: 'translateX(-48%)', textAlign: 'center', textShadow: '0 6px 24px #000, 0 2px 8px #39ff14, 0 0px 2px #000' }}>
        <KiaTitleViewer />
      </div>
      {/* 좌측 rec 이미지 */}
      <img
        src={'/2d/rec.png'}
        alt="rec-left"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 'auto',
          height: '100vh',
          maxWidth: '18vw',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 50,
        }}
        draggable={false}
      />
      {/* 우측 rec 이미지 */}
      <img
        src={'/2d/rec.png'}
        alt="rec-right"
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: 'auto',
          height: '100vh',
          maxWidth: '18vw',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 50,
        }}
        draggable={false}
      />
      {/* 중앙 캐릭터 뷰어 - 상하도 꽉 차게 */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 10, overflow: 'hidden', pointerEvents: 'none' }}>
        <CharacterViewer lightRender={true} />
      </div>
      {/* 하단 자아 만들기 버튼 */}
      <button
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 36,
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: '#39ff14',
          color: '#fff',
          fontWeight: 700,
          fontSize: 22,
          border: 'none',
          borderRadius: 32,
          padding: '16px 48px',
          boxShadow: '0 4px 24px 0 #39ff1444',
          cursor: 'pointer',
          letterSpacing: 1.2,
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onClick={() => setTimeout(() => router.push('/receipt'), 0)}
      >
        자아 만들기
      </button>
    </div>
  );
} 