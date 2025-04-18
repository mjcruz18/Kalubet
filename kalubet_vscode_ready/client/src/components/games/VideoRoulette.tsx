import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RouletteWheel from '@/components/ui/roulette-wheel';
import { 
  RouletteNumber, 
  RouletteBetItem, 
  rouletteNumbers, 
  spinRoulette 
} from '@/lib/games';
import { formatCurrency } from '@/lib/utils';

const BET_TYPES = [
  { label: 'ROJO', value: 'red', payout: 2, color: 'bg-red-600' },
  { label: 'NEGRO', value: 'black', payout: 2, color: 'bg-gray-900' },
  { label: 'PAR', value: 'even', payout: 2 },
  { label: 'IMPAR', value: 'odd', payout: 2 },
  { label: '1-18', value: 'low', payout: 2 },
  { label: '19-36', value: 'high', payout: 2 },
  { label: '1-12', value: '1st12', payout: 3 },
  { label: '13-24', value: '2nd12', payout: 3 },
  { label: '25-36', value: '3rd12', payout: 3 },
];

const NUMBER_GRID = Array.from({ length: 37 }, (_, i) => i);

const VideoRoulette: React.FC = () => {
  const [credits, setCredits] = useState<number>(1000);
  const [currentBet, setCurrentBet] = useState<number>(10);
  const [bets, setBets] = useState<RouletteBetItem[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<RouletteNumber | null>(null);
  const [lastResults, setLastResults] = useState<RouletteNumber[]>([]);
  const [winAmount, setWinAmount] = useState<number>(0);

  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);

  const placeBet = (type: string) => {
    if (spinning) return;
    if (credits < currentBet) {
      alert('No tienes suficientes créditos para apostar');
      return;
    }
    
    // Check for existing bet of same type
    const existingBetIndex = bets.findIndex(bet => bet.type === type);
    
    if (existingBetIndex !== -1) {
      // Update existing bet
      const updatedBets = [...bets];
      updatedBets[existingBetIndex].amount += currentBet;
      setBets(updatedBets);
    } else {
      // Add new bet
      setBets([...bets, { type, amount: currentBet }]);
    }
    
    // Deduct from credits
    setCredits(credits - currentBet);
  };

  const increaseBet = () => {
    if (spinning) return;
    const newBet = Math.min(100, currentBet + 10);
    setCurrentBet(newBet);
  };

  const decreaseBet = () => {
    if (spinning) return;
    const newBet = Math.max(10, currentBet - 10);
    setCurrentBet(newBet);
  };

  const clearBets = () => {
    if (spinning) return;
    if (bets.length === 0) return;
    
    // Refund all bet amounts
    const refundAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    setCredits(credits + refundAmount);
    setBets([]);
  };

  const spin = () => {
    if (spinning) return;
    if (bets.length === 0) {
      alert('Por favor, realiza al menos una apuesta');
      return;
    }
    
    setSpinning(true);
    // The result will be determined after spin animation
    setTimeout(() => {
      const spinResult = spinRoulette();
      setResult(spinResult);
      setLastResults(prev => [spinResult, ...prev].slice(0, 10));
      
      // Calculate winnings after spin
      setTimeout(() => {
        const wins = calculateWinnings(spinResult);
        setWinAmount(wins);
        setCredits(credits + wins);
      }, 300);
    }, 500);
  };

  const handleSpinComplete = () => {
    setSpinning(false);
  };

  const calculateWinnings = (spinResult: RouletteNumber): number => {
    let totalWinnings = 0;
    
    bets.forEach(bet => {
      // Direct number bet
      if (!isNaN(parseInt(bet.type)) && parseInt(bet.type) === spinResult.number) {
        totalWinnings += bet.amount * 36;
      }
      // Color bet
      else if (bet.type === 'red' && spinResult.color === 'red') {
        totalWinnings += bet.amount * 2;
      }
      else if (bet.type === 'black' && spinResult.color === 'black') {
        totalWinnings += bet.amount * 2;
      }
      // Even/Odd bet
      else if (bet.type === 'even' && spinResult.number !== 0 && spinResult.number % 2 === 0) {
        totalWinnings += bet.amount * 2;
      }
      else if (bet.type === 'odd' && spinResult.number !== 0 && spinResult.number % 2 === 1) {
        totalWinnings += bet.amount * 2;
      }
      // High/Low bet
      else if (bet.type === 'low' && spinResult.number >= 1 && spinResult.number <= 18) {
        totalWinnings += bet.amount * 2;
      }
      else if (bet.type === 'high' && spinResult.number >= 19 && spinResult.number <= 36) {
        totalWinnings += bet.amount * 2;
      }
      // Dozen bet
      else if (bet.type === '1st12' && spinResult.number >= 1 && spinResult.number <= 12) {
        totalWinnings += bet.amount * 3;
      }
      else if (bet.type === '2nd12' && spinResult.number >= 13 && spinResult.number <= 24) {
        totalWinnings += bet.amount * 3;
      }
      else if (bet.type === '3rd12' && spinResult.number >= 25 && spinResult.number <= 36) {
        totalWinnings += bet.amount * 3;
      }
    });
    
    return totalWinnings;
  };

  const newGame = () => {
    if (spinning) return;
    setBets([]);
    setResult(null);
  };

  const isNumberBet = (number: number) => {
    return bets.some(bet => bet.type === number.toString());
  };

  const getNumberColor = (number: number) => {
    const rouletteNumber = rouletteNumbers.find(rn => rn.number === number);
    if (!rouletteNumber) return 'bg-green-600';
    return rouletteNumber.color === 'red' ? 'bg-red-600' : 
           rouletteNumber.color === 'black' ? 'bg-gray-900' : 
           'bg-green-600';
  };

  return (
    <div className="bg-[#050d1d] rounded-lg overflow-hidden p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-montserrat font-bold text-[#e6b64c]">Video Ruleta</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Créditos</p>
          <p className="text-xl font-oswald text-white">{formatCurrency(credits)}</p>
        </div>
      </div>
      
      <Separator className="bg-[#173776] mb-4" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Roulette wheel and betting controls */}
        <div>
          <div className="flex justify-center mb-6">
            <RouletteWheel 
              spinning={spinning} 
              result={result}
              onSpinComplete={handleSpinComplete}
            />
          </div>
          
          {!spinning && result && (
            <div className="text-center mb-6">
              <div className="text-[#e6b64c] font-oswald text-2xl mb-1">
                Número {result.number} - {result.color === 'red' ? 'Rojo' : result.color === 'black' ? 'Negro' : 'Verde'}
              </div>
              {winAmount > 0 ? (
                <div className="text-white">
                  ¡Ganaste <span className="text-[#e6b64c] font-bold">{formatCurrency(winAmount)}</span>!
                </div>
              ) : (
                <div className="text-white">
                  Mejor suerte la próxima vez
                </div>
              )}
            </div>
          )}
          
          {/* Betting controls */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Apuesta</p>
              <div className="flex items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 border-[#173776] text-[#e6b64c] p-0 disabled:opacity-50"
                  onClick={decreaseBet}
                  disabled={spinning || currentBet <= 10}
                >
                  -
                </Button>
                <span className="mx-3 text-lg font-oswald text-white">{formatCurrency(currentBet)}</span>
                <Button
                  size="sm"
                  variant="outline" 
                  className="h-8 w-8 border-[#173776] text-[#e6b64c] p-0 disabled:opacity-50"
                  onClick={increaseBet}
                  disabled={spinning || currentBet >= 100}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                className="border-[#173776] text-[#e6b64c] hover:bg-[#173776]"
                onClick={clearBets}
                disabled={spinning || bets.length === 0}
              >
                LIMPIAR
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] font-bold transition hover:opacity-90"
                onClick={spin}
                disabled={spinning || bets.length === 0}
              >
                {spinning ? 'GIRANDO...' : 'GIRAR'}
              </Button>
            </div>
          </div>
          
          {/* Bet Types */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {BET_TYPES.map((betType, index) => (
              <Button 
                key={index}
                variant="outline"
                className={`p-2 rounded text-center transition border-[#173776] ${
                  bets.some(bet => bet.type === betType.value) ? 'bg-[#173776]' : ''
                } ${betType.color || ''}`}
                onClick={() => placeBet(betType.value)}
                disabled={spinning || credits < currentBet}
              >
                {betType.label}
              </Button>
            ))}
          </div>
          
          {/* Last Results */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Últimos Resultados</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {lastResults.length > 0 ? (
                lastResults.map((res, index) => (
                  <div 
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      res.color === 'red' ? 'bg-red-600' : 
                      res.color === 'black' ? 'bg-gray-900' : 
                      'bg-green-600'
                    }`}
                  >
                    {res.number}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No hay resultados previos</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Number grid and bet information */}
        <div>
          {/* Number Grid */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Números</h3>
            <div className="grid grid-cols-3 gap-1 mb-2">
              <Button 
                variant="outline"
                className={`border-[#173776] bg-green-600 ${
                  isNumberBet(0) ? 'ring-2 ring-[#e6b64c]' : ''
                }`}
                onClick={() => placeBet('0')}
                disabled={spinning || credits < currentBet}
              >
                0
              </Button>
              <div className="col-span-2"></div>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {NUMBER_GRID.slice(1).map((number) => (
                <Button 
                  key={number}
                  variant="outline"
                  className={`p-0 text-sm border-[#173776] ${getNumberColor(number)} ${
                    isNumberBet(number) ? 'ring-2 ring-[#e6b64c]' : ''
                  }`}
                  onClick={() => placeBet(number.toString())}
                  disabled={spinning || credits < currentBet}
                >
                  {number}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Current Bets */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Apuestas Actuales</h3>
            {bets.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {bets.map((bet, index) => (
                  <div 
                    key={index}
                    className="bg-[#0a1c3e] p-2 rounded flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {bet.type === 'red' ? 'Rojo' : 
                       bet.type === 'black' ? 'Negro' : 
                       bet.type === 'even' ? 'Par' : 
                       bet.type === 'odd' ? 'Impar' : 
                       bet.type === 'low' ? '1-18' : 
                       bet.type === 'high' ? '19-36' : 
                       bet.type === '1st12' ? '1-12' : 
                       bet.type === '2nd12' ? '13-24' : 
                       bet.type === '3rd12' ? '25-36' : 
                       `Número ${bet.type}`}
                    </span>
                    <span className="font-oswald text-[#e6b64c]">{formatCurrency(bet.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0a1c3e] p-3 rounded text-center text-gray-400">
                No hay apuestas activas
              </div>
            )}
            
            {bets.length > 0 && (
              <div className="mt-4 bg-[#173776] p-3 rounded flex justify-between items-center">
                <span className="font-medium">Total apostado:</span>
                <span className="font-oswald text-[#e6b64c]">{formatCurrency(totalBet)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Roulette Rules */}
      <div className="mt-6">
        <h3 className="text-lg font-montserrat font-bold text-white mb-2">Pagos de la Ruleta</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm">
          <div className="text-gray-300">Número específico</div>
          <div className="text-[#e6b64c] text-right">36:1</div>
          <div className="text-gray-300">Rojo o Negro</div>
          <div className="text-[#e6b64c] text-right">2:1</div>
          <div className="text-gray-300">Par o Impar</div>
          <div className="text-[#e6b64c] text-right">2:1</div>
          <div className="text-gray-300">1-18 o 19-36</div>
          <div className="text-[#e6b64c] text-right">2:1</div>
          <div className="text-gray-300">Docenas</div>
          <div className="text-[#e6b64c] text-right">3:1</div>
        </div>
      </div>
    </div>
  );
};

export default VideoRoulette;
