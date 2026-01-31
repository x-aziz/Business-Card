// hooks/useCardPhysics.js
import { useRef, useCallback } from 'react';
import * as THREE from 'three';

export const useCardPhysics = () => {
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const angularVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const positionRef = useRef(new THREE.Vector3(0, 1.5, 0));
  const rotationRef = useRef(new THREE.Euler(0, 0, 0));
  const targetRef = useRef({
    position: new THREE.Vector3(0, 1.5, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: 1,
  });

  // Physics constants
  const PHYSICS = {
    GRAVITY: 0.0005,
    FRICTION: 0.95,
    ANGULAR_DAMPING: 0.98,
    SPRING_STIFFNESS: 0.1,
    SPRING_DAMPING: 0.8,
    MAX_VELOCITY: 0.1,
    MAX_ANGULAR_VELOCITY: 0.05,
    BOUNCE_DAMPING: 0.7,
    IDLE_HEIGHT: 1.5,
  };

  // Update physics simulation
  const updatePhysics = useCallback((deltaTime, cardState, isLifted) => {
    if (!positionRef.current || !rotationRef.current) return;

    const velocity = velocityRef.current;
    const angularVelocity = angularVelocityRef.current;
    const position = positionRef.current;
    const rotation = rotationRef.current;
    const target = targetRef.current;

    if (isLifted) {
      // When lifted, card follows target with spring physics
      const positionDiff = new THREE.Vector3()
        .subVectors(target.position, position);
      
      const springForce = positionDiff.multiplyScalar(PHYSICS.SPRING_STIFFNESS);
      const dampingForce = velocity.clone().multiplyScalar(-PHYSICS.SPRING_DAMPING);
      
      velocity.add(springForce).add(dampingForce);
      
      // Angular spring for rotation
      const rotationDiff = {
        x: target.rotation.x - rotation.x,
        y: target.rotation.y - rotation.y,
        z: target.rotation.z - rotation.z,
      };
      
      const angularSpring = new THREE.Vector3(
        rotationDiff.x * PHYSICS.SPRING_STIFFNESS,
        rotationDiff.y * PHYSICS.SPRING_STIFFNESS,
        rotationDiff.z * PHYSICS.SPRING_STIFFNESS
      );
      
      const angularDamping = angularVelocity.clone().multiplyScalar(-PHYSICS.SPRING_DAMPING);
      angularVelocity.add(angularSpring).add(angularDamping);
    } else {
      // When not lifted, apply gravity and friction
      velocity.y -= PHYSICS.GRAVITY * deltaTime;
      velocity.multiplyScalar(PHYSICS.FRICTION);
      angularVelocity.multiplyScalar(PHYSICS.ANGULAR_DAMPING);
      
      // Ground collision
      if (position.y < PHYSICS.IDLE_HEIGHT && velocity.y < 0) {
        position.y = PHYSICS.IDLE_HEIGHT;
        velocity.y = -velocity.y * PHYSICS.BOUNCE_DAMPING;
        
        // Add slight angular velocity on bounce
        if (Math.abs(velocity.y) > 0.01) {
          angularVelocity.x = (Math.random() - 0.5) * 0.02;
          angularVelocity.z = (Math.random() - 0.5) * 0.02;
        }
      }
    }

    // Clamp velocities
    if (velocity.length() > PHYSICS.MAX_VELOCITY) {
      velocity.normalize().multiplyScalar(PHYSICS.MAX_VELOCITY);
    }
    if (angularVelocity.length() > PHYSICS.MAX_ANGULAR_VELOCITY) {
      angularVelocity.normalize().multiplyScalar(PHYSICS.MAX_ANGULAR_VELOCITY);
    }

    // Apply velocities
    position.add(velocity.clone().multiplyScalar(deltaTime));
    rotation.x += angularVelocity.x * deltaTime;
    rotation.y += angularVelocity.y * deltaTime;
    rotation.z += angularVelocity.z * deltaTime;

    return {
      position: position.clone(),
      rotation: rotation.clone(),
      velocity: velocity.clone(),
      angularVelocity: angularVelocity.clone(),
    };
  }, []);

  // Set target position for spring
  const setTarget = useCallback((position, rotation, scale = 1) => {
    if (position) {
      targetRef.current.position.copy(position);
    }
    if (rotation) {
      targetRef.current.rotation.copy(rotation);
    }
    targetRef.current.scale = scale;
  }, []);

  // Apply impulse force
  const applyImpulse = useCallback((force, torque = null) => {
    velocityRef.current.add(force);
    if (torque) {
      angularVelocityRef.current.add(torque);
    }
  }, []);

  // Reset physics
  const reset = useCallback(() => {
    velocityRef.current.set(0, 0, 0);
    angularVelocityRef.current.set(0, 0, 0);
    positionRef.current.set(0, PHYSICS.IDLE_HEIGHT, 0);
    rotationRef.current.set(0, 0, 0);
  }, []);

  return {
    updatePhysics,
    setTarget,
    applyImpulse,
    reset,
    getPosition: () => positionRef.current.clone(),
    getRotation: () => rotationRef.current.clone(),
    getVelocity: () => velocityRef.current.clone(),
    PHYSICS,
  };
};