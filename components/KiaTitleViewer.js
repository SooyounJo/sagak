import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function KiaTitleViewer() {
  const mountRef = useRef(null);
  const mixerRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    const width = 420;
    const height = 180;
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 3.2);
    camera.lookAt(0, 0.3, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 2, 2);
    scene.add(dirLight);

    // GLTF 모델 로드 및 애니메이션
    const loader = new GLTFLoader();
    loader.load('/3d/kia2.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0.3, 0);
      model.scale.set(1.6, 1.6, 1.6);
      scene.add(model);
      if (gltf.animations && gltf.animations.length > 0) {
        // const mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();
        // mixerRef.current = mixer;
      }
      renderer.render(scene, camera);
    });

    // 애니메이션 루프
    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (mixerRef.current) {
        mixerRef.current.update(clockRef.current.getDelta());
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 60,
        left: '50%',
        transform: 'translate(-50%, -20%)',
        zIndex: 25,
        width: 420,
        height: 180,
        pointerEvents: 'none',
      }}
    />
  );
} 