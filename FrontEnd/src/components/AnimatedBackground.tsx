import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import './AnimatedBackground.css'; // Make sure to add this file

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background using pure CSS animation from index.css */}
      <div className="absolute inset-0 gradient-bg" />

      {/* Floating orbs */}
      <AnimatePresence>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
              x: mousePosition.x * (0.03 * (i + 1)),
              y: mousePosition.y * (0.03 * (i + 1)),
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 10 - i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
            className={`absolute w-[40rem] h-[40rem] rounded-full blur-3xl
              ${i === 0 ? 'bg-purple-500/20 bottom-1/4 right-1/4' : 
                i === 1 ? 'bg-indigo-500/20 top-1/4 left-1/4' : 
                i === 2 ? 'bg-pink-500/20 top-1/2 left-1/2' :
                i === 3 ? 'bg-blue-500/20 bottom-1/3 left-1/3' :
                'bg-violet-500/20 top-1/3 right-1/3'}`}
          />
        ))}
      </AnimatePresence>

      {/* Grid pattern */}
      <motion.div 
        className="absolute inset-0"
        initial={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '3rem 3rem',
          maskImage: 'radial-gradient(ellipse 120% 60% at 50% 0%, #000 80%, transparent 120%)'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px', '-30px -30px', '0px 0px'],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Particle effect */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute rounded-full ${
            i % 3 === 0 ? 'w-2 h-2 bg-white/15' :
            i % 3 === 1 ? 'w-1.5 h-1.5 bg-indigo-400/20' :
            'w-1 h-1 bg-purple-400/20'
          }`}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Shooting stars with explicit keyframes */}
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-0.5 h-0.5 bg-white/70"
          initial={{
            x: -10,
            y: Math.random() * 500,
            scale: 0
          }}
          animate={{
            // Using definite values instead of null
            x: [-10, window.innerWidth + 10],
            y: [Math.random() * 500, Math.random() * 500 + 200],
            scale: [0, 1, 0],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;