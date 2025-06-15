import * as THREE from 'three';
import { useEffect } from 'react';

export default function Lighting({ scene, camera, spotTargetRef }) {
  useEffect(() => {
    if (!scene) return;
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    // SpotLight
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(camera?.lookAt?.x || 0, camera?.lookAt?.y || 0, camera?.lookAt?.z || 0);
    scene.add(spotTarget);
    if (spotTargetRef) spotTargetRef.current = spotTarget;
    const spotLight = new THREE.SpotLight(0xffffff, 10, 30, Math.PI / 6, 0.2, 1);
    spotLight.position.set(0, 2, 6);
    spotLight.target = spotTarget;
    spotLight.castShadow = true;
    scene.add(spotLight);
    // Back Light
    const backLight = new THREE.DirectionalLight(0xfff2cc, 1);
    backLight.position.set(0, 2, -6);
    scene.add(backLight);
    return () => {
      scene.remove(ambientLight);
      scene.remove(spotLight);
      scene.remove(spotTarget);
      scene.remove(backLight);
    };
  }, [scene]);
  return null;
} 