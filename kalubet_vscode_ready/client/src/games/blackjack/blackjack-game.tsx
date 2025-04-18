import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { KaluBetButton } from '@/components/ui/kalubet-button';
import { createDeck, shuffleDeck, getSuitSymbol, getCardValue } from '@/lib/utils';
import { BlackjackHand, BlackjackGameState, BlackjackResult, PlayingCard } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const BlackjackGame: React.FC = () => {
  const { toast } = useToast();
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [playerHand, setPlayerHand] = useState<BlackjackHand>({ cards: [], value: 0, isBusted: false, isBlackjack: false });
  const [dealerHand, setDealerHand] = useState<BlackjackHand>({ cards: [], value: 0, isBusted: false, isBlackjack: false });
  const [gameState, setGameState] = useState<BlackjackGameState>('betting');
  const [bet, setBet] = useState<number>(50);
  const [credits, setCredits] = useState<number>(1000);
  const [result, setResult] = useState<BlackjackResult | null>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setPlayerHand({ cards: [], value: 0, isBusted: false, isBlackjack: false });
    setDealerHand({ cards: [], value: 0, isBusted: false, isBlackjack: false });
    setGameState('betting');
    setResult(null);
  };

  const calculateHandValue = (cards: PlayingCard[]): { value: number, isBusted: boolean, isBlackjack: boolean } => {
    let sum = 0;
    let aceCount = 0;

    // First pass: count all non-ace cards and aces
    for (const card of cards) {
      if (card.rank === 'A') {
        aceCount++;
      } else {
        sum += getCardValue(card);
      }
    }

    // Second pass: add aces with optimal values
    for (let i = 0; i < aceCount; i++) {
      if (sum + 11 <= 21) {
        sum += 11;
      } else {
        sum += 1;
      }
    }

    const isBlackjack = cards.length === 2 && sum === 21;
    const isBusted = sum > 21;

    return { value: sum, isBusted, isBlackjack };
  };

  const dealCards = () => {
    if (credits < bet) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits for this bet.",
        variant: "destructive"
      });
      return;
    }

    setCredits(credits - bet);

    const newDeck = [...deck];
    const newPlayerCards: PlayingCard[] = [];
    const newDealerCards: PlayingCard[] = [];

    // Deal two cards to player
    newPlayerCards.push({ ...newDeck.pop()!, isFlipped: false });
    newPlayerCards.push({ ...newDeck.pop()!, isFlipped: false });

    // Deal two cards to dealer (one face down)
    newDealerCards.push({ ...newDeck.pop()!, isFlipped: false });
    newDealerCards.push({ ...newDeck.pop()!, isFlipped: true });

    const playerHandValue = calculateHandValue(newPlayerCards);
    const dealerHandValue = calculateHandValue([newDealerCards[0]]); // Only count visible card

    setPlayerHand({
      cards: newPlayerCards,
      ...playerHandValue
    });

    setDealerHand({
      cards: newDealerCards,
      value: dealerHandValue.value,
      isBusted: false,
      isBlackjack: false
    });

    setDeck(newDeck);

    // Check for player blackjack
    if (playerHandValue.isBlackjack) {
      // Reveal dealer's card
      const updatedDealerCards = newDealerCards.map(card => ({ ...card, isFlipped: false }));
      const fullDealerHandValue = calculateHandValue(updatedDealerCards);
      
      setDealerHand({
        cards: updatedDealerCards,
        ...fullDealerHandValue
      });

      if (fullDealerHandValue.isBlackjack) {
        // Both have blackjack - push
        setResult({
          playerWon: false,
          isDraw: true,
          payout: bet,
          message: "Push! Both have Blackjack."
        });
        setCredits(credits); // Return bet
      } else {
        // Player wins with blackjack (pays 3:2)
        const blackjackPayout = Math.floor(bet * 2.5);
        setResult({
          playerWon: true,
          isDraw: false,
          payout: blackjackPayout,
          message: "Blackjack! You win!"
        });
        setCredits(credits + blackjackPayout);
      }
      setGameState('roundOver');
    } else {
      setGameState('playerTurn');
    }
  };

  const hit = () => {
    if (gameState !== 'playerTurn') return;

    const newDeck = [...deck];
    const newCard = { ...newDeck.pop()!, isFlipped: false };
    const updatedCards = [...playerHand.cards, newCard];
    const handValue = calculateHandValue(updatedCards);

    setPlayerHand({
      cards: updatedCards,
      ...handValue
    });

    setDeck(newDeck);

    // Check for bust
    if (handValue.isBusted) {
      setResult({
        playerWon: false,
        isDraw: false,
        payout: 0,
        message: "Bust! You lose."
      });
      setGameState('roundOver');
    }
  };

  const stand = () => {
    if (gameState !== 'playerTurn') return;

    // Reveal dealer's hidden card
    const revealedDealerCards = dealerHand.cards.map(card => ({ ...card, isFlipped: false }));
    const dealerHandValue = calculateHandValue(revealedDealerCards);

    setDealerHand({
      cards: revealedDealerCards,
      ...dealerHandValue
    });

    setGameState('dealerTurn');

    // Start dealer's turn
    dealerPlay(revealedDealerCards);
  };

  const dealerPlay = (initialCards: PlayingCard[]) => {
    let currentDealerCards = [...initialCards];
    let currentDeck = [...deck];
    let currentHandValue = calculateHandValue(currentDealerCards);

    // Dealer hits until 17 or higher
    while (currentHandValue.value < 17 && !currentHandValue.isBusted) {
      const newCard = { ...currentDeck.pop()!, isFlipped: false };
      currentDealerCards.push(newCard);
      currentHandValue = calculateHandValue(currentDealerCards);
    }

    setDealerHand({
      cards: currentDealerCards,
      ...currentHandValue
    });

    setDeck(currentDeck);

    // Determine the winner
    determineWinner(playerHand, {
      cards: currentDealerCards,
      ...currentHandValue
    });
  };

  const determineWinner = (player: BlackjackHand, dealer: BlackjackHand) => {
    let resultObj: BlackjackResult;

    if (player.isBusted) {
      resultObj = {
        playerWon: false,
        isDraw: false,
        payout: 0,
        message: "Bust! You lose."
      };
    } else if (dealer.isBusted) {
      resultObj = {
        playerWon: true,
        isDraw: false,
        payout: bet * 2,
        message: "Dealer busts! You win!"
      };
      setCredits(credits + bet * 2);
    } else if (player.value > dealer.value) {
      resultObj = {
        playerWon: true,
        isDraw: false,
        payout: bet * 2,
        message: "You win!"
      };
      setCredits(credits + bet * 2);
    } else if (player.value < dealer.value) {
      resultObj = {
        playerWon: false,
        isDraw: false,
        payout: 0,
        message: "Dealer wins."
      };
    } else {
      resultObj = {
        playerWon: false,
        isDraw: true,
        payout: bet,
        message: "Push! It's a tie."
      };
      setCredits(credits + bet);
    }

    setResult(resultObj);
    setGameState('roundOver');
  };

  const renderCard = (card: PlayingCard, index: number, isDealer: boolean) => {
    if (card.isFlipped) {
      return (
        <div
          key={index}
          className="w-16 h-24 bg-[#173776] rounded-lg flex items-center justify-center text-center shadow-md deal-animation"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="text-2xl text-[#0a1c3e]">
            <div className="font-bold">KaluBET</div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="w-16 h-24 bg-white rounded-lg flex items-center justify-center text-[#0a1c3e] font-bold text-xl shadow-md deal-animation"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className={card.isRed ? 'text-red-600' : 'text-black'}>
          <div className="text-xl">{card.rank}</div>
          <div className="text-2xl">{getSuitSymbol(card.suit)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#050d1d] rounded-lg p-4 h-full">
      <h3 className="text-lg font-montserrat font-bold mb-4 text-[#e6b64c]">Video Blackjack</h3>

      <div className="flex flex-col items-center mb-4">
        <div className="text-sm text-gray-400 mb-2">Dealer</div>
        <div className="flex mb-6">
          {dealerHand.cards.length > 0 ? (
            dealerHand.cards.map((card, index) => renderCard(card, index, true))
          ) : (
            <>
              <div className="w-16 h-24 bg-[#173776] rounded-lg opacity-50 mr-2" />
              <div className="w-16 h-24 bg-[#173776] rounded-lg opacity-50" />
            </>
          )}
        </div>

        <div className="text-sm text-gray-400 mb-2">Player</div>
        <div className="flex">
          {playerHand.cards.length > 0 ? (
            playerHand.cards.map((card, index) => renderCard(card, index, false))
          ) : (
            <>
              <div className="w-16 h-24 bg-[#173776] rounded-lg opacity-50 mr-2" />
              <div className="w-16 h-24 bg-[#173776] rounded-lg opacity-50" />
            </>
          )}
        </div>
      </div>

      <div className="text-center mb-4">
        {result ? (
          <div className="text-[#e6b64c] font-oswald text-xl mb-1">{result.message}</div>
        ) : (
          <div className="text-[#e6b64c] font-oswald text-xl mb-1">
            {gameState === 'betting' 
              ? 'Place Your Bet' 
              : `Dealer: ${dealerHand.value} - Player: ${playerHand.value}`}
          </div>
        )}
        <div className="mt-2 text-[#f5f5f5]">
          Credits: <span className="text-[#e6b64c] font-bold">{credits}</span>
        </div>
      </div>

      <div className="flex justify-between">
        {gameState === 'betting' ? (
          <>
            <div className="flex items-center">
              <label className="text-sm mr-2">Bet:</label>
              <select
                value={bet}
                onChange={(e) => setBet(parseInt(e.target.value))}
                className="bg-[#173776] text-[#f5f5f5] p-2 rounded"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
              </select>
            </div>
            <KaluBetButton onClick={dealCards}>DEAL</KaluBetButton>
          </>
        ) : gameState === 'playerTurn' ? (
          <>
            <KaluBetButton variant="outline" onClick={stand}>STAND</KaluBetButton>
            <KaluBetButton onClick={hit}>HIT</KaluBetButton>
          </>
        ) : gameState === 'roundOver' ? (
          <KaluBetButton className="w-full" onClick={resetGame}>NEW GAME</KaluBetButton>
        ) : (
          <div className="w-full text-center text-[#f5f5f5]">Dealer is playing...</div>
        )}
      </div>
    </div>
  );
};

export default BlackjackGame;
