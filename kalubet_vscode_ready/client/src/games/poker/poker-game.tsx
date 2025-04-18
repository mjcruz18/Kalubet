import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { KaluBetButton } from '@/components/ui/kalubet-button';
import { createDeck, shuffleDeck, getSuitSymbol } from '@/lib/utils';
import { PokerHand, PlayingCard } from '@/lib/types';
import { POKER_HAND_TYPES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const PokerGame: React.FC = () => {
  const { toast } = useToast();
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [credits, setCredits] = useState<number>(1000);
  const [bet, setBet] = useState<number>(10);
  const [currentHand, setCurrentHand] = useState<PokerHand | null>(null);
  const [gamePhase, setGamePhase] = useState<'betting' | 'draw' | 'result'>('betting');
  
  useEffect(() => {
    resetGame();
  }, []);
  
  const resetGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setHand([]);
    setCurrentHand(null);
    setGamePhase('betting');
  };
  
  const dealHand = () => {
    if (credits < bet) {
      toast({
        title: "Insufficient credits",
        description: "You don't have enough credits to place this bet",
        variant: "destructive"
      });
      return;
    }
    
    setCredits(credits - bet);
    
    const newDeck = [...deck];
    const newHand = [];
    
    for (let i = 0; i < 5; i++) {
      newHand.push({...newDeck.pop()!, isHeld: false});
    }
    
    setHand(newHand);
    setDeck(newDeck);
    setGamePhase('draw');
    
    // Evaluate the initial hand
    evaluateHand(newHand);
  };
  
  const toggleHold = (index: number) => {
    if (gamePhase !== 'draw') return;
    
    const newHand = [...hand];
    newHand[index] = { ...newHand[index], isHeld: !newHand[index].isHeld };
    setHand(newHand);
  };
  
  const drawCards = () => {
    const newDeck = [...deck];
    const newHand = [...hand];
    
    for (let i = 0; i < newHand.length; i++) {
      if (!newHand[i].isHeld) {
        newHand[i] = { ...newDeck.pop()!, isHeld: false };
      }
    }
    
    setHand(newHand);
    setDeck(newDeck);
    setGamePhase('result');
    
    // Evaluate the final hand
    const result = evaluateHand(newHand);
    
    // Award credits
    if (result && result.payout > 0) {
      const winnings = bet * result.payout;
      setCredits(credits + winnings);
      
      toast({
        title: result.type,
        description: `You won ${winnings} credits!`,
      });
    }
  };
  
  const evaluateHand = (cards: PlayingCard[]): PokerHand | null => {
    // This is a simplified poker hand evaluator for demo purposes
    // In a real game, you'd want a more robust implementation
    
    // Sort by rank
    const sortedCards = [...cards].sort((a, b) => {
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      return ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
    });
    
    // Check for flush (all same suit)
    const isFlush = sortedCards.every(card => card.suit === sortedCards[0].suit);
    
    // Check for straight (consecutive ranks)
    let isStraight = false;
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const cardRanks = sortedCards.map(card => ranks.indexOf(card.rank));
    cardRanks.sort((a, b) => a - b);
    
    if (
      cardRanks[1] === cardRanks[0] + 1 &&
      cardRanks[2] === cardRanks[1] + 1 &&
      cardRanks[3] === cardRanks[2] + 1 &&
      cardRanks[4] === cardRanks[3] + 1
    ) {
      isStraight = true;
    }
    
    // Special case: A-2-3-4-5 straight
    if (
      cardRanks[0] === 0 && // 2
      cardRanks[1] === 1 && // 3
      cardRanks[2] === 2 && // 4
      cardRanks[3] === 3 && // 5
      cardRanks[4] === 12  // A
    ) {
      isStraight = true;
    }
    
    // Royal flush
    if (isFlush && isStraight && cardRanks[0] === 8) { // 10-J-Q-K-A
      const result = { type: 'Royal Flush', payout: 250 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Straight flush
    if (isFlush && isStraight) {
      const result = { type: 'Straight Flush', payout: 50 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Count card frequencies
    const counts: Record<string, number> = {};
    for (const card of sortedCards) {
      counts[card.rank] = (counts[card.rank] || 0) + 1;
    }
    
    const frequencies = Object.values(counts);
    const pairs = frequencies.filter(f => f === 2).length;
    
    // Four of a kind
    if (frequencies.includes(4)) {
      const result = { type: 'Four of a Kind', payout: 25 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Full house
    if (frequencies.includes(3) && frequencies.includes(2)) {
      const result = { type: 'Full House', payout: 9 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Flush
    if (isFlush) {
      const result = { type: 'Flush', payout: 6 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Straight
    if (isStraight) {
      const result = { type: 'Straight', payout: 4 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Three of a kind
    if (frequencies.includes(3)) {
      const result = { type: 'Three of a Kind', payout: 3 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Two pair
    if (pairs === 2) {
      const result = { type: 'Two Pair', payout: 2 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    // Jacks or better
    if (
      pairs === 1 &&
      (counts['J'] === 2 || counts['Q'] === 2 || counts['K'] === 2 || counts['A'] === 2)
    ) {
      const result = { type: 'Jacks or Better', payout: 1 } as PokerHand;
      setCurrentHand(result);
      return result;
    }
    
    const result = { type: 'Nothing', payout: 0 } as PokerHand;
    setCurrentHand(result);
    return result;
  };
  
  return (
    <div className="bg-[#050d1d] rounded-lg p-4 h-full">
      <h3 className="text-lg font-montserrat font-bold mb-4 text-[#e6b64c]">Video Poker</h3>
      
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-5 gap-2">
          {hand.length > 0 ? (
            hand.map((card, index) => (
              <div 
                key={index} 
                className={`w-16 h-24 flex items-center justify-center rounded-lg shadow-md 
                  ${card.isHeld ? 'border-2 border-[#e6b64c]' : ''}
                  deal-animation cursor-pointer
                  ${gamePhase === 'draw' ? 'hover:border-[#e6b64c] hover:border-2' : ''}
                  bg-white`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => toggleHold(index)}
              >
                <div className={card.isRed ? 'text-red-600' : 'text-black'}>
                  <div className="text-xl">{card.rank}</div>
                  <div className="text-2xl">{getSuitSymbol(card.suit)}</div>
                </div>
              </div>
            ))
          ) : (
            // Empty card placeholders
            Array.from({ length: 5 }).map((_, index) => (
              <div 
                key={index} 
                className="w-16 h-24 bg-[#173776] rounded-lg opacity-50"
              />
            ))
          )}
        </div>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-[#e6b64c] font-oswald text-xl mb-1">
          {currentHand ? currentHand.type : 'Place your bet'}
        </div>
        {currentHand && currentHand.payout > 0 && (
          <div className="text-[#f5f5f5]">
            Payout: <span className="text-[#e6b64c] font-bold">{bet * currentHand.payout}</span> credits!
          </div>
        )}
        <div className="mt-2 text-[#f5f5f5]">
          Credits: <span className="text-[#e6b64c] font-bold">{credits}</span>
        </div>
      </div>
      
      <div className="flex justify-between">
        {gamePhase === 'betting' ? (
          <>
            <div className="flex items-center">
              <label className="text-sm mr-2">Bet:</label>
              <select 
                value={bet}
                onChange={(e) => setBet(parseInt(e.target.value))}
                className="bg-[#173776] text-[#f5f5f5] p-2 rounded"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <KaluBetButton onClick={dealHand}>DEAL</KaluBetButton>
          </>
        ) : gamePhase === 'draw' ? (
          <>
            <KaluBetButton variant="outline" onClick={resetGame}>CANCEL</KaluBetButton>
            <KaluBetButton onClick={drawCards}>DRAW</KaluBetButton>
          </>
        ) : (
          <KaluBetButton className="w-full" onClick={resetGame}>DEAL AGAIN</KaluBetButton>
        )}
      </div>
    </div>
  );
};

export default PokerGame;
