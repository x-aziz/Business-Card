import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import Sa_logo from '../../assets/logo_SA.png';

export default function BusinessCard({ position }) {
  const cardRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [lifted, setLifted] = useState(false);

  // Load the logo texture
  const logoTexture = useLoader(THREE.TextureLoader, Sa_logo);
  
  // Configure texture for transparency
  useMemo(() => {
    if (logoTexture) {
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      // Enable transparency for PNG
      logoTexture.format = THREE.RGBAFormat;
    }
  }, [logoTexture]);

  useFrame((state) => {
    if (!cardRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    if (lifted) {
      cardRef.current.position.y = position[1] + 0.1 + Math.sin(time * 2) * 0.02;
      const mouse = state.mouse;
      cardRef.current.rotation.x = THREE.MathUtils.lerp(
        cardRef.current.rotation.x,
        mouse.y * 0.3,
        0.1
      );
      cardRef.current.rotation.y = THREE.MathUtils.lerp(
        cardRef.current.rotation.y,
        mouse.x * 0.5 + (flipped ? Math.PI : 0),
        0.1
      );
    } else {
      cardRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05;
      cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, 0, 0.1);
      cardRef.current.rotation.y = THREE.MathUtils.lerp(
        cardRef.current.rotation.y,
        flipped ? Math.PI : 0,
        0.1
      );
    }
  });

  const handleClick = () => {
    if (!lifted) {
      setLifted(true);
    } else {
      setFlipped(!flipped);
    }
  };

  return (
    <group
      ref={cardRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Glow effect */}
      <mesh>
        <boxGeometry args={[3.6, 2.1, 0.06]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={hovered ? 0.8 : 0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Main card */}
      <RoundedBox args={[3.5, 2.0, 0.05]} radius={0.1}>
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.8}
          roughness={0.2}
          emissive={hovered ? '#06B6D4' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </RoundedBox>

      {/* Front content */}
      {!flipped && (
        <group position={[0, 0, 0.03]}>
          {/* Logo Image - With proper transparency */}
          <mesh position={[-1.3, 0.6, 0]}>
            <planeGeometry args={[0.65, 0.65]} />
            <meshBasicMaterial 
              map={logoTexture} 
              transparent={true}
              alphaTest={0.1}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          
          
          
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.25}
            color="#FFFFFF"
            anchorX="center"
          >
            SAID ABDELAZIZ
          </Text>
          
          <Text
            position={[0, 0.05, 0]}
            fontSize={0.12}
            color="#94A3B8"
            anchorX="center"
          >
            Full-Stack Developer
          </Text>
          
          <Text
            position={[0, -0.25, 0]}
            fontSize={0.1}
            color="#A78BFA"
            anchorX="center"
            maxWidth={3}
          >
            MERN Stack • Laravel
            {"\n"}
            E-Commerce Specialist
          </Text>
          
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.09}
            color="#10B981"
            anchorX="center"
          >
            ✦ 98.5/100 Bootcamp Graduate
          </Text>
          
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.08}
            color={hovered ? "#22D3EE" : "#64748B"}
            anchorX="center"
          >
            {hovered ? "Click to Lift →" : "Hover to Explore →"}
          </Text>
        </group>
      )}

      {/* Back content */}
      {flipped && (
        <group position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
          <Text
            position={[0, 0.75, 0]}
            fontSize={0.18}
            color="#06B6D4"
            anchorX="center"
          >
            CONTACT
          </Text>
          
          <Text
            position={[0, 0.35, 0]}
            fontSize={0.08}
            color="#E2E8F0"
            anchorX="center"
          >
            📧 said.abd.el.aziz.cs@gmail.com
            {"\n"}
            📱 +213 669 085 027
            {"\n"}
            💼 linkedin.com/in/said-abdelaziz
            {"\n"}
            💻 github.com/x-aziz
            {"\n"}
            💻 abdelaziz-portfolio-vercel.vercel.app
          </Text>
          
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.14}
            color="#8B5CF6"
            anchorX="center"
          >
            SKILLS
          </Text>
          
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.075}
            color="#94A3B8"
            anchorX="center"
          >
            React • Node • Laravel • MongoDB
            {"\n"}
            JavaScript • Bootstrap • Tailwind
          </Text>
        </group>
      )}
    </group>
  );
}