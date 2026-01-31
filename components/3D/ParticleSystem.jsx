// components/3D/ParticleSystem.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ count = 200 }) {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() * 0.01;
      const x = Math.cos(time) * factor;
      const y = Math.sin(time) * factor;
      const z = Math.sin(time) * factor;
      
      temp.push({
        position: [x, y, z],
        scale: Math.random() * 0.5 + 0.5,
        color: new THREE.Color().setHSL(
          Math.random() * 0.2 + 0.4,
          0.8,
          Math.random() * 0.2 + 0.5
        ),
        speed,
        factor,
        time,
        mx: Math.random() - 0.5,
        my: Math.random() - 0.5,
      });
    }
    return temp;
  }, [count]);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    particles.forEach((particle, i) => {
      let { factor, speed, time, mx, my } = particle;
      
      time = state.clock.getElapsedTime() * speed;
      
      // Create gentle floating motion
      const x = Math.cos(time) * factor + mx;
      const y = Math.sin(time) * factor + my;
      const z = Math.sin(time) * factor;
      
      // Update particle position
      particlesRef.current.setMatrixAt(i, 
        new THREE.Matrix4().compose(
          new THREE.Vector3(x, y, z),
          new THREE.Quaternion(),
          new THREE.Vector3(particle.scale, particle.scale, particle.scale)
        )
      );
    });
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={particlesRef} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial
        color="#06B6D4"
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}