import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Winner, winnersService } from '@/lib/winners';
import { formatCurrency } from '@/lib/utils';

const WinnersTicker: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  
  useEffect(() => {
    // Subscribe to winners updates
    const unsubscribe = winnersService.addListener((updatedWinners) => {
      setWinners(updatedWinners);
    });
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  if (winners.length === 0) {
    return (
      <div className="bg-[#173776] py-1 flex items-center justify-center">
        <span className="text-sm animate-pulse">Cargando ganadores recientes...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#173776] py-1 overflow-hidden">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: [0, -2000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 30,
          ease: "linear"
        }}
      >
        <div className="flex items-center space-x-8 text-sm">
          {winners.map((winner, index) => (
            <span key={index}>
              <i className="fas fa-trophy text-[#e6b64c] mr-1"></i>
              <span className="font-oswald">{winner.username}</span> ganó
              <span className="font-oswald text-[#e6b64c]"> {formatCurrency(winner.amount)}</span> en {winner.gameType}
            </span>
          ))}
          {/* Duplicate the winners for continuous scrolling */}
          {winners.map((winner, index) => (
            <span key={`duplicate-${index}`}>
              <i className="fas fa-trophy text-[#e6b64c] mr-1"></i>
              <span className="font-oswald">{winner.username}</span> ganó
              <span className="font-oswald text-[#e6b64c]"> {formatCurrency(winner.amount)}</span> en {winner.gameType}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WinnersTicker;
