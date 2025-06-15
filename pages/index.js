import CharacterViewer from '../components/CharacterViewer';
import KiaTitleViewer from '../components/KiaTitleViewer';
import SlotAnimation from '../components/SlotAnimation';

export default function Home() {
  const slotHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  return (
    <div className="full-viewport">
      <KiaTitleViewer />
      <div style={{
        textAlign: 'center',
        color: '#2ecc40',
        fontWeight: 'bold',
        fontSize: '1rem',
        marginTop: 30,
        marginBottom: 8,
        letterSpacing: 1.5,
        zIndex: 26,
        position: 'relative',
        textShadow: '0 0 2px #fff, 0 0 4px #fff, 0 1px 0 #fff',
        WebkitTextStroke: '1px #fff',
        textStroke: '1px #fff',
      }}>
        불량한 시온이 사회생활을 할 수 있도록<br />
        새로운 페르소나를 만들어주세요!
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, height: '100vh', display: 'flex', alignItems: 'center', zIndex: 20 }}>
        <SlotAnimation width={120} height={slotHeight} speed={1.2} />
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, height: '100vh', display: 'flex', alignItems: 'center', zIndex: 20 }}>
        <SlotAnimation width={120} height={slotHeight} speed={1.2} />
      </div>
      <CharacterViewer />
      <button
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 40,
          transform: 'translateX(-50%)',
          zIndex: 50,
          padding: '20px 60px',
          fontSize: '1.6rem',
          fontWeight: 900,
          borderRadius: 40,
          border: '4px solid #fff',
          background: 'linear-gradient(90deg, #fffb00 0%, #ff00c8 100%)',
          color: '#232526',
          boxShadow: '0 8px 32px 0 rgba(255,0,200,0.25), 0 2px 8px #000a',
          letterSpacing: 2,
          textShadow: '0 2px 8px #fff, 0 0 2px #ff00c8',
          cursor: 'pointer',
          transition: 'transform 0.15s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.08)';
          e.currentTarget.style.boxShadow = '0 12px 40px 0 #ff00c855, 0 2px 8px #000a';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(255,0,200,0.25), 0 2px 8px #000a';
        }}
      >
        🚀 시작하기
      </button>
    </div>
  );
} 