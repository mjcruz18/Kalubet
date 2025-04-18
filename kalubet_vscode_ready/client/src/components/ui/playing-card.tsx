import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/lib/games';
import CardIcon from './card-icon';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  isHeld?: boolean;
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
}

const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  faceDown = false,
  isHeld = false,
  onClick,
  className,
  animationDelay = 0
}) => {
  if (!card && !faceDown) return null;

  return (
    <motion.div
      className={cn(
        "w-16 h-24 bg-white rounded-lg flex items-center justify-center text-stone-900 font-bold text-xl shadow-md",
        isHeld && "ring-2 ring-yellow-500",
        faceDown && "bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-700",
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: animationDelay,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
    >
      {faceDown ? (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-[#e6b64c] text-2xl font-bold">K</span>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
          <div className="text-xl">{card.rank}</div>
          <div className="text-2xl">
            <CardIcon suit={card.suit} className="h-6 w-6" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PlayingCard;
