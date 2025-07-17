import { useEffect, useRef, useState } from 'react';
import GLBPersonaAnimation from '../components/GLBPersonaAnimation';

const LOADING_STEPS = [
  { glb: '/3d/main.glb', label: null },
  { glb: '/del/1.glb', label: '1차 로딩' },
  { glb: '/del/2.glb', label: '2차 로딩' },
  { glb: '/del/3.glb', label: '3차 로딩' },
  { glb: '/del/4.glb', label: '4차 로딩' },
  { glb: '/del/5.glb', label: '5차 로딩' },
];

function Spinner() {
  return (
    <div style={{
      width: 54,
      height: 54,
      border: '6px solid #fff',
      borderTop: '6px solid #39ff14',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto',
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function ReceiptPage() {
  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [animate, setAnimate] = useState(false);
  const [step, setStep] = useState(0); // 0: 기본, 1~5: 로딩 단계
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  // 애니메이션 끝나면 로딩 시퀀스 시작
  const handleAnimFinish = () => {
    if (loading || done || intervalRef.current) return; // 중복 방지
    setTimeout(() => {
      setLoading(true);
      setStep(1);
      let current = 1;
      intervalRef.current = setInterval(() => {
        current++;
        if (current > 5) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setStep(5); // 5단계에서 고정
          setLoading(false); // 5glb에서 멈추고 스피너/문구 사라짐
          setDone(true); // 완료 문구 표시
        } else {
          setStep(current);
        }
      }, 2000);
    }, 0); // 대기 없이 바로 1.glb부터 시작
  };

  // 언마운트 시 interval 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      background: step === 5 ? '#f6f6f6' : '#39ff14', // 5.glb면 그레이, 아니면 그린
      overflow: 'hidden',
    }}>
      {/* 좌측 3분의 2에 3D GLB 모델 (애니메이션/교체) */}
      <div style={{ flex: 2, height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <GLBPersonaAnimation
          src={LOADING_STEPS[step].glb}
          animate={step === 0 && animate}
          onFinish={handleAnimFinish}
          step={step}
        />
      </div>
      {/* 우측 3분의 1 박스 + 안내문구/버튼/로딩 */}
      <div style={{ flex: 1, height: '100vh', background: step === 5 ? '#111' : '#39ff14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* 로딩 시 스피너와 문구 */}
        {loading && step > 0 && step < 6 && !done && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Spinner />
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginTop: 18, textAlign: 'center', letterSpacing: 1.1 }}>{LOADING_STEPS[step].label}</div>
          </div>
        )}
        {/* 완료 시 문구 */}
        {done && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 700, fontSize: 24, textAlign: 'center', letterSpacing: 1.2 }}>
            완료되었습니다!
          </div>
        )}
        {/* 기본 안내문구/버튼 */}
        {!loading && step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 32, lineHeight: 1.5, textShadow: '0 2px 8px #1a1a1a55' }}>
              시온의 불량한 요소를<br/>모두 제거하는게 좋겠어요!
            </div>
            <button
              style={{
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
        )}
      </div>
    </div>
  );
} 