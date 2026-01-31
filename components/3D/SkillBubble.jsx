import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { useCardStore } from "../../contexts/CardContext";

export default function SkillBubble({ skill, index, total }) {
  const bubbleRef = useRef();
  const textRef = useRef();
  const { cardState, isFlipped, incrementInteraction, unlockAchievement } =
    useCardStore();

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // Skill-specific configurations
  const SKILL_CONFIG = useMemo(
    () => ({
      // Technical Skills
      React: {
        color: "#61DAFB",
        icon: "⚛️",
        level: 90,
        projects: ["Multi-Vendor E-commerce", "Minasa Academy"],
        description:
          "Modern frontend development with hooks, context, and performance optimization",
      },
      "Node.js": {
        color: "#68A063",
        icon: "🟢",
        level: 85,
        projects: ["REST APIs", "Real-time applications"],
        description:
          "Backend development with Express, authentication, and API design",
      },
      Laravel: {
        color: "#FF2D20",
        icon: "🛠️",
        level: 80,
        projects: ["E-commerce platforms", "Admin dashboards"],
        description:
          "PHP framework for robust backend systems and web applications",
      },
      MongoDB: {
        color: "#47A248",
        icon: "🍃",
        level: 75,
        projects: ["Database design", "NoSQL data modeling"],
        description: "NoSQL database for scalable and flexible data storage",
      },
      Express: {
        color: "#000000",
        icon: "🚂",
        level: 82,
        projects: ["API servers", "Middleware systems"],
        description: "Minimalist web framework for Node.js applications",
      },
      MySQL: {
        color: "#4479A1",
        icon: "🐬",
        level: 78,
        projects: ["Relational databases", "Query optimization"],
        description: "Relational database management with complex queries",
      },
      JavaScript: {
        color: "#F7DF1E",
        icon: "📜",
        level: 92,
        projects: ["All projects"],
        description:
          "Full-stack JavaScript development including ES6+ features",
      },
      TypeScript: {
        color: "#3178C6",
        icon: "📘",
        level: 75,
        projects: ["Enterprise applications"],
        description: "Type-safe JavaScript for scalable applications",
      },
      Tailwind: {
        color: "#06B6D4",
        icon: "🎨",
        level: 88,
        projects: ["All frontend projects"],
        description: "Utility-first CSS framework for rapid UI development",
      },
      Git: {
        color: "#F05032",
        icon: "📦",
        level: 85,
        projects: ["All projects"],
        description: "Version control and collaborative development workflows",
      },
      AWS: {
        color: "#FF9900",
        icon: "☁️",
        level: 70,
        projects: ["Deployment", "Cloud infrastructure"],
        description: "Cloud services for deployment, storage, and computing",
      },
      Docker: {
        color: "#2496ED",
        icon: "🐳",
        level: 65,
        projects: ["Containerized applications"],
        description: "Containerization for consistent development environments",
      },

      // Soft Skills
      "Problem Solving": {
        color: "#8B5CF6",
        icon: "🧩",
        level: 90,
        description: "Analytical thinking and creative solutions",
      },
      Communication: {
        color: "#10B981",
        icon: "💬",
        level: 85,
        description: "Clear technical and non-technical communication",
      },
      Teamwork: {
        color: "#3B82F6",
        icon: "🤝",
        level: 88,
        description: "Collaborative development and pair programming",
      },
    }),
    [],
  );

  const config = SKILL_CONFIG[skill] || {
    color: "#64748B",
    icon: "⭐",
    level: 70,
    description: "Professional skill",
  };

  // Calculate position in circular layout
  const angle = (index / total) * Math.PI * 2;
  const radius = 1.2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius * 0.6;
  const z = 0.1;

  // Animation values
  const timeRef = useRef(0);
  const hoverScale = hovered ? 1.3 : 1.0;
  const selectedScale = isSelected ? 1.5 : 1.0;
  const clickScale = clicked ? 0.9 : 1.0;
  const scale = hoverScale * selectedScale * clickScale;

  // Skill level visualization
  const levelRadius = config.level / 100;
  const levelColor = useMemo(() => {
    if (config.level >= 85) return "#10B981"; // Green
    if (config.level >= 75) return "#3B82F6"; // Blue
    if (config.level >= 65) return "#8B5CF6"; // Purple
    return "#64748B"; // Gray
  }, [config.level]);

  useFrame((state) => {
    if (!bubbleRef.current) return;

    timeRef.current += 0.01;

    // Only animate when card is flipped
    if (isFlipped) {
      // Gentle floating animation
      bubbleRef.current.position.y =
        y + Math.sin(timeRef.current + index) * 0.05;

      // Rotation based on position
      bubbleRef.current.rotation.x =
        Math.sin(timeRef.current * 0.5 + index) * 0.1;
      bubbleRef.current.rotation.y =
        Math.cos(timeRef.current * 0.3 + index) * 0.1;

      // Hover/click effects
      if (hovered && !clicked) {
        bubbleRef.current.position.z = z + 0.2;
      } else if (clicked) {
        bubbleRef.current.position.z = z + 0.3;
      } else {
        bubbleRef.current.position.z = z;
      }

      // Connection lines to card center
      if (hovered || isSelected) {
        // This would be handled by a separate Line component
      }
    }

    // Pulse animation
    if (pulse) {
      const pulseScale = 1 + Math.sin(timeRef.current * 10) * 0.1;
      bubbleRef.current.scale.setScalar(scale * pulseScale);
    } else {
      bubbleRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = () => {
    setClicked(true);
    incrementInteraction();

    // Toggle selection
    setIsSelected(!isSelected);

    // Trigger pulse animation
    setPulse(true);
    setTimeout(() => setPulse(false), 500);

    // Show skill details
    window.dispatchEvent(
      new CustomEvent("skill-selected", {
        detail: {
          skill,
          config,
          position: bubbleRef.current?.position || { x, y, z },
        },
      }),
    );

    // Check for achievement
    if (!isSelected) {
      unlockAchievement("skill_explorer");
    }

    setTimeout(() => setClicked(false), 200);
  };

  const handlePointerOver = () => {
    setHovered(true);

    // Show tooltip
    window.dispatchEvent(
      new CustomEvent("skill-hover", {
        detail: { skill, level: config.level, description: config.description },
      }),
    );
  };

  const handlePointerOut = () => {
    setHovered(false);

    // Hide tooltip
    window.dispatchEvent(new CustomEvent("skill-hover-end"));
  };

  return (
    <group
      ref={bubbleRef}
      position={[x, y, z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.15 * scale, 16, 16]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main bubble */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh>
          <sphereGeometry args={[0.12 * scale, 32, 32]} />
          <meshStandardMaterial
            color={config.color}
            metalness={0.8}
            roughness={0.2}
            emissive={config.color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      {/* Skill level indicator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.13, 0.15, 32]} />
        <meshStandardMaterial
          color={levelColor}
          emissive={levelColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Filled progress ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* This would need a custom geometry for partial ring */}
        <ringGeometry
          args={[0.13, 0.135, 32, 1, 0, (Math.PI * 2 * config.level) / 100]}
        />
        <meshBasicMaterial
          color={levelColor}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Icon or first letter */}
      <Text
  position={[0, 0, 0.13]}
  fontSize={0.06}
  color="#FFFFFF"
  // NO font property
  anchorX="center"
  anchorY="middle"
>
  {config.icon || skill.charAt(0)}
</Text>

      {/* Skill name (visible on hover/selection) */}
      {(hovered || isSelected) && (
        <Text
          position={[0, -0.2, 0.1]}
          fontSize={0.04}
          color="#FFFFFF"
          font="/fonts/Inter-SemiBold.ttf"
          anchorX="center"
          anchorY="top"
          maxWidth={0.4}
        >
          {skill}
        </Text>
      )}

      {/* Skill level percentage (visible on hover) */}
      {hovered && (
        <Text
          position={[0, -0.25, 0.1]}
          fontSize={0.03}
          color={levelColor}
          font="/fonts/Inter-Medium.ttf"
          anchorX="center"
          anchorY="top"
        >
          {config.level}%
        </Text>
      )}

      {/* Connection line to center (when selected) */}
      {isSelected && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, -x * 0.5, -y * 0.5, -z])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={config.color}
            linewidth={2}
            transparent
            opacity={0.5}
          />
        </line>
      )}

      {/* Project links (when selected) */}
      {isSelected && config.projects && (
        <group position={[0, -0.35, 0]}>
          {config.projects.map((project, idx) => (
            <Text
              key={project}
              position={[0, idx * -0.05, 0]}
              fontSize={0.025}
              color="#94A3B8"
              font="/fonts/Inter-Regular.ttf"
              anchorX="center"
              anchorY="top"
              maxWidth={0.3}
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(
                  new CustomEvent("project-select", {
                    detail: { project, skill },
                  }),
                );
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                // Highlight project
              }}
            >
              • {project}
            </Text>
          ))}
        </group>
      )}
    </group>
  );
}
