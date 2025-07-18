import { useEffect, useRef, useState } from 'react';
import GLBPersonaAnimation from '../components/GLBPersonaAnimation';
import { useRouter } from 'next/router';

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
  const [showNext, setShowNext] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(null); // 'school' | 'work' | 'friend'
  const [emotion, setEmotion] = useState(null); // 감정 선택
  const router = useRouter();

  // 환경별 모델 경로
  const ENV_MODEL = {
    school: '/stu/student.glb',
    work: '/work/worker.glb',
    friend: '/fri/friend.glb',
  };

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

  // 완료 후 2초 뒤 showNext 활성화
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setShowNext(true), 2000);
      return () => clearTimeout(t);
    } else {
      setShowNext(false);
    }
  }, [done]);

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
          src={selectedEnv ? ENV_MODEL[selectedEnv] : LOADING_STEPS[step].glb}
          animate={step === 0 && animate}
          onFinish={handleAnimFinish}
          step={step}
          scale={3.3}
        />
      </div>
      {/* 우측 3분의 1 박스 + 안내문구/버튼/로딩 */}
      <div style={{ flex: 1, height: '100vh', background: step === 5 ? '#111' : '#39ff14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* 상단 뒤로가기 버튼 */}
        <button
          onClick={() => router.push('/')}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#39ff14',
            color: '#111',
            border: 'none',
            fontSize: 28,
            fontWeight: 900,
            boxShadow: '0 2px 12px #1112',
            cursor: 'pointer',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          ←
        </button>
        {/* 로딩 시 스피너와 문구 */}
        {loading && step > 0 && step < 6 && !done && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Spinner />
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginTop: 18, textAlign: 'center', letterSpacing: 1.1 }}>{LOADING_STEPS[step].label}</div>
          </div>
        )}
        {/* 완료 시 문구 */}
        {done && !showNext && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 700, fontSize: 24, textAlign: 'center', letterSpacing: 1.2 }}>
            완료되었습니다!
          </div>
        )}
        {/* 완료 2초 후 다음 질문/버튼 */}
        {done && showNext && !selectedEnv && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 32, textAlign: 'center', letterSpacing: 1.1 }}>
              이번에 만들 자아는<br/>어떤 환경에 놓여있나요?
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => setSelectedEnv('school')} style={{ background: '#fff', color: '#111', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 24, padding: '12px 32px', cursor: 'pointer' }}>학교</button>
              <button onClick={() => setSelectedEnv('work')} style={{ background: '#fff', color: '#111', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 24, padding: '12px 32px', cursor: 'pointer' }}>회사</button>
              <button onClick={() => setSelectedEnv('friend')} style={{ background: '#fff', color: '#111', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 24, padding: '12px 32px', cursor: 'pointer' }}>이외의 인간관계</button>
            </div>
          </div>
        )}
        {/* 환경 선택 후 감정 선택 및 뒤로가기 */}
        {done && showNext && selectedEnv && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 32, textAlign: 'center', letterSpacing: 1.1 }}>
              상대가 공감을 바라고 있습니다.<br/>어떤 감정을 보이시겠습니까?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32, width: 260 }}>
              <EmotionButton label="놀란척" desc="상대의 말에 크게 놀란 듯한 리액션을 보입니다." />
              <EmotionButton label="슬픈척" desc="상대의 슬픔에 깊이 공감하는 듯한 표정을 짓습니다." />
              <EmotionButton label="웃긴척" desc="상대의 이야기가 정말 웃긴 것처럼 크게 웃어줍니다." />
              <EmotionButton label="공감하는 척" desc="진심으로 공감하는 듯한 따뜻한 리액션을 보입니다." />
            </div>
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

// 감정 버튼 컴포넌트 (툴팁)
function EmotionButton({ label, desc }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        style={{
          background: '#fff',
          color: '#111',
          fontWeight: 700,
          fontSize: 18,
          border: 'none',
          borderRadius: 24,
          padding: '14px 0',
          width: '100%',
          cursor: 'pointer',
          marginBottom: 0,
          position: 'relative',
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={e => {
          const tip = e.currentTarget.nextSibling;
          if (tip) tip.style.opacity = 1;
        }}
        onMouseLeave={e => {
          const tip = e.currentTarget.nextSibling;
          if (tip) tip.style.opacity = 0;
        }}
      >
        {label}
      </button>
      <div style={{
        opacity: 0,
        pointerEvents: 'none',
        position: 'absolute',
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%)',
        background: '#222',
        color: '#fff',
        fontSize: 15,
        fontWeight: 400,
        borderRadius: 12,
        padding: '10px 18px',
        marginTop: 8,
        boxShadow: '0 2px 12px #1115',
        whiteSpace: 'nowrap',
        zIndex: 10,
        transition: 'opacity 0.2s',
      }}>
        {desc}
      </div>
    </div>
  );
} 