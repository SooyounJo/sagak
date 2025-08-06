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
  const [showItemSelect, setShowItemSelect] = useState(false); // 구매 품목 선택창 표시
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 품목
  const ITEM_LIST = [
    { key: 'pop', label: 'pop clear!', desc: '담배 한모금' },
    { key: 'brain', label: 'NEW BRAIN', desc: '생각이 안날땐 지피티를!' },
    { key: 'flex', label: 'BIG FLEX', desc: '남들보다 못나가는 것 처럼 보일 수 없지' },
    { key: 'famous', label: 'FAMOUS ME', desc: '행복한 나의 모습을 만들어서라도 보여주자!' },
  ];
  const [showReceipt, setShowReceipt] = useState(false); // 결과 영수증 표시
  const [receiptStep, setReceiptStep] = useState(0); // 영수증 줄 순차 표시
  const FINAL_RESULTS = [
    'SO, WHO ARE YOU?',
  ];
  // 각 선택별 결과 문구 프리셋
  const ENV_RESULT = {
    school: '적응을 위해 자신을 속였어요',
    work: '생존을 위해 자신을 감췄어요',
    friend: '관계를 위해 자신을 포장했어요',
  };
  const EMOTION_RESULT = {
    '놀란척': '진심을 숨겼어요',
    '슬픈척': '공감을 연기했어요',
    '웃긴척': '억지로 웃었어요',
    '공감하는 척': '마음을 감췄어요',
  };
  const ITEM_RESULT = {
    pop: '담배 한모금으로 스트레스를 잠시 잊었어요',
    brain: 'AI에게 의존하게 되었어요',
    flex: '자신감을 과도하게 표현했어요',
    famous: '가짜 행복을 연기했어요',
  };
  const [bgBlack, setBgBlack] = useState(false); // 3D 배경 블랙 전환
  const [showRetry, setShowRetry] = useState(false); // 새로운 식사 시도 문구 표시

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

  useEffect(() => {
    if (showReceipt) {
      setShowRetry(false);
      // 최종 결과까지 다 나오고 5초 뒤 문구 표시
      const t = setTimeout(() => setShowRetry(true), 7700); // receiptStep 5까지 4.2초 + 5초
      return () => clearTimeout(t);
    }
  }, [showReceipt, selectedEnv, emotion, selectedItem]);

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
          bgBlack={bgBlack}
        />
      </div>
      <div style={{ flex: 1, height: '100vh', background: step === 5 ? '#111' : '#39ff14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {loading && step > 0 && step < 6 && !done && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 8, textAlign: 'center', letterSpacing: 1.1, textShadow: '0 2px 8px #1a1a1a55', whiteSpace: 'nowrap' }}>
              필요없는 개성을 모두 제거합니다
            </div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 18, textAlign: 'center', letterSpacing: 1.1, textShadow: '0 2px 8px #1a1a1a55' }}>
              {LOADING_STEPS[step].label}
            </div>
            <Spinner />
          </div>
        )}
        {done && !showNext && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 700, fontSize: 24, textAlign: 'center', letterSpacing: 1.2 }}>
            완료되었습니다!
          </div>
        )}
        {done && showNext && !selectedEnv && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 28, marginBottom: 8, textAlign: 'center', letterSpacing: 1.2 }}>
              메인디쉬
            </div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 32, textAlign: 'center', letterSpacing: 1.1 }}>
              시온을 어떤 환경에 내려놓을까요?
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => setSelectedEnv('school')} style={{ background: '#fff', color: '#111', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 24, padding: '12px 32px', cursor: 'pointer' }}>학교</button>
              <button onClick={() => setSelectedEnv('work')} style={{ background: '#fff', color: '#111', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 24, padding: '12px 32px', cursor: 'pointer' }}>회사</button>
              <button onClick={() => setSelectedEnv('friend')} style={{ background: '#fff', color: '#111', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 24, padding: '12px 32px', cursor: 'pointer' }}>이외의 인간관계</button>
            </div>
          </div>
        )}
        {done && showNext && selectedEnv && !showItemSelect && (
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
              <span style={{ color: '#111', fontSize: 24, fontWeight: 900, marginLeft: -1 }}>◀</span>
            </button>
            {/* 제목과 부제목 */}
            <div style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 28, marginBottom: 8, textAlign: 'center', letterSpacing: 1.2 }}>
                서브디쉬
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 32, textAlign: 'center', letterSpacing: 1.1, lineHeight: 1.4 }}>
                시온의 주변인이 대화중 반응을 기대하고 있어요.<br/>어떤 반응을 보이게 할까요?
              </div>
            </div>
            {/* 감정 선택 버튼 중앙 배치 */}
            <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translate(-50%, -50%)', width: 240, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
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
                fontSize: 18,
                border: 'none',
                borderRadius: 24,
                padding: '12px 36px',
                boxShadow: '0 2px 16px 0 #39ff1444',
                cursor: 'pointer',
                letterSpacing: 1.1,
                transition: 'background 0.2s, box-shadow 0.2s',
                zIndex: 10,
              }}
              onClick={() => {
                setDollarPop(true);
                setTimeout(() => {
                  setDollarPop(false);
                  setShowItemSelect(true); // 구매 품목 선택창 띄우기
                }, 100);
              }}
            >
              이 감정 구매하기
            </button>
          </>
        )}
        {/* 구매 품목 선택창 */}
        {showItemSelect && !showReceipt && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 340,
            background: '#39ff14',
            borderRadius: 32,
            boxShadow: '0 4px 32px #39ff1444',
            padding: '48px 0 32px 0', // padding-top 늘림
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 100,
          }}>
            {/* 블랙박스(초록 바) 내부 좌측 상단에 뒤로가기 버튼 */}
            <button
              onClick={() => { setShowItemSelect(false); setSelectedItem(null); }}
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#222',
                color: '#fff',
                border: 'none',
                fontSize: 22,
                fontWeight: 900,
                boxShadow: '0 2px 8px #1112',
                cursor: 'pointer',
                zIndex: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              <span style={{ color: '#fff', fontSize: 18, fontWeight: 900, marginLeft: -1 }}>◀</span>
            </button>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 26, marginBottom: 8, letterSpacing: 1.1, marginTop: 8 }}>
              음료
            </div>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: 14, marginBottom: 24, letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.3 }}>
              완벽한 사회인이 되도록 아이템을 선택해주세요!
            </div>
            <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              {ITEM_LIST.map(item => (
                <div key={item.key} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <button
                    onClick={() => setSelectedItem(item.key)}
                    style={{
                      width: '100%',
                      background: selectedItem === item.key ? '#fff' : '#232526',
                      color: selectedItem === item.key ? '#39ff14' : '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                      border: 'none',
                      borderRadius: 20,
                      padding: '14px 0',
                      cursor: 'pointer',
                      boxShadow: selectedItem === item.key ? '0 2px 12px #39ff1444' : 'none',
                      transition: 'background 0.2s, color 0.2s',
                      marginBottom: 4,
                    }}
                    onMouseEnter={e => {
                      const tooltip = e.currentTarget.nextSibling;
                      if (tooltip) tooltip.style.opacity = 1;
                    }}
                    onMouseLeave={e => {
                      const tooltip = e.currentTarget.nextSibling;
                      if (tooltip) tooltip.style.opacity = 0;
                    }}
                  >
                    {item.label}
                  </button>
                  <div style={{
                    fontSize: 12,
                    color: '#000',
                    fontWeight: 700,
                    textAlign: 'center',
                    lineHeight: 1.2,
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    padding: '6px 10px',
                    borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                  }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
            {/* 선택 완료 버튼(추후 기능 확장 가능) */}
            <button
              style={{
                marginTop: 32,
                background: selectedItem ? '#ff00cc' : '#bbb',
                color: selectedItem ? '#fff' : '#888',
                fontWeight: 900,
                fontSize: 18,
                border: 'none',
                borderRadius: 24,
                padding: '12px 44px',
                cursor: selectedItem ? 'pointer' : 'not-allowed',
                boxShadow: selectedItem ? '0 0 16px 4px #ff00cc88, 0 2px 12px #ff99ff44' : '0 2px 12px #bbb8',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
              }}
              disabled={!selectedItem}
              onClick={() => {
                setShowReceipt(true);
                setReceiptStep(0);
                setBgBlack(false);
                // 순차적으로 한 줄씩 표시 (총 6단계)
                setTimeout(() => setReceiptStep(1), 700);
                setTimeout(() => setReceiptStep(2), 1400);
                setTimeout(() => setReceiptStep(3), 2100);
                setTimeout(() => setReceiptStep(4), 2800);
                setTimeout(() => setReceiptStep(5), 3500);
                setTimeout(() => setBgBlack(true), 4200); // 영수증 다 나오고 배경 블랙
              }}
            >
              선택 완료
            </button>
          </div>
        )}
        {/* 결과 영수증(계산서) 화면 */}
        {showItemSelect && showReceipt && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 360,
            background: '#39ff14',
            borderRadius: 32,
            boxShadow: '0 8px 48px #39ff1444',
            minHeight: '520px',
            padding: '64px 0 56px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 200,
            fontFamily: 'Noto Sans KR, sans-serif',
            justifyContent: 'flex-start',
            animation: 'receipt-print 0.8s ease-out',
            overflow: 'hidden',
          }}>
            <style jsx>{`
              @keyframes receipt-print {
                0% {
                  transform: translate(-50%, -50%) scaleY(0);
                  opacity: 0;
                }
                50% {
                  transform: translate(-50%, -50%) scaleY(0.3);
                  opacity: 0.7;
                }
                100% {
                  transform: translate(-50%, -50%) scaleY(1);
                  opacity: 1;
                }
              }
              
              @keyframes receipt-line-print {
                0% {
                  transform: scaleY(0);
                  opacity: 0;
                }
                100% {
                  transform: scaleY(1);
                  opacity: 1;
                }
              }
              
              @keyframes button-pump {
                0%, 100% {
                  transform: scale(1);
                  box-shadow: 0 2px 16px 0 #39ff1444;
                }
                50% {
                  transform: scale(1.05);
                  box-shadow: 0 4px 24px 0 #39ff1466;
                }
              }
            `}</style>
            <div style={{ color: '#222', fontWeight: 900, fontSize: 22, marginBottom: 18, letterSpacing: 1.1 }}>
              영수증
            </div>
            {/* 환경 */}
            {receiptStep > 0 && (
              <>
                <div style={{ 
                  color: 'rgba(255,255,255,0.55)', 
                  fontSize: 17, 
                  fontWeight: 900, 
                  width: 260, 
                  textAlign: 'left', 
                  marginBottom: 0,
                  animation: 'receipt-line-print 0.3s ease-out',
                  transformOrigin: 'top',
                }}>환경</div>
                <div style={{ 
                  color: '#fff', 
                  fontSize: 18, 
                  fontWeight: 900, 
                  width: 260, 
                  textAlign: 'left', 
                  marginBottom: 0,
                  animation: 'receipt-line-print 0.3s ease-out 0.1s both',
                  transformOrigin: 'top',
                }}>{selectedEnv === 'school' ? '학교' : selectedEnv === 'work' ? '직장' : '인간관계'}</div>
              </>
            )}
            {receiptStep > 1 && (
              <div style={{ 
                color: '#fff', 
                fontSize: 15, 
                fontWeight: 900, 
                width: 260, 
                textAlign: 'right', 
                marginBottom: 16,
                animation: 'receipt-line-print 0.3s ease-out',
                transformOrigin: 'top',
              }}>{ENV_RESULT[selectedEnv]}</div>
            )}
            {receiptStep > 1 && (
              <div style={{ 
                width: 260, 
                borderTop: '2px solid #fff', 
                margin: '16px 0 20px 0',
                animation: 'receipt-line-print 0.2s ease-out',
              }} />
            )}
            {/* 감정 */}
            {receiptStep > 2 && (
              <>
                <div style={{ 
                  color: 'rgba(255,255,255,0.55)', 
                  fontSize: 17, 
                  fontWeight: 900, 
                  width: 260, 
                  textAlign: 'left', 
                  marginBottom: 0,
                  animation: 'receipt-line-print 0.3s ease-out',
                  transformOrigin: 'top',
                }}>감정</div>
                <div style={{ 
                  color: '#fff', 
                  fontSize: 18, 
                  fontWeight: 900, 
                  width: 260, 
                  textAlign: 'left', 
                  marginBottom: 0,
                  animation: 'receipt-line-print 0.3s ease-out 0.1s both',
                  transformOrigin: 'top',
                }}>{emotion}</div>
              </>
            )}
            {receiptStep > 3 && (
              <div style={{ 
                color: '#fff', 
                fontSize: 15, 
                fontWeight: 900, 
                width: 260, 
                textAlign: 'right', 
                marginBottom: 16,
                animation: 'receipt-line-print 0.3s ease-out',
                transformOrigin: 'top',
              }}>{EMOTION_RESULT[emotion]}</div>
            )}
            {receiptStep > 3 && (
              <div style={{ 
                width: 260, 
                borderTop: '2px solid #fff', 
                margin: '16px 0 20px 0',
                animation: 'receipt-line-print 0.2s ease-out',
              }} />
            )}
            {/* 구매 품목 */}
            {receiptStep > 4 && (
              <>
                <div style={{ 
                  color: 'rgba(255,255,255,0.55)', 
                  fontSize: 17, 
                  fontWeight: 900, 
                  width: 260, 
                  textAlign: 'left', 
                  marginBottom: 0,
                  animation: 'receipt-line-print 0.3s ease-out',
                  transformOrigin: 'top',
                }}>구매 품목</div>
                <div style={{ 
                  color: '#fff', 
                  fontSize: 18, 
                  fontWeight: 900, 
                  width: 260, 
                  textAlign: 'left', 
                  marginBottom: 0,
                  animation: 'receipt-line-print 0.3s ease-out 0.1s both',
                  transformOrigin: 'top',
                }}>{ITEM_LIST.find(i => i.key === selectedItem)?.label}</div>
              </>
            )}
            {receiptStep >= 5 && (
              <div style={{ 
                color: '#fff', 
                fontSize: 15, 
                fontWeight: 900, 
                width: 260, 
                textAlign: 'right', 
                marginBottom: 24,
                animation: 'receipt-line-print 0.3s ease-out',
                transformOrigin: 'top',
              }}>{ITEM_RESULT[selectedItem]}</div>
            )}
            {/* 구분선, 오늘 식사의 가격은, 최종 결과 */}
            {receiptStep >= 5 && (
              <>
                <div style={{ 
                  width: 260, 
                  borderTop: '2px dashed #fff', 
                  margin: '28px 0 0 0',
                  animation: 'receipt-line-print 0.3s ease-out',
                }} />
                <div style={{ 
                  width: 260, 
                  borderTop: '2px dashed #fff', 
                  margin: '8px 0 0 0',
                  animation: 'receipt-line-print 0.3s ease-out 0.1s both',
                }} />
                <div style={{ 
                  color: '#fff', 
                  fontWeight: 900, 
                  fontSize: 18, 
                  marginTop: 36, 
                  textAlign: 'center', 
                  width: 260, 
                  letterSpacing: 0.5,
                  animation: 'receipt-line-print 0.4s ease-out 0.2s both',
                  transformOrigin: 'top',
                }}>
                  오늘 식사의 가격은?
                </div>
                <div style={{ 
                  color: '#ff00cc', 
                  fontWeight: 900, 
                  fontSize: 20, 
                  marginTop: 8, 
                  textAlign: 'center', 
                  width: 260,
                  animation: 'receipt-line-print 0.4s ease-out 0.3s both',
                  transformOrigin: 'top',
                }}>
                  {FINAL_RESULTS[Math.floor(Math.random() * FINAL_RESULTS.length)]}
                </div>
                {showRetry && (
                  <button
                    style={{
                      marginTop: 44,
                      background: '#fff',
                      color: '#39ff14',
                      fontWeight: 900,
                      fontSize: 18,
                      border: 'none',
                      borderRadius: 24,
                      padding: '14px 44px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 16px 0 #39ff1444',
                      letterSpacing: 0.5,
                      transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                      width: 260,
                      opacity: 0.96,
                      animation: 'button-pump 2s ease-in-out infinite',
                    }}
                    onClick={() => router.push('/')}
                  >
                    새로운 구매를 진행해보시겠어요?
                  </button>
                )}
              </>
            )}
          </div>
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
          fontSize: 16,
          border: 'none',
          borderRadius: 20,
          padding: '12px 0',
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
        fontSize: 13,
        fontWeight: 400,
        borderRadius: 10,
        padding: '8px 14px',
        marginTop: 6,
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