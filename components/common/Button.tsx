import { React } from '../../libs/deps.js';

interface ButtonProps {
  children?: any;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant === 'secondary' ? 'ghost' : variant}`; 
  const sizeClass = `btn-${size}`;

  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};