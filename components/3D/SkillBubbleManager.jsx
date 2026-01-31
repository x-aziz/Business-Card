import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillBubble from './SkillBubble';

export default function SkillBubbleManager() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [skillDetails, setSkillDetails] = useState(null);
  
  const skills = [
    "React", "Node.js", "Laravel", "MongoDB",
    "Express", "MySQL", "JavaScript", "TypeScript",
    "Tailwind", "Git", "AWS", "Docker"
  ];
  
  // Listen for skill selection events
  useEffect(() => {
    const handleSkillSelected = (event) => {
      const { skill, config } = event.detail;
      setSelectedSkill(skill);
      setSkillDetails(config);
      setShowDetails(true);
    };
    
    const handleSkillHover = (event) => {
      // Show tooltip
      const { skill, level, description } = event.detail;
      // Update tooltip state
    };
    
    window.addEventListener('skill-selected', handleSkillSelected);
    window.addEventListener('skill-hover', handleSkillHover);
    
    return () => {
      window.removeEventListener('skill-selected', handleSkillSelected);
      window.removeEventListener('skill-hover', handleSkillHover);
    };
  }, []);
  
  // Skill details panel
  const SkillDetailsPanel = () => {
    if (!skillDetails || !showDetails) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 
                   glass rounded-xl p-6 max-w-md w-full mx-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${skillDetails.color}20` }}
              >
                {skillDetails.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedSkill}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${skillDetails.level}%`,
                        backgroundColor: skillDetails.color
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: skillDetails.color }}>
                    {skillDetails.level}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mt-4">{skillDetails.description}</p>
          </div>
          
          <button
            onClick={() => {
              setShowDetails(false);
              setSelectedSkill(null);
            }}
            className="text-gray-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
        
        {skillDetails.projects && (
          <div className="mt-6">
            <h4 className="text-gray-400 text-sm font-medium mb-2">Featured Projects</h4>
            <div className="space-y-2">
              {skillDetails.projects.map((project) => (
                <button
                  key={project}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('project-select', {
                      detail: { project, skill: selectedSkill }
                    }));
                  }}
                  className="w-full text-left p-3 rounded-lg bg-gray-800/50 
                           hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white group-hover:text-cyan-300">{project}</span>
                    <span className="text-gray-400 group-hover:text-cyan-300">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // View all projects with this skill
                window.dispatchEvent(new CustomEvent('skill-filter', {
                  detail: { skill: selectedSkill }
                }));
              }}
              className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 
                       text-cyan-300 rounded-lg text-sm font-medium"
            >
              View All Projects
            </button>
            <button
              onClick={() => {
                // Share skill
                navigator.clipboard.writeText(
                  `${selectedSkill}: ${skillDetails.level}% proficiency\n${skillDetails.description}`
                );
                // Show toast
              }}
              className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 
                       text-gray-300 rounded-lg text-sm font-medium"
            >
              Share
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <>
      <AnimatePresence>
        <SkillDetailsPanel />
      </AnimatePresence>
    </>
  );
}