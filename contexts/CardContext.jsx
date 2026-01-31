import React, { createContext, useContext, useReducer, useCallback } from 'react';
import * as THREE from 'three';

// Initial state
const initialState = {
  // Card state
  cardState: 'idle', // idle, hovered, lifted, rotating, focused, returning
  isFlipped: false,
  cardPosition: new THREE.Vector3(0, 1.2, 0),
  cardRotation: new THREE.Euler(0, 0, 0),
  cardScale: 1,
  
  // Interaction state
  mousePosition: { x: 0, y: 0 },
  isDragging: false,
  dragStart: null,
  
  // UI state
  showControls: false,
  showStats: true,
  showTooltips: true,
  autoRotate: false,
  soundEnabled: true,
  theme: 'dark',
  
  // Performance
  fps: 60,
  particleCount: 300,
  quality: 'high',
  
  // Analytics
  interactionCount: 0,
  sessionStart: Date.now(),
  currentSessionTime: 0,
  
  // Special features
  unlockedAchievements: [],
  detectedGestures: [],
  lastInteraction: null,
};

// Action types
const ActionTypes = {
  SET_CARD_STATE: 'SET_CARD_STATE',
  FLIP_CARD: 'FLIP_CARD',
  UPDATE_CARD_TRANSFORM: 'UPDATE_CARD_TRANSFORM',
  UPDATE_MOUSE_POSITION: 'UPDATE_MOUSE_POSITION',
  SET_DRAGGING: 'SET_DRAGGING',
  TOGGLE_CONTROLS: 'TOGGLE_CONTROLS',
  TOGGLE_STATS: 'TOGGLE_STATS',
  TOGGLE_TOOLTIPS: 'TOGGLE_TOOLTIPS',
  TOGGLE_AUTO_ROTATE: 'TOGGLE_AUTO_ROTATE',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  SET_THEME: 'SET_THEME',
  UPDATE_FPS: 'UPDATE_FPS',
  UPDATE_PARTICLE_COUNT: 'UPDATE_PARTICLE_COUNT',
  SET_QUALITY: 'SET_QUALITY',
  INCREMENT_INTERACTION: 'INCREMENT_INTERACTION',
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  RECORD_GESTURE: 'RECORD_GESTURE',
  RESET_STATE: 'RESET_STATE',
  UPDATE_SESSION_TIME: 'UPDATE_SESSION_TIME',
};

// Reducer function
function cardReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CARD_STATE:
      return {
        ...state,
        cardState: action.payload,
        lastInteraction: Date.now(),
      };
      
    case ActionTypes.FLIP_CARD:
      return {
        ...state,
        isFlipped: !state.isFlipped,
        interactionCount: state.interactionCount + 1,
        lastInteraction: Date.now(),
      };
      
    case ActionTypes.UPDATE_CARD_TRANSFORM:
      return {
        ...state,
        cardPosition: action.payload.position || state.cardPosition,
        cardRotation: action.payload.rotation || state.cardRotation,
        cardScale: action.payload.scale || state.cardScale,
      };
      
    case ActionTypes.UPDATE_MOUSE_POSITION:
      return {
        ...state,
        mousePosition: action.payload,
      };
      
    case ActionTypes.SET_DRAGGING:
      return {
        ...state,
        isDragging: action.payload.isDragging,
        dragStart: action.payload.dragStart || state.dragStart,
        interactionCount: action.payload.isDragging ? state.interactionCount + 1 : state.interactionCount,
      };
      
    case ActionTypes.TOGGLE_CONTROLS:
      return {
        ...state,
        showControls: !state.showControls,
      };
      
    case ActionTypes.TOGGLE_STATS:
      return {
        ...state,
        showStats: !state.showStats,
      };
      
    case ActionTypes.TOGGLE_TOOLTIPS:
      return {
        ...state,
        showTooltips: !state.showTooltips,
      };
      
    case ActionTypes.TOGGLE_AUTO_ROTATE:
      return {
        ...state,
        autoRotate: !state.autoRotate,
      };
      
    case ActionTypes.TOGGLE_SOUND:
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
      
    case ActionTypes.UPDATE_FPS:
      return {
        ...state,
        fps: action.payload,
      };
      
    case ActionTypes.UPDATE_PARTICLE_COUNT:
      return {
        ...state,
        particleCount: action.payload,
      };
      
    case ActionTypes.SET_QUALITY:
      return {
        ...state,
        quality: action.payload,
        // Adjust other settings based on quality
        particleCount: action.payload === 'low' ? 100 : 
                      action.payload === 'medium' ? 200 : 300,
      };
      
    case ActionTypes.INCREMENT_INTERACTION:
      return {
        ...state,
        interactionCount: state.interactionCount + 1,
        lastInteraction: Date.now(),
      };
      
    case ActionTypes.UNLOCK_ACHIEVEMENT:
      if (!state.unlockedAchievements.includes(action.payload)) {
        return {
          ...state,
          unlockedAchievements: [...state.unlockedAchievements, action.payload],
        };
      }
      return state;
      
    case ActionTypes.RECORD_GESTURE:
      if (!state.detectedGestures.includes(action.payload)) {
        return {
          ...state,
          detectedGestures: [...state.detectedGestures, action.payload],
          interactionCount: state.interactionCount + 1,
        };
      }
      return state;
      
    case ActionTypes.RESET_STATE:
      return {
        ...initialState,
        // Keep some persistent data
        unlockedAchievements: state.unlockedAchievements,
        detectedGestures: state.detectedGestures,
        sessionStart: state.sessionStart,
      };
      
    case ActionTypes.UPDATE_SESSION_TIME:
      return {
        ...state,
        currentSessionTime: action.payload,
      };
      
    default:
      return state;
  }
}

// Create context
const CardContext = createContext(null);

// Provider component
export function CardProvider({ children }) {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  // Actions
  const setCardState = useCallback((state) => {
    dispatch({ type: ActionTypes.SET_CARD_STATE, payload: state });
  }, []);

  const flipCard = useCallback(() => {
    dispatch({ type: ActionTypes.FLIP_CARD });
  }, []);

  const updateCardTransform = useCallback((transform) => {
    dispatch({ type: ActionTypes.UPDATE_CARD_TRANSFORM, payload: transform });
  }, []);

  const updateMousePosition = useCallback((position) => {
    dispatch({ type: ActionTypes.UPDATE_MOUSE_POSITION, payload: position });
  }, []);

  const setDragging = useCallback((isDragging, dragStart = null) => {
    dispatch({ type: ActionTypes.SET_DRAGGING, payload: { isDragging, dragStart } });
  }, []);

  const toggleControls = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_CONTROLS });
  }, []);

  const toggleStats = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_STATS });
  }, []);

  const toggleTooltips = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_TOOLTIPS });
  }, []);

  const toggleAutoRotate = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_AUTO_ROTATE });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SOUND });
  }, []);

  const setTheme = useCallback((theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme });
  }, []);

  const updateFPS = useCallback((fps) => {
    dispatch({ type: ActionTypes.UPDATE_FPS, payload: fps });
  }, []);

  const updateParticleCount = useCallback((count) => {
    dispatch({ type: ActionTypes.UPDATE_PARTICLE_COUNT, payload: count });
  }, []);

  const setQuality = useCallback((quality) => {
    dispatch({ type: ActionTypes.SET_QUALITY, payload: quality });
  }, []);

  const incrementInteraction = useCallback(() => {
    dispatch({ type: ActionTypes.INCREMENT_INTERACTION });
  }, []);

  const unlockAchievement = useCallback((achievement) => {
    dispatch({ type: ActionTypes.UNLOCK_ACHIEVEMENT, payload: achievement });
  }, []);

  const recordGesture = useCallback((gesture) => {
    dispatch({ type: ActionTypes.RECORD_GESTURE, payload: gesture });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_STATE });
  }, []);

  const updateSessionTime = useCallback((time) => {
    dispatch({ type: ActionTypes.UPDATE_SESSION_TIME, payload: time });
  }, []);

  // Derived state
  const isCardLifted = state.cardState === 'lifted' || state.cardState === 'rotating';
  const isCardInteractive = state.cardState !== 'idle' && state.cardState !== 'returning';
  const sessionDuration = Math.floor((Date.now() - state.sessionStart) / 1000);

  // Gesture detection helper
  const detectGesture = useCallback((startPos, currentPos, endPos = null) => {
    if (!startPos || !currentPos) return null;
    
    const dx = currentPos.x - startPos.x;
    const dy = currentPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only detect gestures with sufficient movement
    if (distance < 50) return null;
    
    // Calculate angle
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Normalize angle to 0-360
    const normalizedAngle = angle < 0 ? angle + 360 : angle;
    
    let gesture = null;
    
    // Detect gestures based on pattern
    if (endPos) {
      // Complete gesture detection
      const startToEndDistance = Math.sqrt(
        Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
      );
      
      if (startToEndDistance < 10) {
        gesture = 'tap';
      } else if (Math.abs(dx) > Math.abs(dy) * 2) {
        gesture = 'horizontal_swipe';
      } else if (Math.abs(dy) > Math.abs(dx) * 2) {
        gesture = 'vertical_swipe';
      } else if (distance > 100) {
        gesture = 'diagonal_swipe';
      }
    } else {
      // Real-time gesture detection (while dragging)
      if (Math.abs(dx) > 30 && Math.abs(dy) < 10) {
        gesture = 'horizontal_drag';
      } else if (Math.abs(dy) > 30 && Math.abs(dx) < 10) {
        gesture = 'vertical_drag';
      }
    }
    
    if (gesture) {
      recordGesture(gesture);
      
      // Check for achievement unlocks
      if (gesture === 'circle' && !state.unlockedAchievements.includes('gesture_master')) {
        unlockAchievement('gesture_master');
      }
    }
    
    return gesture;
  }, [recordGesture, state.unlockedAchievements, unlockAchievement]);

  // Auto-rotate handler
  const handleAutoRotate = useCallback(() => {
    if (state.autoRotate && state.cardState === 'idle') {
      const rotationSpeed = 0.001;
      const newRotation = new THREE.Euler(
        state.cardRotation.x,
        state.cardRotation.y + rotationSpeed,
        state.cardRotation.z
      );
      updateCardTransform({ rotation: newRotation });
    }
  }, [state.autoRotate, state.cardState, state.cardRotation, updateCardTransform]);

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    if (state.fps < 30 && state.quality !== 'low') {
      setQuality('low');
    } else if (state.fps < 45 && state.quality !== 'medium') {
      setQuality('medium');
    }
  }, [state.fps, state.quality, setQuality]);

  // Event handlers for global interactions
  const handleGlobalKeyDown = useCallback((event) => {
    switch (event.key) {
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        if (isCardLifted) flipCard();
        break;
      case 'Escape':
        if (state.cardState !== 'idle') setCardState('idle');
        break;
      case 'c':
      case 'C':
        toggleControls();
        break;
      case 's':
      case 'S':
        toggleStats();
        break;
      case 't':
      case 'T':
        toggleTooltips();
        break;
      case 'r':
      case 'R':
        if (event.ctrlKey) {
          event.preventDefault();
          resetState();
        }
        break;
      case '1':
        setQuality('low');
        break;
      case '2':
        setQuality('medium');
        break;
      case '3':
        setQuality('high');
        break;
    }
  }, [isCardLifted, flipCard, state.cardState, setCardState, toggleControls, toggleStats, toggleTooltips, resetState, setQuality]);

  // Initialize event listeners
  React.useEffect(() => {
    // Session time updater
    const sessionTimer = setInterval(() => {
      updateSessionTime(Date.now() - state.sessionStart);
    }, 1000);

    // Keyboard events
    window.addEventListener('keydown', handleGlobalKeyDown);

    // Performance monitoring
    const perfInterval = setInterval(monitorPerformance, 5000);

    return () => {
      clearInterval(sessionTimer);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      clearInterval(perfInterval);
    };
  }, [handleGlobalKeyDown, monitorPerformance, state.sessionStart, updateSessionTime]);

  // Auto-rotate animation frame
  React.useEffect(() => {
    let animationFrameId;
    
    const animateAutoRotate = () => {
      handleAutoRotate();
      animationFrameId = requestAnimationFrame(animateAutoRotate);
    };
    
    if (state.autoRotate) {
      animateAutoRotate();
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [state.autoRotate, handleAutoRotate]);

  // Value to provide
  const value = {
    // State
    ...state,
    isCardLifted,
    isCardInteractive,
    sessionDuration,
    
    // Actions
    setCardState,
    flipCard,
    updateCardTransform,
    updateMousePosition,
    setDragging,
    toggleControls,
    toggleStats,
    toggleTooltips,
    toggleAutoRotate,
    toggleSound,
    setTheme,
    updateFPS,
    updateParticleCount,
    setQuality,
    incrementInteraction,
    unlockAchievement,
    recordGesture,
    resetState,
    updateSessionTime,
    
    // Helper functions
    detectGesture,
    monitorPerformance,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

// Custom hook for using the context
export function useCardStore() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardStore must be used within a CardProvider');
  }
  return context;
}

// Helper hooks for specific use cases
export function useCardState() {
  const { cardState, setCardState, flipCard, isCardLifted, isCardInteractive } = useCardStore();
  return { cardState, setCardState, flipCard, isCardLifted, isCardInteractive };
}

export function useCardTransform() {
  const { cardPosition, cardRotation, cardScale, updateCardTransform } = useCardStore();
  return { cardPosition, cardRotation, cardScale, updateCardTransform };
}

export function useInteraction() {
  const { 
    mousePosition, 
    updateMousePosition, 
    setDragging, 
    isDragging,
    incrementInteraction,
    interactionCount
  } = useCardStore();
  
  return { 
    mousePosition, 
    updateMousePosition, 
    setDragging, 
    isDragging,
    incrementInteraction,
    interactionCount
  };
}

export function useUISettings() {
  const {
    showControls,
    showStats,
    showTooltips,
    autoRotate,
    soundEnabled,
    theme,
    toggleControls,
    toggleStats,
    toggleTooltips,
    toggleAutoRotate,
    toggleSound,
    setTheme,
  } = useCardStore();
  
  return {
    showControls,
    showStats,
    showTooltips,
    autoRotate,
    soundEnabled,
    theme,
    toggleControls,
    toggleStats,
    toggleTooltips,
    toggleAutoRotate,
    toggleSound,
    setTheme,
  };
}

export function usePerformance() {
  const {
    fps,
    particleCount,
    quality,
    updateFPS,
    updateParticleCount,
    setQuality,
    monitorPerformance,
  } = useCardStore();
  
  return {
    fps,
    particleCount,
    quality,
    updateFPS,
    updateParticleCount,
    setQuality,
    monitorPerformance,
  };
}

export function useAchievements() {
  const {
    unlockedAchievements,
    detectedGestures,
    unlockAchievement,
    recordGesture,
  } = useCardStore();
  
  return {
    unlockedAchievements,
    detectedGestures,
    unlockAchievement,
    recordGesture,
  };
}

export function useAnalytics() {
  const {
    interactionCount,
    sessionStart,
    currentSessionTime,
    sessionDuration,
    lastInteraction,
  } = useCardStore();
  
  return {
    interactionCount,
    sessionStart,
    currentSessionTime,
    sessionDuration,
    lastInteraction,
  };
}