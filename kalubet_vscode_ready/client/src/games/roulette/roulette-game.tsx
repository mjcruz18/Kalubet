import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { KaluBetButton } from '@/components/ui/kalubet-button';
import { Badge } from '@/components/ui/badge';
import { ROULETTE_NUMBERS, ROULETTE_BETS } from '@/lib/constants';
import { RouletteNumber, RouletteGameState, RouletteBet } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const RouletteGame: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<RouletteGameState>('betting');
  const [credits, setCredits] = useState<number>(1000);
  const [currentBets, setCurrentBets] = useState<RouletteBet[]>([]);
  const [selectedBetType, setSelectedBetType] = useState<string>('');
  const [spinResult, setSpinResult] = useState<RouletteNumber | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winnings, setWinnings] = useState<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGameState('betting');
    setCurrentBets([]);
    setSelectedBetType('');
    setSpinResult(null);
    setIsSpinning(false);
    setWinnings(0);
  };

  const placeBet = (betType: string) => {
    if (gameState !== 'betting') return;
    
    setSelectedBetType(betType);

    const existingBetIndex = currentBets.findIndex(bet => bet.type === betType);
    
    if (existingBetIndex >= 0) {
      // Bet already exists, so we'll remove it
      const updatedBets = [...currentBets];
      updatedBets.splice(existingBetIndex, 1);
      setCurrentBets(updatedBets);
      toast({
        title: "Bet Removed",
        description: `Removed bet on ${betType}`,
      });
    } else {
      // New bet
      const betAmount = 50; // Fixed bet amount for simplicity
      
      if (credits < betAmount) {
        toast({
          title: "Insufficient Credits",
          description: "You don't have enough credits for this bet.",
          variant: "destructive"
        });
        return;
      }
      
      // Find the payout for this bet type
      const betInfo = ROULETTE_BETS.find(b => b.name === betType);
      if (!betInfo) return;
      
      const newBet: RouletteBet = {
        type: betType,
        amount: betAmount,
        payout: betInfo.payout
      };
      
      setCurrentBets([...currentBets, newBet]);
      setCredits(credits - betAmount);
      
      toast({
        title: "Bet Placed",
        description: `Placed ${formatCurrency(betAmount)} on ${betType}`,
      });
    }
  };

  const spin = () => {
    if (gameState !== 'betting' || currentBets.length === 0) return;
    
    setGameState('spinning');
    setIsSpinning(true);
    
    // Reset any previous wheel animation
    if (wheelRef.current) {
      wheelRef.current.style.animation = 'none';
      // Force reflow to ensure animation restarts
      void wheelRef.current.offsetWidth;
      wheelRef.current.style.animation = 'spin 3s ease-out forwards';
    }
    
    // Determine the result after a delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
      const result = ROULETTE_NUMBERS[randomIndex];
      setSpinResult(result);
      setIsSpinning(false);
      setGameState('result');
      
      // Process bets
      processBets(result);
    }, 3000); // Match the animation duration
  };

  const processBets = (result: RouletteNumber) => {
    let totalWinnings = 0;
    
    for (const bet of currentBets) {
      let won = false;
      
      // Check if bet won based on the bet type and result
      if (bet.type === 'Red' && result.color === 'red') {
        won = true;
      } else if (bet.type === 'Black' && result.color === 'black') {
        won = true;
      } else if (bet.type === 'Green' && result.color === 'green') {
        won = true;
      } else if (bet.type === 'Odd' && result.number % 2 === 1 && result.number !== 0) {
        won = true;
      } else if (bet.type === 'Even' && result.number % 2 === 0 && result.number !== 0) {
        won = true;
      } else if (bet.type === '1-18' && result.number >= 1 && result.number <= 18) {
        won = true;
      } else if (bet.type === '19-36' && result.number >= 19 && result.number <= 36) {
        won = true;
      } else if (bet.type === '1-12' && result.number >= 1 && result.number <= 12) {
        won = true;
      } else if (bet.type === '13-24' && result.number >= 13 && result.number <= 24) {
        won = true;
      } else if (bet.type === '25-36' && result.number >= 25 && result.number <= 36) {
        won = true;
      }
      
      if (won) {
        const winAmount = bet.amount * bet.payout;
        totalWinnings += winAmount;
      }
    }
    
    if (totalWinnings > 0) {
      setWinnings(totalWinnings);
      setCredits(credits + totalWinnings);
      
      toast({
        title: "You Won!",
        description: `You won ${formatCurrency(totalWinnings)}!`,
      });
    } else {
      toast({
        title: "No Win",
        description: "Better luck next time!",
        variant: "destructive"
      });
    }
  };

  const getColorClass = (color: string): string => {
    switch (color) {
      case 'red': return 'bg-red-600';
      case 'black': return 'bg-black';
      case 'green': return 'bg-green-600';
      default: return 'bg-black';
    }
  };

  const isBetSelected = (betType: string): boolean => {
    return currentBets.some(bet => bet.type === betType);
  };

  return (
    <div className="bg-[#050d1d] rounded-lg p-4 h-full">
      <h3 className="text-lg font-montserrat font-bold mb-4 text-[#e6b64c]">Video Roulette</h3>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <div 
            ref={wheelRef}
            className={`w-48 h-48 rounded-full border-4 border-[#e6b64c] overflow-hidden ${isSpinning ? 'spin-animation' : ''}`}
            style={{ 
              backgroundImage: 'radial-gradient(circle, #173776 0%, #0a1c3e 70%, #050d1d 100%)',
              boxShadow: '0 0 15px rgba(230, 182, 76, 0.6)' 
            }}
          >
            {/* Simplified roulette wheel visualization */}
            <div className="h-full w-full grid grid-cols-3 grid-rows-3">
              {ROULETTE_NUMBERS.slice(0, 9).map((num, index) => (
                <div 
                  key={index} 
                  className={`${getColorClass(num.color)} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {num.number}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-[#e6b64c]"></div>
        </div>
      </div>
      
      <div className="text-center mb-4">
        {spinResult ? (
          <div className="text-[#e6b64c] font-oswald text-xl mb-1">
            Number {spinResult.number} - {spinResult.color.charAt(0).toUpperCase() + spinResult.color.slice(1)}
          </div>
        ) : (
          <div className="text-[#e6b64c] font-oswald text-xl mb-1">
            {gameState === 'betting' 
              ? 'Place Your Bets' 
              : 'Spinning...'}
          </div>
        )}
        
        {winnings > 0 && (
          <div className="text-[#f5f5f5]">
            Winnings: <span className="text-[#e6b64c] font-bold">{formatCurrency(winnings)}</span>
          </div>
        )}
        
        <div className="mt-2 text-[#f5f5f5]">
          Credits: <span className="text-[#e6b64c] font-bold">{formatCurrency(credits)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {ROULETTE_BETS.slice(0, 6).map((bet) => (
          <button
            key={bet.name}
            onClick={() => placeBet(bet.name)}
            disabled={gameState !== 'betting'}
            className={`p-2 rounded text-sm transition text-center ${
              isBetSelected(bet.name)
                ? 'bg-[#e6b64c] text-[#050d1d] font-bold'
                : 'bg-[#173776] hover:bg-[#0a1c3e] text-[#f5f5f5]'
            }`}
          >
            {bet.name}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center">
        {gameState === 'betting' ? (
          <KaluBetButton 
            onClick={spin}
            disabled={currentBets.length === 0}
            className={currentBets.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            SPIN
          </KaluBetButton>
        ) : gameState === 'result' ? (
          <KaluBetButton onClick={resetGame}>NEW SPIN</KaluBetButton>
        ) : (
          <Badge className="bg-[#e6b64c] text-[#050d1d] px-4 py-2">Spinning...</Badge>
        )}
      </div>
    </div>
  );
};

export default RouletteGame;
