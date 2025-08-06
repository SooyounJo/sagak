import { useEffect } from 'react';

export default function CameraController({ cameraRef, springProps, spotTargetRef, rendererRef, sceneRef }) {
  useEffect(() => {
    let raf;
    let lastRenderTime = 0;
    const renderInterval = 1000 / 30; // 30fps로 제한
    
    function animate(now) {
      if (!cameraRef.current || !rendererRef.current || !sceneRef.current || !spotTargetRef.current) {
        raf = requestAnimationFrame(animate);
        return;
      }
      
      // 렌더링 빈도 제한
      if (now - lastRenderTime < renderInterval) {
        raf = requestAnimationFrame(animate);
        return;
      }
      
      cameraRef.current.position.set(springProps.camX.get(), springProps.camY.get(), springProps.camZ.get());
      cameraRef.current.lookAt(springProps.lookX.get(), springProps.lookY.get(), springProps.lookZ.get());
      spotTargetRef.current.position.set(springProps.lookX.get(), springProps.lookY.get(), springProps.lookZ.get());
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      lastRenderTime = now;
      raf = requestAnimationFrame(animate);
    }
    animate(0);
    return () => raf && cancelAnimationFrame(raf);
  }, [springProps]);
  return null;
} 