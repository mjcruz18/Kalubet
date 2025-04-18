import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Bet {
  id: string;
  type: 'sport' | 'game';
  event: string;
  category: string;
  selection: string;
  selectionLabel: string;
  odds: number;
  amount: number;
}

interface BettingContextProps {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  removeBet: (id: string) => void;
  updateBetAmount: (id: string, amount: number) => void;
  clearBets: () => void;
  placeBets: () => void;
}

const BettingContext = createContext<BettingContextProps | undefined>(undefined);

interface BettingProviderProps {
  children: ReactNode;
}

export const BettingProvider: React.FC<BettingProviderProps> = ({ children }) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const { toast } = useToast();

  // Load bets from localStorage on initialization
  useEffect(() => {
    const savedBets = localStorage.getItem('kaluBetSlip');
    if (savedBets) {
      try {
        setBets(JSON.parse(savedBets));
      } catch (error) {
        console.error('Error loading saved bets:', error);
      }
    }
  }, []);

  // Save bets to localStorage when they change
  useEffect(() => {
    localStorage.setItem('kaluBetSlip', JSON.stringify(bets));
  }, [bets]);

  const addBet = (bet: Bet) => {
    setBets(prevBets => {
      // Check if bet already exists
      const existingBetIndex = prevBets.findIndex(b => b.id === bet.id);
      
      if (existingBetIndex !== -1) {
        // Update existing bet
        const updatedBets = [...prevBets];
        updatedBets[existingBetIndex] = {
          ...updatedBets[existingBetIndex],
          amount: bet.amount
        };
        
        toast({
          title: 'Apuesta actualizada',
          description: `Has actualizado tu apuesta en ${bet.event}`,
        });
        
        return updatedBets;
      } else {
        // Add new bet
        toast({
          title: 'Apuesta añadida',
          description: `Has añadido ${bet.selectionLabel} en ${bet.event}`,
        });
        
        return [...prevBets, bet];
      }
    });
  };

  const removeBet = (id: string) => {
    setBets(prevBets => {
      const betToRemove = prevBets.find(bet => bet.id === id);
      if (betToRemove) {
        toast({
          title: 'Apuesta eliminada',
          description: `Has eliminado ${betToRemove.selectionLabel} de tu ticket`,
          variant: 'destructive',
        });
      }
      return prevBets.filter(bet => bet.id !== id);
    });
  };

  const updateBetAmount = (id: string, amount: number) => {
    setBets(prevBets => {
      return prevBets.map(bet => {
        if (bet.id === id) {
          return { ...bet, amount };
        }
        return bet;
      });
    });
  };

  const clearBets = () => {
    setBets([]);
    toast({
      title: 'Apuestas eliminadas',
      description: 'Has eliminado todas las apuestas de tu ticket',
      variant: 'destructive',
    });
  };

  const placeBets = async () => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll just simulate a server call
      
      // Send POST request to create bets
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bets }),
      });
      
      if (!response.ok) {
        throw new Error('Error al realizar la apuesta');
      }
      
      toast({
        title: 'Apuesta realizada con éxito',
        description: `Has realizado ${bets.length} apuesta(s)`,
      });
      
      // Clear the betting slip
      setBets([]);
      
    } catch (error) {
      console.error('Error placing bets:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al realizar tu apuesta. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <BettingContext.Provider value={{
      bets,
      addBet,
      removeBet,
      updateBetAmount,
      clearBets,
      placeBets
    }}>
      {children}
    </BettingContext.Provider>
  );
};

// Hook for easy context use
export const useBetting = () => {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
};
