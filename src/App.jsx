import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/3D/Scene';
import LoadingScreen from '../components/UI/LoadingScreen';
import OverlayUI from '../components/UI/OverlayUI';
import '../styles/globals.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 6], fov: 50 }}
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: 'high-performance',
              preserveDrawingBuffer: true
            }}
            style={{ touchAction: 'none' }}
          >
            <color attach="background" args={['#0F172A']} />
            <fog attach="fog" args={['#0F172A', 5, 15]} />
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
          <OverlayUI />
        </>
      )}
    </div>
  );
}