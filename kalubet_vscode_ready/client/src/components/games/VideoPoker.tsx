import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PlayingCard from '@/components/ui/playing-card';
import { Card, PokerHand, createDeck, shuffleDeck, dealCards } from '@/lib/games';
import { formatCurrency } from '@/lib/utils';

const VideoPoker: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [heldCards, setHeldCards] = useState<boolean[]>([false, false, false, false, false]);
  const [gameStage, setGameStage] = useState<'betting' | 'initial' | 'draw' | 'result'>('betting');
  const [credits, setCredits] = useState<number>(1000);
  const [bet, setBet] = useState<number>(10);
  const [hand, setHand] = useState<PokerHand | null>(null);
  const [winAmount, setWinAmount] = useState<number>(0);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setCards([]);
    setHeldCards([false, false, false, false, false]);
    setGameStage('betting');
    setHand(null);
    setWinAmount(0);
  };

  const increaseBet = () => {
    if (gameStage !== 'betting') return;
    const newBet = Math.min(100, bet + 10);
    setBet(newBet);
  };

  const decreaseBet = () => {
    if (gameStage !== 'betting') return;
    const newBet = Math.max(10, bet - 10);
    setBet(newBet);
  };

  const deal = () => {
    if (gameStage === 'betting') {
      if (credits < bet) {
        alert('No tienes suficientes créditos para apostar');
        return;
      }
      
      setCredits(credits - bet);
      const dealtCards = dealCards(deck, 5);
      const remainingDeck = [...deck];
      remainingDeck.splice(0, 5);
      
      setDeck(remainingDeck);
      setCards(dealtCards);
      setHeldCards([false, false, false, false, false]);
      setGameStage('initial');
    } else if (gameStage === 'initial') {
      // Replace cards that aren't held
      const newCards = [...cards];
      let newDeck = [...deck];
      
      for (let i = 0; i < heldCards.length; i++) {
        if (!heldCards[i]) {
          const newCard = newDeck[0];
          newCards[i] = newCard;
          newDeck.shift();
        }
      }
      
      setCards(newCards);
      setDeck(newDeck);
      setGameStage('result');
      
      // Evaluate hand and determine winnings
      const handResult = evaluateHand(newCards);
      setHand(handResult);
      const winnings = calculateWinnings(handResult, bet);
      setWinAmount(winnings);
      setCredits(credits + winnings);
    } else if (gameStage === 'result') {
      // Start a new game
      initializeGame();
    }
  };

  const toggleHold = (index: number) => {
    if (gameStage !== 'initial') return;
    
    const newHeldCards = [...heldCards];
    newHeldCards[index] = !newHeldCards[index];
    setHeldCards(newHeldCards);
  };

  const evaluateHand = (cards: Card[]): PokerHand => {
    // This is a simplified version - in a real game, you'd need more logic
    // to accurately determine poker hands
    const ranks = cards.map(card => card.rank).sort();
    const suits = cards.map(card => card.suit);
    
    // Check for royal flush
    if (
      suits.every(suit => suit === suits[0]) &&
      ranks.includes('10') &&
      ranks.includes('J') &&
      ranks.includes('Q') &&
      ranks.includes('K') &&
      ranks.includes('A')
    ) {
      return 'Royal Flush';
    }
    
    // Simple pairs check
    const rankCounts: Record<string, number> = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    
    const counts = Object.values(rankCounts);
    
    if (counts.includes(4)) return 'Four of a Kind';
    if (counts.includes(3) && counts.includes(2)) return 'Full House';
    if (suits.every(suit => suit === suits[0])) return 'Flush';
    if (counts.includes(3)) return 'Three of a Kind';
    if (counts.filter(count => count === 2).length === 2) return 'Two Pair';
    if (counts.includes(2)) return 'Pair';
    
    return 'High Card';
  };

  const calculateWinnings = (hand: PokerHand, betAmount: number): number => {
    const payouts: Record<PokerHand, number> = {
      'Royal Flush': 800,
      'Straight Flush': 50,
      'Four of a Kind': 25,
      'Full House': 9,
      'Flush': 6,
      'Straight': 4,
      'Three of a Kind': 3,
      'Two Pair': 2,
      'Pair': 1,
      'High Card': 0
    };
    
    return payouts[hand] * betAmount;
  };

  const getActionButtonText = () => {
    switch (gameStage) {
      case 'betting': return 'REPARTIR';
      case 'initial': return 'CAMBIAR';
      case 'result': return 'NUEVA MANO';
      default: return 'REPARTIR';
    }
  };

  return (
    <div className="bg-[#050d1d] rounded-lg overflow-hidden p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-montserrat font-bold text-[#e6b64c]">Video Póker</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Créditos</p>
          <p className="text-xl font-oswald text-white">{formatCurrency(credits)}</p>
        </div>
      </div>
      
      <Separator className="bg-[#173776] mb-4" />
      
      {/* Betting controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Apuesta</p>
          <div className="flex items-center">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 border-[#173776] text-[#e6b64c] p-0 disabled:opacity-50"
              onClick={decreaseBet}
              disabled={gameStage !== 'betting' || bet <= 10}
            >
              -
            </Button>
            <span className="mx-3 text-lg font-oswald text-white">{formatCurrency(bet)}</span>
            <Button
              size="sm"
              variant="outline" 
              className="h-8 w-8 border-[#173776] text-[#e6b64c] p-0 disabled:opacity-50"
              onClick={increaseBet}
              disabled={gameStage !== 'betting' || bet >= 100}
            >
              +
            </Button>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-400 mb-1">Ganancia</p>
          <p className="text-lg font-oswald text-[#e6b64c]">{formatCurrency(winAmount)}</p>
        </div>
      </div>
      
      {/* Cards display */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {cards.length === 0 ? (
            // Placeholder for cards
            Array(5).fill(0).map((_, i) => (
              <motion.div 
                key={i}
                className="w-16 h-24 md:w-20 md:h-32 bg-[#173776] rounded-lg border border-[#0a1c3e]"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))
          ) : (
            // Actual cards
            cards.map((card, index) => (
              <div key={index} className="relative">
                <PlayingCard 
                  card={card} 
                  isHeld={heldCards[index]}
                  onClick={() => toggleHold(index)}
                  animationDelay={index * 0.1}
                  className="w-16 h-24 md:w-20 md:h-32 cursor-pointer"
                />
                {gameStage === 'initial' && (
                  <div 
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded ${
                      heldCards[index] ? 'bg-[#e6b64c] text-[#050d1d]' : 'bg-[#173776] text-white'
                    }`}
                  >
                    {heldCards[index] ? 'HOLD' : 'TAP'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Result display */}
      {gameStage === 'result' && hand && (
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-[#e6b64c] font-oswald text-2xl mb-1">{hand}</div>
          {winAmount > 0 ? (
            <div className="text-white">
              ¡Ganaste <span className="text-[#e6b64c] font-bold">{formatCurrency(winAmount)}</span>!
            </div>
          ) : (
            <div className="text-white">
              Mejor suerte la próxima vez
            </div>
          )}
        </motion.div>
      )}
      
      {/* Game controls */}
      <div className="flex justify-center">
        <Button 
          className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-8 py-2 rounded font-bold transition hover:opacity-90"
          onClick={deal}
          disabled={gameStage === 'betting' && credits < bet}
        >
          {getActionButtonText()}
        </Button>
      </div>
      
      {/* Pay table */}
      <div className="mt-8">
        <h3 className="text-lg font-montserrat font-bold text-white mb-2">Tabla de Pagos</h3>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <div className="text-gray-300">Escalera Real</div>
          <div className="text-[#e6b64c] text-right">800x</div>
          <div className="text-gray-300">Escalera de Color</div>
          <div className="text-[#e6b64c] text-right">50x</div>
          <div className="text-gray-300">Póker</div>
          <div className="text-[#e6b64c] text-right">25x</div>
          <div className="text-gray-300">Full House</div>
          <div className="text-[#e6b64c] text-right">9x</div>
          <div className="text-gray-300">Color</div>
          <div className="text-[#e6b64c] text-right">6x</div>
          <div className="text-gray-300">Escalera</div>
          <div className="text-[#e6b64c] text-right">4x</div>
          <div className="text-gray-300">Trío</div>
          <div className="text-[#e6b64c] text-right">3x</div>
          <div className="text-gray-300">Doble Pareja</div>
          <div className="text-[#e6b64c] text-right">2x</div>
          <div className="text-gray-300">Par (J o mejor)</div>
          <div className="text-[#e6b64c] text-right">1x</div>
        </div>
      </div>
    </div>
  );
};

export default VideoPoker;
