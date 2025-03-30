
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  as?: React.ElementType;
  to?: string;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  icon,
  as: Component = 'button',
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white border-transparent dark:bg-teal-600 dark:hover:bg-teal-700',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white border-transparent dark:bg-orange-600 dark:hover:bg-orange-700',
    outline: 'bg-transparent border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20',
    ghost: 'bg-transparent hover:bg-gray-100 text-darkgray-500 border-transparent dark:text-gray-200 dark:hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  };

  return (
    <Component
      className={cn(
        'font-medium rounded-md border-2 transition-colors duration-200 inline-flex items-center justify-center',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Component>
  );
};

export default Button;
