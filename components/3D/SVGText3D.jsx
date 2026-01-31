// components/3D/SVGText3D.jsx
import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function SVGText3D({ 
  text, 
  position = [0, 0, 0], 
  fontSize = 0.1, 
  color = '#FFFFFF',
  extrudeDepth = 0.01
}) {
  const mesh = useMemo(() => {
    // Create canvas to render text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size
    const padding = 20;
    canvas.width = text.length * fontSize * 100 + padding * 2;
    canvas.height = fontSize * 150 + padding * 2;
    
    // Clear canvas
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.font = `bold ${fontSize * 100}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create plane with texture
    const geometry = new THREE.PlaneGeometry(
      canvas.width / 1000, 
      canvas.height / 1000
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    return new THREE.Mesh(geometry, material);
  }, [text, fontSize, color]);
  
  return <primitive object={mesh} position={position} />;
}