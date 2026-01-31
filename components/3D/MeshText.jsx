// components/3D/MeshText.jsx
import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function MeshText({ 
  text, 
  position = [0, 0, 0], 
  size = 0.1, 
  color = '#FFFFFF', 
  align = 'center' 
}) {
  const geometry = useMemo(() => {
    // Create text using basic shapes
    const group = new THREE.Group();
    
    // Simple character rendering using cubes
    const chars = text.toUpperCase();
    const charWidth = size * 0.6;
    const charHeight = size;
    const charSpacing = charWidth * 0.8;
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === ' ') continue;
      
      // Create a simple representation of each character
      const charGroup = new THREE.Group();
      
      if (char === 'S' || char === 'A') {
        // Create letter S or A with basic shapes
        const geometry = new THREE.BoxGeometry(charWidth, charHeight, size * 0.1);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        charGroup.add(mesh);
      } else {
        // For other letters, use a simple cube
        const geometry = new THREE.BoxGeometry(charWidth * 0.8, charHeight * 0.8, size * 0.1);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        charGroup.add(mesh);
      }
      
      charGroup.position.x = i * charSpacing - (chars.length * charSpacing) / 2;
      group.add(charGroup);
    }
    
    return group;
  }, [text, size, color]);
  
  return (
    <primitive 
      object={geometry} 
      position={position} 
    />
  );
}