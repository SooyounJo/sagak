import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function GLBPersonaAnimation({ src, animate, onFinish }) {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f6f6f6');
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(2, 4, 6);
    scene.add(dirLight);

    // GLB 모델 로드
    const loader = new GLTFLoader();
    loader.load(src, (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -0.7, 0);
      model.scale.set(4.4, 4.4, 4.4);
      model.rotation.x = -0.18;
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
  }, [src]);

  // 애니메이션 트리거
  useEffect(() => {
    if (!animate || !modelRef.current || !cameraRef.current || animatingRef.current) return;
    animatingRef.current = true;
    // x축 반대방향으로 살짝 회전, 카메라 확대는 덜 하고 모델이 하단으로 이동
    const model = modelRef.current;
    const camera = cameraRef.current;
    const startRot = model.rotation.x;
    const endRot = 0.18; // 반대방향
    const startZ = camera.position.z;
    const endZ = 2.8; // 확대는 덜 함
    const startY = model.position.y;
    const endY = -2.5; // 하단으로 더 이동
    const duration = 900; // ms
    const start = performance.now();
    function animateStep(now) {
      const t = Math.min((now - start) / duration, 1);
      model.rotation.x = startRot + (endRot - startRot) * t;
      camera.position.z = startZ + (endZ - startZ) * t;
      model.position.y = startY + (endY - startY) * t;
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