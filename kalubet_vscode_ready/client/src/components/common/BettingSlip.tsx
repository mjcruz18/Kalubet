import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatOdds, calculatePotentialWin } from '@/lib/utils';
import { useBetting } from '@/context/BettingContext';

interface BettingSlipProps {
  isOpen: boolean;
  onClose: () => void;
}

const BettingSlip: React.FC<BettingSlipProps> = ({ isOpen, onClose }) => {
  const { bets, removeBet, updateBetAmount, clearBets, placeBets } = useBetting();
  const [betAmount, setBetAmount] = useState<string>('10000');

  // Calculate totals
  const totalStake = bets.length > 0 ? parseInt(betAmount) : 0;
  const totalPotentialWin = bets.reduce((total, bet) => {
    return total + calculatePotentialWin(totalStake / bets.length, bet.odds);
  }, 0);

  // Update all bet amounts when main amount changes
  useEffect(() => {
    if (betAmount) {
      const amount = parseInt(betAmount);
      if (!isNaN(amount)) {
        bets.forEach(bet => {
          updateBetAmount(bet.id, amount / bets.length);
        });
      }
    }
  }, [betAmount, bets.length, updateBetAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handlePlaceBet = () => {
    placeBets();
    setBetAmount('10000');
  };

  return (
    <>
      {/* Mobile betting slip button */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <Button 
          className="bg-[#e6b64c] text-[#050d1d] p-4 rounded-full shadow-lg relative"
          onClick={() => isOpen ? onClose() : null}
        >
          <i className="fas fa-receipt text-xl"></i>
          {bets.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#e74c3c] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {bets.length}
            </span>
          )}
        </Button>
      </div>
      
      {/* Betting slip panel */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div 
            className="fixed right-0 top-24 bottom-0 w-72 bg-[#0a1c3e] border-l border-[#e6b64c] z-30 betting-slip-panel overflow-y-auto md:block"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-montserrat font-bold text-[#e6b64c]">Ticket de Apuestas</h3>
                <button 
                  className="md:hidden text-white hover:text-[#e6b64c] transition"
                  onClick={onClose}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              {bets.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <i className="fas fa-ticket-alt text-4xl mb-3"></i>
                  <p>Tu ticket de apuestas está vacío</p>
                  <p className="text-sm mt-2">Selecciona una apuesta para comenzar</p>
                </div>
              ) : (
                <>
                  {/* Bet list */}
                  <div className="space-y-3 mb-4">
                    {bets.map((bet) => (
                      <div key={bet.id} className="bg-[#050d1d] rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-sm font-medium">{bet.event}</div>
                            <div className="text-xs text-gray-400">{bet.category}</div>
                          </div>
                          <button 
                            className="text-gray-400 hover:text-[#e74c3c] transition"
                            onClick={() => removeBet(bet.id)}
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">{bet.selectionLabel}</span>
                          <span className="text-[#e6b64c] font-oswald">{formatOdds(bet.odds)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bet amount */}
                  <div className="mb-4">
                    <label htmlFor="bet-amount" className="block text-sm text-gray-400 mb-1">Monto de Apuesta</label>
                    <div className="flex rounded-md overflow-hidden">
                      <span className="bg-[#050d1d] flex items-center justify-center px-3 border-r border-[#0a1c3e]">$</span>
                      <input 
                        type="text" 
                        id="bet-amount" 
                        className="w-full bg-[#050d1d] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#e6b64c]" 
                        placeholder="0" 
                        value={betAmount}
                        onChange={handleAmountChange}
                      />
                    </div>
                  </div>
                  
                  {/* Potential win */}
                  <div className="bg-[#050d1d] rounded p-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Apuesta Total:</span>
                      <span className="font-oswald">{formatCurrency(totalStake)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ganancia Potencial:</span>
                      <span className="text-[#e6b64c] font-oswald font-bold">{formatCurrency(totalPotentialWin)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] py-3 rounded font-bold transition hover:opacity-90"
                      onClick={handlePlaceBet}
                    >
                      REALIZAR APUESTA
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-[#e6b64c] text-[#e6b64c] hover:bg-[#173776]"
                      onClick={clearBets}
                    >
                      LIMPIAR APUESTAS
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BettingSlip;
