
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "w-full text-lg font-bold py-4 px-6 rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-[#10B981] text-white hover:bg-emerald-500 focus:ring-emerald-400',
    secondary: 'bg-[#475569] text-slate-100 hover:bg-slate-500 focus:ring-slate-400',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-700 focus:ring-slate-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
