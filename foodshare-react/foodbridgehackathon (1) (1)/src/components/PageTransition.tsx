import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
      transition={{ 
        duration: 0.45, 
        ease: [0.215, 0.61, 0.355, 1] // Deceleration curve (easeOutCubic) for physical fluid motion
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
