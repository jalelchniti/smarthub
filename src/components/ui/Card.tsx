import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  const hoverEffect = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  
  return (
    <div className={`card ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
};