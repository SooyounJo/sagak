import { useEffect } from 'react';

export default function CameraController({ cameraRef, springProps, spotTargetRef, rendererRef, sceneRef }) {
  useEffect(() => {
    let raf;
    function animate() {
      if (!cameraRef.current || !rendererRef.current || !sceneRef.current || !spotTargetRef.current) return;
      cameraRef.current.position.set(springProps.camX.get(), springProps.camY.get(), springProps.camZ.get());
      cameraRef.current.lookAt(springProps.lookX.get(), springProps.lookY.get(), springProps.lookZ.get());
      spotTargetRef.current.position.set(springProps.lookX.get(), springProps.lookY.get(), springProps.lookZ.get());
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => raf && cancelAnimationFrame(raf);
  }, [springProps]);
  return null;
} 