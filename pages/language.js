import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function LanguageSelect() {
  const { setLanguage } = useLanguage();
  const router = useRouter();

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    router.push('/');
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#181a1b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
    }}>
      {/* 제목 */}
      <div style={{
        color: '#39ff14',
        fontSize: 48,
        fontWeight: 900,
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 20,
        textShadow: '0 4px 16px #39ff1444',
      }}>
        SAGAK WEB
      </div>
      
      {/* 부제목 */}
      <div style={{
        color: '#fff',
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 60,
        opacity: 0.8,
      }}>
        언어를 선택해주세요 / Select Language
      </div>

      {/* 언어 선택 버튼들 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
      }}>
        <button
          onClick={() => handleLanguageSelect('ko')}
          style={{
            background: '#39ff14',
            color: '#000',
            fontWeight: 900,
            fontSize: 24,
            border: 'none',
            borderRadius: 16,
            padding: '20px 60px',
            cursor: 'pointer',
            letterSpacing: 1,
            transition: 'all 0.2s',
            boxShadow: '0 4px 24px #39ff1444',
            minWidth: 200,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 32px #39ff1466';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 24px #39ff1444';
          }}
        >
          한국어
        </button>
        
        <button
          onClick={() => handleLanguageSelect('en')}
          style={{
            background: '#ff00cc',
            color: '#fff',
            fontWeight: 900,
            fontSize: 24,
            border: 'none',
            borderRadius: 16,
            padding: '20px 60px',
            cursor: 'pointer',
            letterSpacing: 1,
            transition: 'all 0.2s',
            boxShadow: '0 4px 24px #ff00cc44',
            minWidth: 200,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 32px #ff00cc66';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 24px #ff00cc44';
          }}
        >
          ENGLISH
        </button>
      </div>
    </div>
  );
} 