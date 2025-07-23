import React from 'react';

interface DigitalButtonProps {
  children: React.ReactNode;
  className?: string;
  [x: string]: any;
}

const DigitalButton: React.FC<DigitalButtonProps> = ({ children, className = '', ...props }) => (
  <button
    className={`bg-gradient-to-r from-primary-500 via-accent-400 to-neon-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-neon-400/40 transition-all duration-200 border-2 border-transparent hover:border-neon-400 focus:outline-none focus:ring-2 focus:ring-neon-400 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default DigitalButton;