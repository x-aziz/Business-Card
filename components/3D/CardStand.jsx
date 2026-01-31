import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function CardStand({ position }) {
  const standRef = useRef();
  const baseWidth = 4;
  const baseDepth = 2.5;
  const baseHeight = 0.3;
  const supportWidth = 0.5;
  const supportHeight = 2;
  const angle = 75 * (Math.PI / 180);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (standRef.current) {
      standRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.02;
    }
  });

  return (
    <group ref={standRef} position={position}>
      {/* Base */}
      <group position={[0, baseHeight / 2, 0]}>
        <RoundedBox args={[baseWidth, baseHeight, baseDepth]} radius={0.1}>
          <meshStandardMaterial
            color="#374151"
            metalness={0.7}
            roughness={0.3}
          />
        </RoundedBox>

        {/* LED strip */}
        <mesh position={[0, baseHeight / 2 + 0.01, 0]}>
          <boxGeometry args={[baseWidth + 0.1, 0.02, baseDepth + 0.1]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#06B6D4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Support arm */}
      <group position={[0, baseHeight + supportHeight / 2 * Math.sin(angle), 0]}>
        <mesh rotation={[angle, 0, 0]}>
          <boxGeometry args={[supportWidth, supportHeight, supportWidth * 0.6]} />
          <meshStandardMaterial
            color="#4B5563"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Card slot */}
        <mesh 
          position={[
            0, 
            supportHeight / 2 * Math.sin(angle) + 0.1, 
            -supportHeight / 2 * Math.cos(angle)
          ]} 
          rotation={[angle, 0, 0]}
        >
          <boxGeometry args={[3.7, 0.2, 0.15]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#06B6D4"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Shadow */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[baseWidth / 1.5, 32]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}