import { useEffect, useRef, useState } from 'react';
import GLBPersonaAnimation from './GLBPersonaAnimation';
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

export default function ReceiptMain() {
  const [animate, setAnimate] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const [showNext, setShowNext] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(null); // 'school' | 'work' | 'friend'
  const [emotion, setEmotion] = useState(null); // 감정 선택
  const EMOTION_MODEL = {
    friend: {
      '놀란척': '/fri/friend_omg.glb',
      '슬픈척': '/fri/friend_sad.glb',
      '웃긴척': '/fri/friend_smile.glb',
      '공감하는 척': '/fri/friend_eww.glb',
    },
    school: {
      '놀란척': '/stu/student_omg.glb',
      '슬픈척': '/stu/student_sad.glb',
      '웃긴척': '/stu/student_smile.glb',
      '공감하는 척': '/stu/student_eww.glb',
    },
    work: {
      '놀란척': '/work/worker_omg.glb',
      '슬픈척': '/work/worker_sad.glb',
      '웃긴척': '/work/worker_smile.glb',
      '공감하는 척': '/work/worker_agree.glb',
    },
  };
  const ENV_MODEL = {
    school: '/stu/student.glb',
    work: '/work/worker.glb',
    friend: '/fri/friend.glb',
  };
  const router = useRouter();
  const [dollarPops, setDollarPops] = useState([]);
  const [dollarPop, setDollarPop] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // 애니메이션 끝나면 로딩 시퀀스 시작
  const handleAnimFinish = () => {
    if (loading || done || intervalRef.current) return;
    setTimeout(() => {
      setLoading(true);
      setStep(1);
      let current = 1;
      intervalRef.current = setInterval(() => {
        current++;
        if (current > 5) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setStep(5);
          setLoading(false);
          setDone(true);
        } else {
          setStep(current);
        }
      }, 2000);
    }, 0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

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
      background: step === 5 ? '#f6f6f6' : '#39ff14',
      overflow: 'hidden',
    }}>
      <div style={{ flex: 2, height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <GLBPersonaAnimation
          src={emotion && selectedEnv && EMOTION_MODEL[selectedEnv] ? EMOTION_MODEL[selectedEnv][emotion] : (selectedEnv ? ENV_MODEL[selectedEnv] : LOADING_STEPS[step].glb)}
          animate={step === 0 && animate}
          onFinish={handleAnimFinish}
          step={step}
          scale={3.3}
          dollarPop={dollarPop}
          selectedEnv={selectedEnv}
        />
      </div>
      <div style={{ flex: 1, height: '100vh', background: step === 5 ? '#111' : '#39ff14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {loading && step > 0 && step < 6 && !done && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Spinner />
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginTop: 18, textAlign: 'center', letterSpacing: 1.1 }}>{LOADING_STEPS[step].label}</div>
          </div>
        )}
        {done && !showNext && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 700, fontSize: 24, textAlign: 'center', letterSpacing: 1.2 }}>
            완료되었습니다!
          </div>
        )}
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
        {done && showNext && selectedEnv && (
          <>
            {/* 상단 뒤로가기 버튼 */}
            <button
              onClick={() => { setEmotion(null); setSelectedEnv(null); }}
              style={{
                position: 'absolute',
                top: 24,
                left: 24,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#222',
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
              <span style={{ color: '#111', fontSize: 28, fontWeight: 900 }}>←</span>
            </button>
            {/* 감정 선택 버튼 중앙 배치 */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 260, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              <EmotionButton label="놀란척" desc="상대의 말에 크게 놀란 듯한 리액션을 보입니다." onClick={() => setEmotion('놀란척')} />
              <EmotionButton label="슬픈척" desc="상대의 슬픔에 깊이 공감하는 듯한 표정을 짓습니다." onClick={() => setEmotion('슬픈척')} />
              <EmotionButton label="웃긴척" desc="상대의 이야기가 정말 웃긴 것처럼 크게 웃어줍니다." onClick={() => setEmotion('웃긴척')} />
              <EmotionButton label="공감하는 척" desc="이야기를 듣고 완전히 놀란 척 리액션을 보입니다." onClick={() => setEmotion('공감하는 척')} />
            </div>
            {/* 하단 감정 구매하기 버튼 */}
            <button
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 36,
                transform: 'translateX(-50%)',
                background: '#39ff14',
                color: '#fff',
                fontWeight: 900,
                fontSize: 20,
                border: 'none',
                borderRadius: 28,
                padding: '14px 44px',
                boxShadow: '0 2px 16px 0 #39ff1444',
                cursor: 'pointer',
                letterSpacing: 1.1,
                transition: 'background 0.2s, box-shadow 0.2s',
                zIndex: 10,
              }}
              onClick={() => {
                setDollarPop(true);
                setTimeout(() => setDollarPop(false), 100);
              }}
            >
              이 감정 구매하기
            </button>
            {/* $ 애니메이션 */}
            {dollarPops.map(pop => (
              <span
                key={pop.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${Math.cos(pop.angle) * pop.dist}px, ${Math.sin(pop.angle) * pop.dist}px) scale(1)`,
                  fontSize: 36,
                  fontWeight: 900,
                  color: '#39ff14',
                  opacity: 0.85,
                  pointerEvents: 'none',
                  zIndex: 30,
                  animation: 'dollar-pop 0.9s cubic-bezier(.4,1.6,.6,1) forwards',
                }}
              >$
                <style>{`
                  @keyframes dollar-pop {
                    0% { opacity: 0.7; transform: scale(0.7) translate(-50%,-50%) translate(${Math.cos(pop.angle) * (pop.dist * 0.3)}px, ${Math.sin(pop.angle) * (pop.dist * 0.3)}px); }
                    60% { opacity: 1; transform: scale(1.2) translate(-50%,-50%) translate(${Math.cos(pop.angle) * pop.dist}px, ${Math.sin(pop.angle) * pop.dist}px); }
                    100% { opacity: 0; transform: scale(1.5) translate(-50%,-50%) translate(${Math.cos(pop.angle) * (pop.dist * 1.2)}px, ${Math.sin(pop.angle) * (pop.dist * 1.2)}px); }
                  }
                `}</style>
              </span>
            ))}
          </>
        )}
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

function EmotionButton({ label, desc, onClick }) {
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
        onClick={onClick}
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