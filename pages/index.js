import CharacterViewer from '../components/CharacterViewer';
import KiaTitleViewer from '../components/KiaTitleViewer';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const router = useRouter();
  const { language, isKorean, isEnglish } = useLanguage();
  
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
        {isKorean 
          ? '불량한 시온의 사회생활을 위한 자아를 만들어주세요!'
          : 'Create a persona for Zion\'s social life!'
        }
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
        {isKorean ? '자아 만들기' : 'Create Persona'}
      </button>
      {/* 언어 변경 버튼 */}
      <button
        onClick={() => router.push('/language')}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 100,
          fontSize: 12,
          color: '#fff',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8,
          padding: '6px 12px',
          cursor: 'pointer',
          fontWeight: 500,
          letterSpacing: 0.5,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0,0,0,0.5)';
          e.target.style.borderColor = 'rgba(255,255,255,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0,0,0,0.3)';
          e.target.style.borderColor = 'rgba(255,255,255,0.2)';
        }}
      >
        {isKorean ? '언어 변경' : 'Language'}
      </button>

      {/* 경고문 - 자아만들기 버튼 아래 */}
      <div style={{
        position: 'fixed',
        left: '50%',
        bottom: 16,
        transform: 'translateX(-50%)',
        zIndex: 100,
        fontSize: 11,
        color: '#ff6b6b',
        opacity: 0.8,
        letterSpacing: 0.3,
        fontWeight: 500,
        background: 'rgba(255, 107, 107, 0.1)',
        padding: '2px 10px',
        borderRadius: 6,
        pointerEvents: 'none',
        userSelect: 'none',
        border: '1px solid rgba(255, 107, 107, 0.3)',
      }}>
        {isKorean 
          ? '!조금 렉이 걸릴 수 있습니다!'
          : '!May be a bit laggy!'
        }
      </div>
    </div>
  );
} 