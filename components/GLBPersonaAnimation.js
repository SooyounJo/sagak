import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function GLBPersonaAnimation({ src, animate, onFinish, step, scale=2.9 }) {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(step === 5 ? '#bbb' : '#fff');
    // FOV를 24로 더 줄여 왜곡 최소화
    const camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.2); // 살짝 뒤로
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // 주변광 약하게
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 3.5); // 더 강하게
    dirLight.position.set(-6, 4, 2); // 좌측(-x)에서 쏨
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);
    // 그림자 받는 평면 추가 (바닥)
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.25 });
    const shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 우측에서 연한 연두색 반사광 추가
    const rightLight = new THREE.PointLight('#baffc9', 1.2, 10);
    rightLight.position.set(4, 2, 2); // 우측(+x)에서 쏨
    rightLight.castShadow = false;
    scene.add(rightLight);

    // GLB 모델 로드
    const loader = new GLTFLoader();
    loader.load(src, (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -0.8, 0); // 초기 y 위치
      model.scale.set(scale, scale, scale); // props로 받은 scale 적용
      model.rotation.x = 0.18; // main.glb 애니메이션 후 각도를 기본값으로 적용
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      modelRef.current = model;
      scene.add(model);
      renderer.render(scene, camera);
    });

    // 애니메이션 루프
    let raf;
    function animateLoop() {
      raf = requestAnimationFrame(animateLoop);
      renderer.render(scene, camera);
    }
    animateLoop();

    return () => {
      cancelAnimationFrame(raf);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [src, step, scale]);

  // 애니메이션 트리거
  useEffect(() => {
    if (!animate || !modelRef.current || !cameraRef.current || animatingRef.current) return;
    animatingRef.current = true;
    // x축 회전 0.18, 카메라 z축만 이동, y 위치는 고정
    const model = modelRef.current;
    const camera = cameraRef.current;
    const startRot = model.rotation.x;
    const endRot = 0.18;
    const startZ = camera.position.z;
    const endZ = 2.8;
    // y 위치 애니메이션 제거
    const duration = 900; // ms
    const start = performance.now();
    function animateStep(now) {
      const t = Math.min((now - start) / duration, 1);
      model.rotation.x = startRot + (endRot - startRot) * t;
      camera.position.z = startZ + (endZ - startZ) * t;
      // model.position.y는 변경하지 않음
      camera.lookAt(0, 0, 0);
      if (t < 1) {
        requestAnimationFrame(animateStep);
      } else {
        animatingRef.current = false;
        if (onFinish) onFinish();
      }
    }
    requestAnimationFrame(animateStep);
  }, [animate, onFinish]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
} 