import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient";
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hover = true
}) => {
  const baseClasses =
    "relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10";
  const gradientClasses =
    variant === "gradient" ? "bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" : "";
  const hoverEffect = hover ? "hover:scale-105 hover:shadow-lg transition-transform duration-300" : "";

  return (
    <motion.div className={`${baseClasses} ${gradientClasses} ${hoverEffect} ${className}`}>
      {children}
    </motion.div>
  );
};

export default Card;