import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lights() {
  const spotLightRef = useRef();
  const keyLightRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(time * 0.2) * 0.5 + 2;
      spotLightRef.current.position.z = Math.cos(time * 0.2) * 0.5 + 5;
    }
    
    if (keyLightRef.current) {
      const intensity = Math.sin(time * 0.5) * 0.2 + 1.3;
      keyLightRef.current.intensity = intensity;
    }
  });

  return (
    <>
      <spotLight
        ref={spotLightRef}
        position={[2, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        distance={20}
        castShadow
        color="#06B6D4"
      />
      
      <pointLight
        ref={keyLightRef}
        position={[-3, 3, 4]}
        intensity={1.5}
        distance={15}
        decay={2}
        color="#FFFFFF"
        castShadow
      />
      
      <pointLight
        position={[3, 2, -2]}
        intensity={0.8}
        distance={12}
        decay={2}
        color="#A78BFA"
      />
      
      <pointLight
        position={[0, 2, -4]}
        intensity={0.5}
        distance={10}
        decay={2}
        color="#22D3EE"
      />
      
      <pointLight
        position={[0, 1, 0]}
        intensity={0.3}
        distance={5}
        decay={2}
        color="#06B6D4"
      />
      
      <ambientLight intensity={0.4} color="#334155" />
      
      <hemisphereLight
        args={['#06B6D4', '#8B5CF6', 0.2]}
        position={[0, 10, 0]}
      />
    </>
  );
}