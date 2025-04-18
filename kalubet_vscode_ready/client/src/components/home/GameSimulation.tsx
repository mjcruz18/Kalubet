import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PlayingCard from '@/components/ui/playing-card';
import RouletteWheel from '@/components/ui/roulette-wheel';
import { Card, RouletteNumber, createDeck, shuffleDeck, dealCards, spinRoulette } from '@/lib/games';

const GameSimulation: React.FC = () => {
  // Poker state
  const [pokerCards, setPokerCards] = useState<Card[]>([]);
  const [pokerResult, setPokerResult] = useState<string>('Escalera Real');
  const [pokerWinAmount, setPokerWinAmount] = useState<number>(4000);
  
  // Blackjack state
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [blackjackResult, setBlackjackResult] = useState<string>('Blackjack');
  const [blackjackWinAmount, setBlackjackWinAmount] = useState<number>(150);
  
  // Roulette state
  const [rouletteSpinning, setRouletteSpinning] = useState<boolean>(false);
  const [rouletteResult, setRouletteResult] = useState<RouletteNumber | null>({ number: 7, color: 'red' });
  const [rouletteWinAmount, setRouletteWinAmount] = useState<number>(350);

  useEffect(() => {
    // Initialize games
    initPoker();
    initBlackjack();
  }, []);

  const initPoker = () => {
    const deck = shuffleDeck(createDeck());
    const initialCards = dealCards(deck, 5);
    setPokerCards(initialCards);
    setPokerResult('Escalera Real');
    setPokerWinAmount(4000);
  };

  const initBlackjack = () => {
    const deck = shuffleDeck(createDeck());
    const initialDealerCards = dealCards(deck, 2);
    const initialPlayerCards = dealCards(deck.slice(2), 2);
    setDealerCards(initialDealerCards);
    setPlayerCards(initialPlayerCards);
    setBlackjackResult('Blackjack');
    setBlackjackWinAmount(150);
  };

  const handlePokerDeal = () => {
    const deck = shuffleDeck(createDeck());
    const newCards = dealCards(deck, 5);
    setPokerCards([]);
    setTimeout(() => {
      setPokerCards(newCards);
      
      // Random result for demonstration
      const results = ['Escalera Real', 'Full House', 'Póker', 'Trío', 'Doble Pareja'];
      const amounts = [4000, 2500, 1800, 800, 400];
      const randomIndex = Math.floor(Math.random() * results.length);
      
      setPokerResult(results[randomIndex]);
      setPokerWinAmount(amounts[randomIndex]);
    }, 300);
  };

  const handleBlackjackNewGame = () => {
    const deck = shuffleDeck(createDeck());
    const newDealerCards = dealCards(deck, 2);
    const newPlayerCards = dealCards(deck.slice(2), 2);
    
    setDealerCards([]);
    setPlayerCards([]);
    
    setTimeout(() => {
      setDealerCards(newDealerCards);
      setPlayerCards(newPlayerCards);
      
      // Random result for demonstration
      const results = ['Blackjack', 'Ganaste', 'Perdiste', 'Empate'];
      const amounts = [150, 100, 0, 50];
      const randomIndex = Math.floor(Math.random() * results.length);
      
      setBlackjackResult(results[randomIndex]);
      setBlackjackWinAmount(amounts[randomIndex]);
    }, 300);
  };

  const handleRouletteSpin = () => {
    setRouletteSpinning(true);
    setRouletteResult(null);
    
    setTimeout(() => {
      const newResult = spinRoulette();
      setRouletteResult(newResult);
      
      // Random win amount for demonstration
      const amounts = [0, 0, 350, 0, 700, 0];
      const randomIndex = Math.floor(Math.random() * amounts.length);
      setRouletteWinAmount(amounts[randomIndex]);
    }, 500);
  };

  const handleRouletteSpinComplete = () => {
    setRouletteSpinning(false);
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-white">
          Prueba Nuestros <span className="text-[#e6b64c]">Juegos</span>
        </h2>
      </div>
      
      <div className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] p-4 md:p-6">
        <div className="flex flex-wrap -mx-2">
          {/* Video Poker */}
          <div className="w-full lg:w-1/3 px-2 mb-4 lg:mb-0">
            <div className="bg-[#050d1d] rounded-lg p-4 h-full">
              <h3 className="text-lg font-montserrat font-bold mb-4 text-[#e6b64c]">Video Póker</h3>
              
              <div className="flex justify-center mb-4">
                <div className="grid grid-cols-5 gap-2">
                  {pokerCards.map((card, index) => (
                    <PlayingCard 
                      key={index} 
                      card={card} 
                      animationDelay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-[#e6b64c] font-oswald text-xl mb-1">{pokerResult}</div>
                <div className="text-white">¡Ganancia: <span className="text-[#e6b64c] font-bold">{pokerWinAmount}</span> créditos!</div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  className="bg-[#173776] hover:bg-[#0a1c3e] px-4 py-2 rounded text-sm transition"
                >
                  CAMBIAR
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-4 py-2 rounded text-sm font-bold transition hover:opacity-90"
                  onClick={handlePokerDeal}
                >
                  REPARTIR
                </Button>
              </div>
            </div>
          </div>
          
          {/* Video Blackjack */}
          <div className="w-full lg:w-1/3 px-2 mb-4 lg:mb-0">
            <div className="bg-[#050d1d] rounded-lg p-4 h-full">
              <h3 className="text-lg font-montserrat font-bold mb-4 text-[#e6b64c]">Video Blackjack</h3>
              
              <div className="flex flex-col items-center mb-4">
                <div className="text-sm text-gray-400 mb-2">Crupier</div>
                <div className="flex mb-6">
                  {dealerCards.map((card, index) => (
                    <PlayingCard 
                      key={index} 
                      card={card} 
                      className="mr-2"
                    />
                  ))}
                </div>
                
                <div className="text-sm text-gray-400 mb-2">Jugador</div>
                <div className="flex">
                  {playerCards.map((card, index) => (
                    <PlayingCard 
                      key={index} 
                      card={card} 
                      className="mr-2"
                      animationDelay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-[#e6b64c] font-oswald text-xl mb-1">{blackjackResult}</div>
                <div className="text-white">¡Ganancia: <span className="text-[#e6b64c] font-bold">{blackjackWinAmount}</span> créditos!</div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  className="bg-[#173776] hover:bg-[#0a1c3e] px-4 py-2 rounded text-sm transition"
                >
                  PLANTARSE
                </Button>
                <Button 
                  className="bg-[#173776] hover:bg-[#0a1c3e] px-4 py-2 rounded text-sm transition"
                >
                  PEDIR
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-4 py-2 rounded text-sm font-bold transition hover:opacity-90"
                  onClick={handleBlackjackNewGame}
                >
                  NUEVO JUEGO
                </Button>
              </div>
            </div>
          </div>
          
          {/* Video Roulette */}
          <div className="w-full lg:w-1/3 px-2">
            <div className="bg-[#050d1d] rounded-lg p-4 h-full">
              <h3 className="text-lg font-montserrat font-bold mb-4 text-[#e6b64c]">Video Ruleta</h3>
              
              <div className="flex justify-center mb-4">
                <RouletteWheel 
                  spinning={rouletteSpinning} 
                  result={rouletteResult}
                  onSpinComplete={handleRouletteSpinComplete} 
                />
              </div>
              
              {!rouletteSpinning && rouletteResult && (
                <div className="text-center mb-4">
                  <div className="text-[#e6b64c] font-oswald text-xl mb-1">
                    Número {rouletteResult.number} - {rouletteResult.color === 'red' ? 'Rojo' : rouletteResult.color === 'black' ? 'Negro' : 'Verde'}
                  </div>
                  <div className="text-white">
                    ¡Ganancia: <span className="text-[#e6b64c] font-bold">{rouletteWinAmount}</span> créditos!
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button 
                  className="bg-[#173776] hover:bg-[#0a1c3e] p-2 rounded text-sm transition text-center"
                >
                  1-12
                </Button>
                <Button 
                  className="bg-[#173776] hover:bg-[#0a1c3e] p-2 rounded text-sm transition text-center"
                >
                  13-24
                </Button>
                <Button 
                  className="bg-[#173776] hover:bg-[#0a1c3e] p-2 rounded text-sm transition text-center"
                >
                  25-36
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-6 py-2 rounded text-sm font-bold transition hover:opacity-90"
                  onClick={handleRouletteSpin}
                  disabled={rouletteSpinning}
                >
                  {rouletteSpinning ? "GIRANDO..." : "GIRAR"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameSimulation;
