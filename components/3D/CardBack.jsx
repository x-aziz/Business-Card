import React, { useState } from 'react';
import { Text, Html } from '@react-three/drei';
import SkillBubble from './SkillBubble';

export default function CardBack({ width, height, depth = 0.05 }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  const skills = [
    "React", "Node.js", "Laravel", "MongoDB",
    "Express", "MySQL", "JavaScript", "PHP",
    "Tailwind", "Git", "BootStrap", "Figma"
  ];
  
  const copyEmail = () => {
    navigator.clipboard.writeText("said.abd.el.aziz.cs@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };
  
  return (
    <group rotation={[0, Math.PI, 0]}>
      {/* Contact header */}
      <Text
        position={[0, height * 0.38, depth * 0.51]}
        fontSize={0.18}
        color="#06B6D4"
        // NO font property
        anchorX="center"
        anchorY="middle"
      >
        CONTACT
      </Text>
      
      {/* Contact info */}
      <group position={[0, height * 0.2, depth * 0.51]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.08}
          color="#E2E8F0"
          // NO font property
          anchorX="center"
          anchorY="middle"
        >
          📧 said.abd.el.aziz.cs@gmail.com
          {"\n"}
          📱 +213 669 085 027 /+213 553 643 785 
          {"\n"}
          💼 linkedin.com/in/said-abdelaziz
          {"\n"}
          💻 github.com/x-aziz
          {"\n"}
          💻 https://abdelaziz-portfolio-vercel.vercel.app
        </Text>
        
        {/* Email copy interaction */}
        <Html
          position={[-width * 0.25, -0.2, depth * 0.52]}
          center
          transform
          occlude
        >
          <button
            onClick={copyEmail}
            className="px-2 py-1 text-xs bg-cyan-500/20 hover:bg-cyan-500/40 
                     text-cyan-300 rounded transition-colors duration-200"
          >
            {copiedEmail ? "Copied!" : "Copy"}
          </button>
        </Html>
      </group>
      
      {/* Skills showcase */}
      <Text
        position={[0, -height * 0.05, depth * 0.51]}
        fontSize={0.14}
        color="#8B5CF6"
        // NO font property
        anchorX="center"
        anchorY="middle"
      >
        SKILLS SHOWCASE
      </Text>
      
      {/* Skill bubbles - will handle their own text */}
      <group position={[0, -height * 0.2, depth * 0.51]}>
        {skills.map((skill, index) => (
          <SkillBubble
            key={skill}
            skill={skill}
            index={index}
            total={skills.length}
          />
        ))}
      </group>
    </group>
  );
}