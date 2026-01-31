import { useState, useCallback, useMemo } from 'react';

export const useSkillBubbles = () => {
  const [skills, setSkills] = useState([
    { name: "React", level: 90, color: "#61DAFB", icon: "⚛️" },
    { name: "Node.js", level: 85, color: "#68A063", icon: "🟢" },
    { name: "Laravel", level: 80, color: "#FF2D20", icon: "🛠️" },
    { name: "MongoDB", level: 75, color: "#47A248", icon: "🍃" },
    { name: "Express", level: 82, color: "#000000", icon: "🚂" },
    { name: "MySQL", level: 78, color: "#4479A1", icon: "🐬" },
    { name: "JavaScript", level: 92, color: "#F7DF1E", icon: "📜" },
    { name: "TypeScript", level: 75, color: "#3178C6", icon: "📘" },
    { name: "Tailwind", level: 88, color: "#06B6D4", icon: "🎨" },
    { name: "Git", level: 85, color: "#F05032", icon: "📦" },
    { name: "AWS", level: 70, color: "#FF9900", icon: "☁️" },
    { name: "Docker", level: 65, color: "#2496ED", icon: "🐳" },
  ]);
  
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [skillConnections, setSkillConnections] = useState([]);
  
  // Calculate skill positions in circular layout
  const getSkillPositions = useCallback((radius = 1.2, center = { x: 0, y: 0, z: 0 }) => {
    return skills.map((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius * 0.6;
      const z = center.z + 0.1;
      return { ...skill, position: { x, y, z }, index };
    });
  }, [skills]);
  
  // Get related skills (for connection lines)
  const getRelatedSkills = useCallback((skillName) => {
    const skillGroups = {
      frontend: ['React', 'JavaScript', 'TypeScript', 'Tailwind'],
      backend: ['Node.js', 'Express', 'Laravel'],
      database: ['MongoDB', 'MySQL'],
      devops: ['Git', 'AWS', 'Docker'],
      fullstack: ['React', 'Node.js', 'MongoDB', 'Express'],
    };
    
    const related = [];
    Object.entries(skillGroups).forEach(([group, groupSkills]) => {
      if (groupSkills.includes(skillName)) {
        related.push(...groupSkills.filter(s => s !== skillName));
      }
    });
    
    return [...new Set(related)]; // Remove duplicates
  }, []);
  
  // Calculate connections between skills
  const calculateConnections = useCallback((skillPositions) => {
    const connections = [];
    
    skillPositions.forEach((skill, i) => {
      const relatedSkills = getRelatedSkills(skill.name);
      
      skillPositions.forEach((otherSkill, j) => {
        if (i !== j && relatedSkills.includes(otherSkill.name)) {
          // Check if connection already exists
          const exists = connections.some(conn => 
            (conn.from === skill.name && conn.to === otherSkill.name) ||
            (conn.from === otherSkill.name && conn.to === skill.name)
          );
          
          if (!exists) {
            connections.push({
              from: skill.name,
              to: otherSkill.name,
              fromPos: skill.position,
              toPos: otherSkill.position,
              strength: Math.min(skill.level, otherSkill.level) / 100,
            });
          }
        }
      });
    });
    
    return connections;
  }, [getRelatedSkills]);
  
  // Filter skills by category
  const filterSkillsByCategory = useCallback((category) => {
    const categories = {
      all: skills,
      frontend: skills.filter(s => ['React', 'JavaScript', 'TypeScript', 'Tailwind'].includes(s.name)),
      backend: skills.filter(s => ['Node.js', 'Express', 'Laravel'].includes(s.name)),
      database: skills.filter(s => ['MongoDB', 'MySQL'].includes(s.name)),
      tools: skills.filter(s => ['Git', 'AWS', 'Docker'].includes(s.name)),
    };
    
    return categories[category] || skills;
  }, [skills]);
  
  // Get skill statistics
  const getSkillStats = useMemo(() => {
    const totalLevel = skills.reduce((sum, skill) => sum + skill.level, 0);
    const averageLevel = totalLevel / skills.length;
    
    const topSkills = [...skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 3);
    
    const categories = {
      frontend: skills.filter(s => ['React', 'JavaScript', 'TypeScript', 'Tailwind'].includes(s.name)),
      backend: skills.filter(s => ['Node.js', 'Express', 'Laravel'].includes(s.name)),
    };
    
    const categoryAverages = {};
    Object.entries(categories).forEach(([category, categorySkills]) => {
      if (categorySkills.length > 0) {
        const avg = categorySkills.reduce((sum, s) => sum + s.level, 0) / categorySkills.length;
        categoryAverages[category] = avg;
      }
    });
    
    return {
      averageLevel,
      topSkills,
      categoryAverages,
      totalSkills: skills.length,
    };
  }, [skills]);
  
  // Export skills data
  const exportSkillsData = useCallback(() => {
    const data = {
      skills,
      stats: getSkillStats,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'said-abdelaziz-skills.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [skills, getSkillStats]);
  
  // Import skills data
  const importSkillsData = useCallback((data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.skills && Array.isArray(parsed.skills)) {
        setSkills(parsed.skills);
        return true;
      }
    } catch (error) {
      console.error('Failed to import skills data:', error);
    }
    return false;
  }, []);
  
  // Update skill level
  const updateSkillLevel = useCallback((skillName, newLevel) => {
    setSkills(prev => prev.map(skill => 
      skill.name === skillName 
        ? { ...skill, level: Math.min(100, Math.max(0, newLevel)) }
        : skill
    ));
  }, []);
  
  // Add new skill
  const addSkill = useCallback((newSkill) => {
    setSkills(prev => [...prev, {
      name: newSkill.name,
      level: newSkill.level || 50,
      color: newSkill.color || '#64748B',
      icon: newSkill.icon || '⭐',
    }]);
  }, []);
  
  // Remove skill
  const removeSkill = useCallback((skillName) => {
    setSkills(prev => prev.filter(skill => skill.name !== skillName));
  }, []);
  
  // Handle skill selection
  const handleSkillSelect = useCallback((skill) => {
    setSelectedSkill(skill);
    
    // Calculate connections when skill is selected
    const positions = getSkillPositions();
    const connections = calculateConnections(positions);
    setSkillConnections(connections.filter(conn => 
      conn.from === skill.name || conn.to === skill.name
    ));
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('skill-focused', {
      detail: { skill, connections: skillConnections }
    }));
  }, [getSkillPositions, calculateConnections, skillConnections]);
  
  return {
    // State
    skills,
    selectedSkill,
    hoveredSkill,
    skillConnections,
    
    // Actions
    setSelectedSkill,
    setHoveredSkill,
    updateSkillLevel,
    addSkill,
    removeSkill,
    handleSkillSelect,
    
    // Computed
    getSkillPositions,
    calculateConnections,
    filterSkillsByCategory,
    getSkillStats,
    
    // Data management
    exportSkillsData,
    importSkillsData,
  };
};