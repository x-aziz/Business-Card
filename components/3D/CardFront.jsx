import React from 'react';
import { Text, Float } from '@react-three/drei';

export default function CardFront({ width, height, hovered, depth = 0.05 }) {
  // NO font properties specified - Three.js will use its default
  return (
    <group>
      {/* Personal brand mark */}
      <Text
        position={[-width * 0.35, height * 0.35, depth * 0.51]}
        fontSize={0.2}
        color="#06B6D4"
        // NO font property
        anchorX="left"
        anchorY="top"
      >
        {"<SA/>"}
      </Text>
      
      {/* Name */}
      <Text
        position={[0, height * 0.15, depth * 0.51]}
        fontSize={0.25}
        color="#FFFFFF"
        // NO font property
        anchorX="center"
        anchorY="middle"
      >
        SAID ABDELAZIZ
      </Text>
      
      {/* Title */}
      <Text
        position={[0, height * 0.02, depth * 0.51]}
        fontSize={0.12}
        color="#94A3B8"
        // NO font property
        anchorX="center"
        anchorY="middle"
      >
        Full-Stack Developer
      </Text>
      
      {/* Specializations */}
      <Text
        position={[0, -height * 0.15, depth * 0.51]}
        fontSize={0.1}
        color="#A78BFA"
        // NO font property
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.9}
      >
        MERN Stack • Laravel
        {"\n"}
        E-Commerce Specialist
      </Text>
      
      {/* Achievement badge */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Text
          position={[0, -height * 0.3, depth * 0.51]}
          fontSize={0.09}
          color="#10B981"
          // NO font property
          anchorX="center"
          anchorY="middle"
        >
          ✦ 98.5/100 Bootcamp Graduate
        </Text>
      </Float>
      
      {/* Interactive hint */}
      <Text
        position={[0, -height * 0.38, depth * 0.51]}
        fontSize={0.08}
        color={hovered ? "#22D3EE" : "#64748B"}
        // NO font property
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? "Click to Lift →" : "Hover to Explore →"}
      </Text>
    </group>
  );
}