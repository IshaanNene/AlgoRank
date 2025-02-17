import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hover = true
}) => {
  return (
    <div
      className={`
        glass-card rounded-xl p-6 bg-white/10 backdrop-blur-md border border-white/20
        ${hover ? "hover:bg-white/15 transition-transform duration-300 hover:scale-105" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard; 