
import React from 'react';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import BusinessCard from './BusinessCard';
import Particles from './ParticleSystem';
import Lights from './Lights';

export default function Scene() {
  return (
    <>
      <Lights />
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <Environment preset="city" />
      
      <BusinessCard position={[0, 0, 0]} />
      <Particles count={200} />
      
      <OrbitControls
        target={[0, 0, 0]}
        enableZoom={true}
        enablePan={false}
        maxDistance={12}
        minDistance={3}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}