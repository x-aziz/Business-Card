import { useState, useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useCardInteraction = () => {
  const [cardState, setCardState] = useState('idle');
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 1.5, z: 0 });  // Changed from 1.2 to 1.5
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0, z: 0 });
  const [cardScale, setCardScale] = useState(1);
  
  const animationRef = useRef(null);
  const mouseTrackingRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  // Card physics constants
  const PHYSICS = {
    LIFT_HEIGHT: 2.8,        // Raised from 2.5
    IDLE_HEIGHT: 1.5,        // Raised from 1.2
    LIFT_DURATION: 800,
    FLIP_DURATION: 1200,
    RETURN_DURATION: 600,
    HOVER_SCALE: 1.02,
    LIFT_SCALE: 1.1,
    MAX_TILT_X: Math.PI / 6, // 30 degrees
    MAX_TILT_Y: Math.PI / 4, // 45 degrees
    ROTATION_SMOOTHING: 0.1,
    BOUNCE_FACTOR: 0.8,
    GRAVITY: 0.002,
  };

  // Initialize event listeners
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
      mouseTrackingRef.current = { x, y };
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case ' ':
        case 'Spacebar':
          event.preventDefault();
          if (cardState === 'lifted') flipCard();
          break;
        case 'Escape':
          if (cardState !== 'idle') returnToStand();
          break;
        case 'f':
        case 'F':
          if (cardState === 'lifted') flipCard();
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey) {
            event.preventDefault();
            resetCard();
          }
          break;
      }
    };

    const handleClickOutside = (event) => {
      // If card is lifted and user clicks outside, return to stand
      if (cardState === 'lifted' && !event.target.closest('.card-interaction-area')) {
        returnToStand();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [cardState]);

  // Animation loop
  useEffect(() => {
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }

    function animate() {
      updateCardPhysics();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [cardState, isFlipped]);

  const updateCardPhysics = useCallback(() => {
    if (cardState === 'lifted') {
      // Apply mouse-based rotation with smoothing
      const targetRotationY = mouseTrackingRef.current.x * PHYSICS.MAX_TILT_Y;
      const targetRotationX = mouseTrackingRef.current.y * PHYSICS.MAX_TILT_X;

      setCardRotation(prev => ({
        x: THREE.MathUtils.lerp(prev.x, targetRotationX, PHYSICS.ROTATION_SMOOTHING),
        y: THREE.MathUtils.lerp(prev.y, targetRotationY, PHYSICS.ROTATION_SMOOTHING),
        z: THREE.MathUtils.lerp(prev.z, 0, PHYSICS.ROTATION_SMOOTHING * 2),
      }));

      // Gentle floating motion
      const time = Date.now() * 0.001;
      const floatOffset = Math.sin(time * 2) * 0.02;
      setCardPosition(prev => ({
        ...prev,
        y: PHYSICS.LIFT_HEIGHT + floatOffset,
      }));
    } else if (cardState === 'idle' || cardState === 'hovered') {
      // Idle floating animation
      const time = Date.now() * 0.001;
      const floatOffset = Math.sin(time * 0.5) * 0.05;
      const hoverScale = cardState === 'hovered' ? PHYSICS.HOVER_SCALE : 1;
      
      setCardPosition(prev => ({
        ...prev,
        y: PHYSICS.IDLE_HEIGHT + floatOffset,
      }));
      setCardScale(hoverScale);
    }
  }, [cardState]);

  const liftCard = useCallback(() => {
    if (cardState === 'idle' || cardState === 'hovered') {
      setCardState('lifted');
      
      // Animate lift
      const startTime = Date.now();
      const startY = cardPosition.y;
      const startScale = cardScale;
      
      const liftAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / PHYSICS.LIFT_DURATION, 1);
        
        // Easing function for bounce effect
        const easeOutBounce = (x) => {
          const n1 = 7.5625;
          const d1 = 2.75;
          
          if (x < 1 / d1) {
            return n1 * x * x;
          } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
          } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
          } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
          }
        };
        
        const easedProgress = easeOutBounce(progress);
        
        // Animate position
        const newY = startY + (PHYSICS.LIFT_HEIGHT - startY) * easedProgress;
        const newScale = startScale + (PHYSICS.LIFT_SCALE - startScale) * easedProgress;
        
        setCardPosition(prev => ({ ...prev, y: newY }));
        setCardScale(newScale);
        
        // Animate slight forward tilt during lift
        if (progress < 0.5) {
          const tiltProgress = progress * 2;
          setCardRotation(prev => ({ ...prev, x: -0.2 * tiltProgress }));
        } else {
          const untiltProgress = (progress - 0.5) * 2;
          setCardRotation(prev => ({ ...prev, x: -0.2 * (1 - untiltProgress) }));
        }
        
        if (progress < 1) {
          requestAnimationFrame(liftAnimation);
        }
      };
      
      requestAnimationFrame(liftAnimation);
      
      // Dispatch custom event for audio/visual effects
      window.dispatchEvent(new CustomEvent('card-lifted'));
    }
  }, [cardState, cardPosition.y, cardScale]);

  const flipCard = useCallback(() => {
    if (cardState === 'lifted') {
      setCardState('rotating');
      
      const startTime = Date.now();
      const startRotationY = cardRotation.y;
      const targetRotationY = startRotationY + (isFlipped ? 0 : Math.PI);
      
      const flipAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / PHYSICS.FLIP_DURATION, 1);
        
        // Easing function for smooth flip
        const easeInOutCubic = (x) => {
          return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        };
        
        const easedProgress = easeInOutCubic(progress);
        
        // Apply flip rotation
        const newRotationY = startRotationY + (targetRotationY - startRotationY) * easedProgress;
        setCardRotation(prev => ({ ...prev, y: newRotationY }));
        
        // Add slight wobble effect at 50% rotation
        if (Math.abs(progress - 0.5) < 0.1) {
          const wobble = Math.sin(progress * Math.PI * 4) * 0.05;
          setCardRotation(prev => ({ ...prev, x: wobble, z: wobble * 0.5 }));
        }
        
        if (progress < 1) {
          requestAnimationFrame(flipAnimation);
        } else {
          setIsFlipped(!isFlipped);
          setCardState('lifted');
          // Reset wobble
          setCardRotation(prev => ({ ...prev, x: 0, z: 0 }));
          
          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('card-flipped', {
            detail: { isFlipped: !isFlipped }
          }));
        }
      };
      
      requestAnimationFrame(flipAnimation);
    }
  }, [cardState, isFlipped, cardRotation.y]);

  const returnToStand = useCallback(() => {
    if (cardState === 'lifted' || cardState === 'rotating') {
      setCardState('returning');
      
      const startTime = Date.now();
      const startY = cardPosition.y;
      const startRotation = { ...cardRotation };
      const startScale = cardScale;
      
      const returnAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / PHYSICS.RETURN_DURATION, 1);
        
        // Easing function for smooth return
        const easeOutCubic = (x) => {
          return 1 - Math.pow(1 - x, 3);
        };
        
        const easedProgress = easeOutCubic(progress);
        
        // Animate position back to stand
        const newY = startY + (PHYSICS.IDLE_HEIGHT - startY) * easedProgress;
        setCardPosition(prev => ({ ...prev, y: newY }));
        
        // Animate scale back to normal
        const newScale = startScale + (1 - startScale) * easedProgress;
        setCardScale(newScale);
        
        // Animate rotation back to zero
        setCardRotation({
          x: startRotation.x * (1 - easedProgress),
          y: startRotation.y * (1 - easedProgress),
          z: startRotation.z * (1 - easedProgress),
        });
        
        if (progress < 1) {
          requestAnimationFrame(returnAnimation);
        } else {
          setCardState('idle');
          setIsFlipped(false);
          setCardRotation({ x: 0, y: 0, z: 0 });
          setCardScale(1);
          
          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('card-returned'));
        }
      };
      
      requestAnimationFrame(returnAnimation);
    }
  }, [cardState, cardPosition.y, cardScale, cardRotation]);

  const resetCard = useCallback(() => {
    setCardState('idle');
    setIsFlipped(false);
    setCardPosition({ x: 0, y: PHYSICS.IDLE_HEIGHT, z: 0 });
    setCardRotation({ x: 0, y: 0, z: 0 });
    setCardScale(1);
    
    // Dispatch reset event
    window.dispatchEvent(new CustomEvent('card-reset'));
  }, []);

  const setHovered = useCallback(() => {
    if (cardState === 'idle') {
      setCardState('hovered');
      window.dispatchEvent(new CustomEvent('card-hovered'));
    }
  }, [cardState]);

  const setUnhovered = useCallback(() => {
    if (cardState === 'hovered') {
      setCardState('idle');
    }
  }, [cardState]);

  // Gesture detection for special interactions
  const detectGesture = useCallback((startPos, endPos) => {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 100) { // Minimum gesture distance
      // Detect circle gesture
      const angle = Math.atan2(dy, dx);
      // Simple circle detection (would need more sophisticated algorithm for production)
      
      // For now, trigger special effect on large diagonal swipe
      if (Math.abs(dx) > 50 && Math.abs(dy) > 50) {
        window.dispatchEvent(new CustomEvent('gesture-detected', {
          detail: { type: 'diagonal-swipe' }
        }));
        return true;
      }
    }
    return false;
  }, []);

  // Get card transform values for 3D rendering
  const getCardTransform = useCallback(() => ({
    position: [cardPosition.x, cardPosition.y, cardPosition.z],
    rotation: [cardRotation.x, cardRotation.y, cardRotation.z],
    scale: cardScale,
  }), [cardPosition, cardRotation, cardScale]);

  return {
    // State
    cardState,
    isFlipped,
    mousePosition,
    cardPosition,
    cardRotation,
    cardScale,
    
    // Actions
    liftCard,
    flipCard,
    returnToStand,
    resetCard,
    setHovered,
    setUnhovered,
    detectGesture,
    
    // Transform getter
    getCardTransform,
    
    // Constants
    PHYSICS,
  };
};