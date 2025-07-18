import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function GLBPersonaAnimation({ src, animate, onFinish, step, scale=2.9, dollarPop, selectedEnv }) {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const animatingRef = useRef(false);
  const [popKey, setPopKey] = useState(0);
  const popAnimFrameRef = useRef();

  // $ 3D 애니메이션 관련 함수 (컴포넌트 스코프에 선언)
  let dollarMeshes = [];
  let dollarAnims = [];
  function createDollarMeshes(scene) {
    for (let i = 0; i < 8; i++) {
      const fontSize = 0.32 + Math.random() * 0.1;
      const canvas = document.createElement('canvas');
      canvas.width = 192; canvas.height = 192;
      const ctx = canvas.getContext('2d');
      ctx.font = `bold 154px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#39ff14';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 6;
      ctx.strokeText('$', 96, 96);
      ctx.fillText('$', 96, 96);
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
      const geo = new THREE.PlaneGeometry(fontSize, fontSize);
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 0.7 + Math.random() * 0.5;
      mesh.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist - 0.5, -1.7 - Math.random() * 0.5);
      mesh.rotation.z = Math.random() * Math.PI * 2;
      mesh.renderOrder = 10;
      scene.add(mesh);
      dollarMeshes.push(mesh);
      dollarAnims.push({
        vx: Math.cos(angle) * (0.01 + Math.random() * 0.01),
        vy: 0.012 + Math.random() * 0.012,
        vz: 0.035 + Math.random() * 0.02,
        rot: (Math.random() - 0.5) * 0.04,
        t: 0,
      });
    }
  }
  function animateDollars(scene, camera, renderer, popAnimFrameRef) {
    if (dollarMeshes.length === 0) return;
    for (let i = 0; i < dollarMeshes.length; i++) {
      const mesh = dollarMeshes[i];
      const anim = dollarAnims[i];
      anim.t += 1/60;
      mesh.position.x += anim.vx;
      mesh.position.y += anim.vy;
      mesh.position.z += anim.vz;
      mesh.material.opacity = Math.max(0, 1 - anim.t * 0.7);
      mesh.rotation.z += anim.rot;
      if (anim.t > 1.1) {
        scene.remove(mesh);
      }
    }
    renderer.render(scene, camera);
    popAnimFrameRef.current = requestAnimationFrame(() => animateDollars(scene, camera, renderer, popAnimFrameRef));
  }

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
      // 배경 플레인 추가 (모델 바로 뒤)
      let bgUrl = null;
      if (selectedEnv === 'school') bgUrl = '/sch.jpg';
      else if (selectedEnv === 'work') bgUrl = '/wor.jpg';
      else if (selectedEnv === 'friend') bgUrl = '/cla.jpg';
      if (bgUrl) {
        const texLoader = new THREE.TextureLoader();
        texLoader.load(bgUrl, (tex) => {
          const bgGeo = new THREE.PlaneGeometry(5.2, 3.7);
          const bgMat = new THREE.MeshBasicMaterial({ map: tex, transparent: false });
          const bgMesh = new THREE.Mesh(bgGeo, bgMat);
          bgMesh.position.set(0, 0.3, -2.5);
          bgMesh.renderOrder = 1;
          scene.add(bgMesh);
        });
      }
    });

    // 애니메이션 루프
    let raf;
    function animateLoop() {
      raf = requestAnimationFrame(animateLoop);
      renderer.render(scene, camera);
    }
    animateLoop();

    if (popKey > 0 && dollarPop) {
      createDollarMeshes(scene);
      animateDollars(scene, camera, renderer, popAnimFrameRef);
      setTimeout(() => {
        dollarMeshes.forEach(m => scene.remove(m));
        dollarMeshes = [];
        dollarAnims = [];
        if (popAnimFrameRef.current) cancelAnimationFrame(popAnimFrameRef.current);
      }, 1200);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (popAnimFrameRef.current) cancelAnimationFrame(popAnimFrameRef.current);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [src, step, scale, popKey, dollarPop, selectedEnv]);

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

  // $ 3D 애니메이션 트리거
  useEffect(() => {
    if (!dollarPop || !mountRef.current) return;
    setPopKey(k => k + 1); // popKey가 바뀌면 새로 생성
  }, [dollarPop]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
} 