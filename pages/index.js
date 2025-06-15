import CharacterViewer from '../components/CharacterViewer';
import KiaTitleViewer from '../components/KiaTitleViewer';

export default function Home() {
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
      }}>
        불량한 시온이 사회생활을 할 수 있도록<br />
        새로운 페르소나를 만들어주세요!
      </div>
      <CharacterViewer />
    </div>
  );
} 