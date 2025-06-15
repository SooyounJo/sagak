import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSpring } from '@react-spring/web';
import Lighting from './Lighting';
import ModelViewer from './ModelViewer';
import CameraController from './CameraController';

// 요소별 컬러 세트
const COLOR_SETS = [
  [null, null, null], // 원래색
  [0x3498db, 0xe74c3c, 0xf1c40f], // 파랑, 빨강, 노랑
  [0x2ecc40, 0x9b59b6, 0xe67e22], // 초록, 보라, 주황
];

// 카메라 프리셋: 기본 뷰 1개 + 얼굴 클로즈업 2개
const CAMERA_PRESETS = [
  // 기본 뷰
  { pos: { x: 2.2, y: -1.2, z: 1.9 }, look: { x: 0.7, y: -1.1, z: 0.4 } },
  // 얼굴 클로즈업 1
  { pos: { x: 1, y: -0.5, z: 0.9 }, look: { x: 0.5, y: -0.7, z: 0.4 } },
  // 얼굴 클로즈업 2 (약간 아래에서)
  { pos: { x: 0.5, y: -1, z: 0.5 }, look: { x: 0, y: -0.9, z: 0 } },
];

export default function CharacterViewer() {
  const mountRef = useRef(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [springProps, api] = useSpring(() => ({
    camX: CAMERA_PRESETS[0].pos.x,
    camY: CAMERA_PRESETS[0].pos.y,
    camZ: CAMERA_PRESETS[0].pos.z,
    lookX: CAMERA_PRESETS[0].look.x,
    lookY: CAMERA_PRESETS[0].look.y,
    lookZ: CAMERA_PRESETS[0].look.z,
    config: { tension: 220, friction: 22 },
  }));
  const cameraRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const spotTargetRef = useRef();
  const modelRef = useRef();
  const colorTimer = useRef();
  const originalColors = useRef([]);

  // 컬러 애니메이션(그라데이션) 함수
  function animateColor(current, target, duration = 1000) {
    let start = null;
    const from = current.clone();
    function step(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      current.r = from.r + (target.r - from.r) * t;
      current.g = from.g + (target.g - from.g) * t;
      current.b = from.b + (target.b - from.b) * t;
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      if (t < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // 컬러 변경 함수 (요소별로 다르게 적용)
  const applyColor = (idx) => {
    const model = modelRef.current;
    if (!model) return;
    const colorSet = COLOR_SETS[idx % COLOR_SETS.length];
    let meshIdx = 0;
    model.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        child.geometry &&
        child.geometry.attributes.uv
      ) {
        const origColor = originalColors.current[child.uuid] || child.material.color;
        // 완전 화이트(1,1,1)만 제외
        if (!(origColor.r === 1 && origColor.g === 1 && origColor.b === 1)) {
          const targetColor = colorSet[meshIdx % colorSet.length];
          if (targetColor === null) {
            // 원래색 복원
            if (originalColors.current[child.uuid]) {
              animateColor(child.material.color, originalColors.current[child.uuid]);
            }
          } else {
            if (!originalColors.current[child.uuid]) {
              originalColors.current[child.uuid] = child.material.color.clone();
            }
            animateColor(child.material.color, new THREE.Color(targetColor));
          }
          meshIdx++;
        }
      }
    });
    if (rendererRef.current && cameraRef.current && sceneRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // 자동 컬러 변경 타이머
  useEffect(() => {
    if (colorTimer.current) clearInterval(colorTimer.current);
    colorTimer.current = setInterval(() => {
      setColorIdx((prev) => (prev + 1) % COLOR_SETS.length);
    }, 3000);
    return () => clearInterval(colorTimer.current);
  }, []);

  // 컬러 인덱스가 바뀔 때마다 적용 + 카메라 스프링 이동
  useEffect(() => {
    applyColor(colorIdx);
    const preset = CAMERA_PRESETS[colorIdx % CAMERA_PRESETS.length];
    api.start({
      camX: preset.pos.x,
      camY: preset.pos.y,
      camZ: preset.pos.z,
      lookX: preset.look.x,
      lookY: preset.look.y,
      lookZ: preset.look.z,
      config: { tension: 220, friction: 22 },
    });
  }, [colorIdx]);

  // three.js scene/camera/renderer 초기화
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232526);
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);
    // 리사이즈 대응
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleColorSlide = (dir) => {
    setColorIdx((prev) => {
      if (dir === 'left') {
        return (prev - 1 + COLOR_SETS.length) % COLOR_SETS.length;
      } else {
        return (prev + 1) % COLOR_SETS.length;
      }
    });
  };

  return (
    <>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }} />
      {/* 3D 요소 분리 컴포넌트 */}
      <Lighting scene={sceneRef.current} camera={cameraRef.current} spotTargetRef={spotTargetRef} />
      <ModelViewer scene={sceneRef.current} camera={cameraRef.current} colorIdx={colorIdx} COLOR_SETS={COLOR_SETS} originalColors={originalColors} applyColor={applyColor} modelRef={modelRef} />
      <CameraController cameraRef={cameraRef} springProps={springProps} spotTargetRef={spotTargetRef} rendererRef={rendererRef} sceneRef={sceneRef} />
      <button onClick={() => handleColorSlide('left')}
        style={{
          position: 'fixed',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          fontSize: 28,
          borderRadius: '0 12px 12px 0',
          border: 'none',
          background: '#232526cc',
          color: '#fff',
          width: 48,
          height: 64,
          cursor: 'pointer',
          zIndex: 30
        }}
      >◀</button>
      <button onClick={() => handleColorSlide('right')}
        style={{
          position: 'fixed',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          fontSize: 28,
          borderRadius: '12px 0 0 12px',
          border: 'none',
          background: '#232526cc',
          color: '#fff',
          width: 48,
          height: 64,
          cursor: 'pointer',
          zIndex: 30
        }}
      >▶</button>
    </>
  );
} 