import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RouletteNumber } from '@/lib/games';

interface RouletteWheelProps {
  spinning: boolean;
  result: RouletteNumber | null;
  onSpinComplete?: () => void;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  spinning,
  result,
  onSpinComplete
}) => {
  const [rotations, setRotations] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);
  
  // Calculate the final rotation angle when we have a result
  useEffect(() => {
    if (result && spinning) {
      // Calculate position based on the roulette number
      // Each position is 360/37 = ~9.73 degrees
      const positionAngle = (result.number * 9.73);
      
      // Add multiple full rotations plus the position angle
      // We subtract from 360 to make it clockwise
      const totalRotation = 1440 + (360 - positionAngle);
      
      setFinalRotation(totalRotation);
    }
  }, [result, spinning]);

  return (
    <div className="relative w-48 h-48">
      <motion.div
        className="w-48 h-48 rounded-full border-4 border-[#e6b64c] overflow-hidden"
        animate={{ 
          rotate: spinning ? finalRotation : 0 
        }}
        transition={{ 
          duration: spinning ? 5 : 0,
          ease: "easeOut",
          onComplete: onSpinComplete
        }}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1602752250015-952cb5a54a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-[#e6b64c]"></div>
      
      {/* Result display */}
      {result && !spinning && (
        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 text-center">
          <span className={`text-sm ${result.color === 'red' ? 'text-red-500' : result.color === 'black' ? 'text-gray-200' : 'text-green-500'}`}>
            {result.number} - {result.color.charAt(0).toUpperCase() + result.color.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RouletteWheel;
