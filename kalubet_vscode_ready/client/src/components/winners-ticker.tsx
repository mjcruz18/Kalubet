import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Winner = {
  id: number;
  username: string;
  game: string;
  amount: number;
  timestamp: Date;
};

// Datos de ejemplo de ganadores recientes
const mockWinners: Winner[] = [
  { id: 1, username: 'LuckyPlayer7', game: 'Tragamonedas', amount: 25000, timestamp: new Date() },
  { id: 2, username: 'JackpotHunter', game: 'Ruleta', amount: 12500, timestamp: new Date() },
  { id: 3, username: 'CardShark42', game: 'Blackjack', amount: 8000, timestamp: new Date() },
  { id: 4, username: 'SlotKing', game: 'Tragamonedas', amount: 37500, timestamp: new Date() },
  { id: 5, username: 'PokerAce', game: 'Video Poker', amount: 15000, timestamp: new Date() },
  { id: 6, username: 'BigWinnerX', game: 'Ruleta', amount: 22000, timestamp: new Date() },
  { id: 7, username: 'GoldenTouch', game: 'Tragamonedas', amount: 43000, timestamp: new Date() },
  { id: 8, username: 'BettingPro', game: 'Fútbol', amount: 18500, timestamp: new Date() },
];

const WinnersTicker: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>(mockWinners);
  
  // Simulación de nuevos ganadores
  useEffect(() => {
    const interval = setInterval(() => {
      // Generar un nuevo ganador aleatorio
      const games = ['Tragamonedas', 'Ruleta', 'Blackjack', 'Video Poker', 'Fútbol', 'Baloncesto'];
      const usernames = [
        'LuckyWinner', 'GoldenPlayer', 'JackpotKing', 'BetMaster', 'CasinoRoyal',
        'SlotMaster', 'HighRoller', 'BettingPro', 'GameChanger', 'WinnerCircle'
      ];
      
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomUsername = usernames[Math.floor(Math.random() * usernames.length)] + 
        Math.floor(Math.random() * 100);
      const randomAmount = Math.floor(Math.random() * 50000) + 5000;
      
      const newWinner = {
        id: Date.now(),
        username: randomUsername,
        game: randomGame,
        amount: randomAmount,
        timestamp: new Date()
      };
      
      // Añadir el nuevo ganador al principio y mantener solo los últimos 8
      setWinners(prev => [newWinner, ...prev.slice(0, 7)]);
    }, 15000); // Nuevo ganador cada 15 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center">
        <div className="bg-yellow-500 text-black py-1 px-3 font-bold flex-shrink-0 rounded-r-full mr-3">
          GANADORES RECIENTES
        </div>
        
        <div className="overflow-hidden whitespace-nowrap flex-grow">
          <motion.div
            animate={{ x: '-100%' }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: 'linear',
            }}
            className="inline-block"
          >
            {winners.map((winner, index) => (
              <div 
                key={winner.id} 
                className="inline-block mx-4"
              >
                <span className="text-white font-bold">{winner.username}</span>
                <span className="text-gray-300"> ganó </span>
                <span className="text-yellow-400 font-bold">${winner.amount.toLocaleString()}</span>
                <span className="text-gray-300"> en </span>
                <span className="text-white">{winner.game}</span>
                <span className="text-gray-500 ml-1">•</span>
              </div>
            ))}
          </motion.div>
          
          {/* Duplicado para crear efecto continuo */}
          <motion.div
            animate={{ x: '-100%' }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: 'linear',
            }}
            className="inline-block"
          >
            {winners.map((winner, index) => (
              <div 
                key={`dup-${winner.id}`} 
                className="inline-block mx-4"
              >
                <span className="text-white font-bold">{winner.username}</span>
                <span className="text-gray-300"> ganó </span>
                <span className="text-yellow-400 font-bold">${winner.amount.toLocaleString()}</span>
                <span className="text-gray-300"> en </span>
                <span className="text-white">{winner.game}</span>
                <span className="text-gray-500 ml-1">•</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WinnersTicker;