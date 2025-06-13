"use client"
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GlowEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    
    if (!container || !glow) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      
      const centerX = width / 2;
      const centerY = height / 2;
      const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
      const opacity = 1 - (distFromCenter / maxDist) * 0.8;
      
      glow.style.opacity = opacity.toString();
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div 
        ref={glowRef}
        className="absolute w-96 h-96 rounded-full pointer-events-none blur-[120px] bg-gradient-to-r from-primary/20 to-secondary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};

export default GlowEffect;