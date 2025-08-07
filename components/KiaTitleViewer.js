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
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    // 픽셀 비율 제한으로 성능 향상
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 3.5);
    dirLight.position.set(2, 4, 6);
    scene.add(dirLight);

    // 환경맵(간단한 흰색 큐브맵)
    const envMap = new THREE.CubeTextureLoader().load([
      '/2d/11.png', '/2d/11.png', '/2d/22.png', '/2d/22.png', '/2d/33.png', '/2d/33.png'
    ]);
    envMap.colorSpace = THREE.SRGBColorSpace;
    scene.environment = envMap;

    // GLTF 모델 로드 및 애니메이션
    const loader = new GLTFLoader();
    loader.load('/3d/kia2.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0.3, 0);
      model.scale.set(1.6, 1.6, 1.6);
      // 모든 메쉬를 초록색 플라스틱(매끈) 머티리얼로 교체
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#39ff14'), // 네온 초록
            metalness: 0.7,
            roughness: 0.03,
            ior: 1.5,
            transmission: 1,
            specularIntensity: 1.2,
            specularColor: new THREE.Color(0xffffff),
            thickness: 1.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.01,
            reflectivity: 1.0,
            envMap: envMap,
            envMapIntensity: 2,
            transparent: true,
            emissive: new THREE.Color('#39ff14'),
            emissiveIntensity: 0.5,
          });
        }
      });
      scene.add(model);
      if (gltf.animations && gltf.animations.length > 0) {
        // const mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();
        // mixerRef.current = mixer;
      }
      renderer.render(scene, camera);
    });

    // 애니메이션 루프 - 최적화
    let raf;
    let lastRenderTime = 0;
    const renderInterval = 1000 / 30; // 30fps로 제한
    
    function animate(now) {
      raf = requestAnimationFrame(animate);
      
      // 렌더링 빈도 제한
      if (now - lastRenderTime < renderInterval) {
        return;
      }
      
      if (mixerRef.current) {
        mixerRef.current.update(clockRef.current.getDelta());
      }
      renderer.render(scene, camera);
      lastRenderTime = now;
    }
    animate(0);

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