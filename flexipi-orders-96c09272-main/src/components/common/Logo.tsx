
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
}

const Logo = ({ className, size = 'md', variant = 'auto' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-darkgray-500',
    auto: 'text-darkgray-500 dark:text-white',
  };

  return (
    <Link to="/" className={cn('font-bold flex items-center', sizeClasses[size], colorClasses[variant], className)}>
      <span className="text-teal-500">Flexi</span>
      <span className="text-orange-500">PI</span>
    </Link>
  );
};

export default Logo;
