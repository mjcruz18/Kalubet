import React from 'react';
import { cn } from '@/lib/utils';

interface CardIconProps {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  className?: string;
}

const CardIcon: React.FC<CardIconProps> = ({ suit, className }) => {
  const renderIcon = () => {
    switch (suit) {
      case 'hearts':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className={cn("fill-current text-red-600", className)}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'diamonds':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className={cn("fill-current text-red-600", className)}
          >
            <path d="M12 2L6 12 12 22 18 12z"/>
          </svg>
        );
      case 'clubs':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className={cn("fill-current", className)}
          >
            <path d="M12 2C9.24 2 7 4.24 7 7c0 2.85 2.92 5.47 6 9.14 3.08-3.67 6-6.29 6-9.14 0-2.76-2.24-5-5-5zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            <path d="M12 2C9.24 2 7 4.24 7 7c0 2.85 2.92 5.47 6 9.14 3.08-3.67 6-6.29 6-9.14 0-2.76-2.24-5-5-5zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            <path d="M12 7c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7-5c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm14 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
          </svg>
        );
      case 'spades':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className={cn("fill-current", className)}
          >
            <path d="M12 2L8 6H2V12H8L12 16L16 12H22V6H16L12 2Z"/>
            <path d="M12 17C11.1843 17 10.4434 17.2922 9.87868 17.7678C9.31396 18.2433 9 18.8973 9 19.5833C9 20.2694 9.31396 20.9234 9.87868 21.3989C10.4434 21.8744 11.1843 22.1667 12 22.1667C12.8157 22.1667 13.5566 21.8744 14.1213 21.3989C14.686 20.9234 15 20.2694 15 19.5833C15 18.8973 14.686 18.2433 14.1213 17.7678C13.5566 17.2922 12.8157 17 12 17Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return renderIcon();
};

export default CardIcon;
