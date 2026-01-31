import { useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';

export const useParticleSystem = (maxParticles = 1000) => {
  const particlesRef = useRef([]);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const positionsRef = useRef(null);
  const colorsRef = useRef(null);
  const sizesRef = useRef(null);
  
  // Particle types configuration
  const PARTICLE_TYPES = useMemo(() => ({
    AMBIENT: {
      count: 300,
      size: 0.02,
      speed: 0.01,
      color: new THREE.Color(0x06B6D4),
      opacity: 0.3,
      shape: 'code', // code symbols
      lifetime: 10000,
    },
    AURA: {
      count: 80,
      size: 0.015,
      speed: 0.02,
      color: new THREE.Color(0x22D3EE),
      opacity: 0.7,
      shape: 'sphere',
      lifetime: 5000,
      followCard: true,
    },
    BURST: {
      count: 50,
      size: 0.03,
      speed: 0.05,
      color: new THREE.Color(0x8B5CF6),
      opacity: 1,
      shape: 'sparkle',
      lifetime: 1500,
    },
    TEXT: {
      count: 20,
      size: 0.1,
      speed: 0.005,
      color: new THREE.Color(0xFFFFFF),
      opacity: 0.8,
      shape: 'text',
      lifetime: 8000,
      text: ['React', 'Node', 'Laravel', 'MongoDB', 'JavaScript'],
    }
  }), []);

  // Initialize particle system
  const initialize = useCallback(() => {
    particlesRef.current = [];
    
    // Create buffers for instanced rendering
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    
    positionsRef.current = positions;
    colorsRef.current = colors;
    sizesRef.current = sizes;
    
    // Create ambient particles
    spawnParticles('AMBIENT', PARTICLE_TYPES.AMBIENT.count);
    
    return { positions, colors, sizes, maxParticles };
  }, [maxParticles, PARTICLE_TYPES]);

  // Spawn new particles
  const spawnParticles = useCallback((type, count, position = null, velocity = null) => {
    const config = PARTICLE_TYPES[type];
    if (!config) return;
    
    for (let i = 0; i < count; i++) {
      const particle = createParticle(config, position, velocity);
      particlesRef.current.push(particle);
      
      // If we exceed max particles, remove oldest
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current.shift();
      }
    }
    
    updateBuffers();
  }, [PARTICLE_TYPES, maxParticles]);

  // Create single particle
  const createParticle = useCallback((config, spawnPosition = null, spawnVelocity = null) => {
    const position = spawnPosition || new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 20
    );
    
    const velocity = spawnVelocity || new THREE.Vector3(
      (Math.random() - 0.5) * config.speed,
      (Math.random() - 0.5) * config.speed,
      (Math.random() - 0.5) * config.speed
    );
    
    const color = config.color.clone();
    if (Math.random() > 0.7) {
      // Occasionally vary color
      color.offsetHSL(Math.random() * 0.2 - 0.1, 0, 0);
    }
    
    return {
      position,
      velocity,
      color,
      size: config.size * (0.8 + Math.random() * 0.4),
      opacity: config.opacity,
      lifetime: config.lifetime,
      maxLifetime: config.lifetime,
      type: config.shape,
      followCard: config.followCard || false,
      text: config.text ? config.text[Math.floor(Math.random() * config.text.length)] : null,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    };
  }, []);

  // Update all particles
  const updateParticles = useCallback((deltaTime, cardPosition = null, cardState = 'idle') => {
    const now = Date.now();
    
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const particle = particlesRef.current[i];
      
      // Update lifetime
      particle.lifetime -= deltaTime * 1000;
      
      // Remove dead particles
      if (particle.lifetime <= 0) {
        particlesRef.current.splice(i, 1);
        continue;
      }
      
      // Calculate age factor (0 = just born, 1 = about to die)
      const ageFactor = 1 - (particle.lifetime / particle.maxLifetime);
      
      // Update opacity based on age
      if (ageFactor > 0.8) {
        particle.opacity = particle.opacity * (1 - (ageFactor - 0.8) * 5);
      }
      
      // Update position based on velocity
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime * 60));
      
      // Update rotation
      particle.rotation += particle.rotationSpeed * deltaTime * 60;
      
      // Add drift to ambient particles
      if (particle.type === 'code') {
        particle.velocity.y += Math.sin(now * 0.001 + i) * 0.0001;
      }
      
      // Aura particles follow card
      if (particle.followCard && cardPosition && cardState === 'lifted') {
        const toCard = new THREE.Vector3().subVectors(cardPosition, particle.position);
        const distance = toCard.length();
        
        if (distance > 2) {
          toCard.normalize().multiplyScalar(0.02 * deltaTime * 60);
          particle.velocity.lerp(toCard, 0.1);
        } else if (distance < 1) {
          // Orbit card
          const orbitForce = new THREE.Vector3(-toCard.z, 0, toCard.x).normalize().multiplyScalar(0.01);
          particle.velocity.add(orbitForce);
        }
      }
      
      // Apply boundaries
      const boundary = 25;
      if (particle.position.length() > boundary) {
        const direction = particle.position.clone().normalize();
        particle.velocity.reflect(direction).multiplyScalar(0.9);
      }
      
      // Apply damping
      particle.velocity.multiplyScalar(0.99);
    }
    
    updateBuffers();
    
    return particlesRef.current.length;
  }, []);

  // Update GPU buffers
  const updateBuffers = useCallback(() => {
    if (!positionsRef.current || !colorsRef.current || !sizesRef.current) return;
    
    for (let i = 0; i < particlesRef.current.length; i++) {
      const particle = particlesRef.current[i];
      const idx = i * 3;
      
      // Position
      positionsRef.current[idx] = particle.position.x;
      positionsRef.current[idx + 1] = particle.position.y;
      positionsRef.current[idx + 2] = particle.position.z;
      
      // Color
      colorsRef.current[idx] = particle.color.r;
      colorsRef.current[idx + 1] = particle.color.g;
      colorsRef.current[idx + 2] = particle.color.b;
      
      // Size
      sizesRef.current[i] = particle.size;
    }
    
    // Mark buffers as needing update
    if (geometryRef.current) {
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
      geometryRef.current.attributes.size.needsUpdate = true;
    }
  }, []);

  // Create burst effect
  const createBurst = useCallback((position, type = 'BURST', count = null) => {
    const config = PARTICLE_TYPES[type];
    const burstCount = count || config.count;
    
    for (let i = 0; i < burstCount; i++) {
      // Random direction with outward bias
      const angle = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = config.speed * (0.5 + Math.random() * 0.5);
      
      const velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(angle) * speed,
        Math.sin(phi) * Math.sin(angle) * speed,
        Math.cos(phi) * speed
      );
      
      spawnParticles(type, 1, position.clone(), velocity);
    }
    
    // Play burst sound if available
    window.dispatchEvent(new CustomEvent('particle-burst', {
      detail: { position, type, count: burstCount }
    }));
  }, [PARTICLE_TYPES, spawnParticles]);

  // Create trail effect
  const createTrail = useCallback((startPos, endPos, particleCount = 20) => {
    const direction = new THREE.Vector3().subVectors(endPos, startPos);
    const step = direction.clone().divideScalar(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const position = startPos.clone().add(step.clone().multiplyScalar(i));
      const velocity = direction.clone().normalize().multiplyScalar(0.01);
      
      const trailParticle = createParticle(
        { ...PARTICLE_TYPES.AURA, lifetime: 1000, size: 0.01 },
        position,
        velocity
      );
      
      particlesRef.current.push(trailParticle);
    }
    
    updateBuffers();
  }, [PARTICLE_TYPES, createParticle, updateBuffers]);

  // Create text particles
  const createTextParticles = useCallback((textArray, centerPosition) => {
    const radius = 3;
    const angleStep = (Math.PI * 2) / textArray.length;
    
    textArray.forEach((text, index) => {
      const angle = angleStep * index;
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * 0.5,
        Math.sin(angle) * radius
      ).add(centerPosition);
      
      const particle = {
        position,
        velocity: new THREE.Vector3(0, 0.001, 0),
        color: new THREE.Color(0xFFFFFF),
        size: 0.2,
        opacity: 0.8,
        lifetime: 10000,
        maxLifetime: 10000,
        type: 'text',
        text,
        rotation: angle,
        rotationSpeed: 0.005,
      };
      
      particlesRef.current.push(particle);
    });
    
    updateBuffers();
  }, [updateBuffers]);

  // Clear all particles
  const clearParticles = useCallback(() => {
    particlesRef.current = [];
    updateBuffers();
  }, [updateBuffers]);

  // Get particle count by type
  const getParticleCounts = useCallback(() => {
    const counts = {
      total: particlesRef.current.length,
      byType: {}
    };
    
    particlesRef.current.forEach(particle => {
      counts.byType[particle.type] = (counts.byType[particle.type] || 0) + 1;
    });
    
    return counts;
  }, []);

  // Set geometry reference for buffer updates
  const setGeometry = useCallback((geometry) => {
    geometryRef.current = geometry;
  }, []);

  // Set material reference
  const setMaterial = useCallback((material) => {
    materialRef.current = material;
  }, []);

  return {
    // State
    particles: particlesRef.current,
    positions: positionsRef.current,
    colors: colorsRef.current,
    sizes: sizesRef.current,
    
    // Methods
    initialize,
    updateParticles,
    spawnParticles,
    createBurst,
    createTrail,
    createTextParticles,
    clearParticles,
    getParticleCounts,
    
    // Refs
    setGeometry,
    setMaterial,
    
    // Constants
    PARTICLE_TYPES,
    maxParticles,
  };
};