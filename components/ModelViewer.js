import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

export default function ModelViewer({ scene, camera, colorIdx, COLOR_SETS, originalColors, applyColor, modelRef }) {
  useEffect(() => {
    if (!scene || !camera) return;
    const loader = new GLTFLoader();
    loader.load('/3d/kikiki.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -1.2, 0);
      model.scale.set(1.1, 1.1, 1.1);
      scene.add(model);
      modelRef.current = model;
      // 원래색 저장
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          originalColors.current[child.uuid] = child.material.color.clone();
        }
      });
      camera.position.set(2.2, -1.2, 1.9);
      camera.lookAt(0.7, -1.1, 0.4);
      if (applyColor) applyColor(colorIdx);
    });
    return () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }
    };
  }, [scene, camera]);
  return null;
} 