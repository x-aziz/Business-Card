// hooks/useMouseTracking.js
import { useState, useCallback, useRef, useEffect } from 'react';

export const useMouseTracking = () => {
  const [mouseRotation, setMouseRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const smoothingRef = useRef({ x: 0, y: 0 });
  
  // Smoothing factor for rotation
  const SMOOTHING = 0.1;
  const MAX_ROTATION_X = Math.PI / 6; // 30 degrees
  const MAX_ROTATION_Y = Math.PI / 4; // 45 degrees
  
  const updateMousePosition = useCallback((mouse) => {
    // Store raw mouse position
    setMousePosition({ x: mouse.x, y: mouse.y });
    
    // Map mouse position to rotation angles with smoothing
    const targetRotationX = -mouse.y * MAX_ROTATION_X;
    const targetRotationY = mouse.x * MAX_ROTATION_Y;
    
    // Apply smoothing
    smoothingRef.current.x += (targetRotationX - smoothingRef.current.x) * SMOOTHING;
    smoothingRef.current.y += (targetRotationY - smoothingRef.current.y) * SMOOTHING;
    
    setMouseRotation({
      x: smoothingRef.current.x,
      y: smoothingRef.current.y,
    });
  }, []);
  
  // Reset rotation when mouse leaves
  const resetRotation = useCallback(() => {
    smoothingRef.current = { x: 0, y: 0 };
    setMouseRotation({ x: 0, y: 0 });
  }, []);
  
  return {
    mouseRotation,
    mousePosition,
    updateMousePosition,
    resetRotation,
  };
};