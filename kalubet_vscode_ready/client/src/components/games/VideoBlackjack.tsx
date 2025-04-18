import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PlayingCard from '@/components/ui/playing-card';
import { Card, BlackjackHand, createDeck, shuffleDeck, dealCards } from '@/lib/games';
import { formatCurrency } from '@/lib/utils';

const VideoBlackjack: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<BlackjackHand>({ cards: [], value: 0, isBusted: false, isBlackjack: false });
  const [dealerHand, setDealerHand] = useState<BlackjackHand>({ cards: [], value: 0, isBusted: false, isBlackjack: false });
  const [gameStage, setGameStage] = useState<'betting' | 'playing' | 'dealerTurn' | 'complete'>('betting');
  const [credits, setCredits] = useState<number>(1000);
  const [bet, setBet] = useState<number>(10);
  const [result, setResult] = useState<'win' | 'lose' | 'push' | null>(null);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setPlayerHand({ cards: [], value: 0, isBusted: false, isBlackjack: false });
    setDealerHand({ cards: [], value: 0, isBusted: false, isBlackjack: false });
    setGameStage('betting');
    setResult(null);
    setWinAmount(0);
    setMessage('');
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
    if (gameStage !== 'betting') return;
    
    if (credits < bet) {
      alert('No tienes suficientes créditos para apostar');
      return;
    }
    
    setCredits(credits - bet);
    
    // Deal initial cards
    const newDeck = [...deck];
    const playerCards = [newDeck.shift()!, newDeck.shift()!];
    const dealerCards = [newDeck.shift()!, newDeck.shift()!];
    
    const playerValue = calculateHandValue(playerCards);
    const dealerValue = calculateHandValue(dealerCards);
    
    const playerIsBlackjack = playerValue === 21 && playerCards.length === 2;
    const dealerIsBlackjack = dealerValue === 21 && dealerCards.length === 2;
    
    const player: BlackjackHand = {
      cards: playerCards,
      value: playerValue,
      isBusted: playerValue > 21,
      isBlackjack: playerIsBlackjack
    };
    
    const dealer: BlackjackHand = {
      cards: dealerCards,
      value: dealerValue,
      isBusted: dealerValue > 21,
      isBlackjack: dealerIsBlackjack
    };
    
    setPlayerHand(player);
    setDealerHand(dealer);
    setDeck(newDeck);
    
    // Check for blackjack
    if (playerIsBlackjack || dealerIsBlackjack) {
      if (playerIsBlackjack && dealerIsBlackjack) {
        // Push - both have blackjack
        setResult('push');
        setWinAmount(bet);
        setCredits(credits + bet);
        setMessage('Ambos tienen Blackjack - Empate');
      } else if (playerIsBlackjack) {
        // Player wins with blackjack
        const blackjackPayout = bet * 2.5;
        setResult('win');
        setWinAmount(blackjackPayout);
        setCredits(credits + blackjackPayout);
        setMessage('¡Blackjack! Ganas 3:2');
      } else {
        // Dealer has blackjack
        setResult('lose');
        setWinAmount(0);
        setMessage('La casa tiene Blackjack');
      }
      setGameStage('complete');
    } else {
      setGameStage('playing');
    }
  };

  const hit = () => {
    if (gameStage !== 'playing') return;
    
    // Deal a card to the player
    const newDeck = [...deck];
    const newCard = newDeck.shift()!;
    const newPlayerCards = [...playerHand.cards, newCard];
    const newPlayerValue = calculateHandValue(newPlayerCards);
    const playerIsBusted = newPlayerValue > 21;
    
    const newPlayerHand: BlackjackHand = {
      cards: newPlayerCards,
      value: newPlayerValue,
      isBusted: playerIsBusted,
      isBlackjack: false
    };
    
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    
    if (playerIsBusted) {
      // Player busts
      setResult('lose');
      setWinAmount(0);
      setMessage('Te has pasado de 21');
      setGameStage('complete');
    }
  };

  const stand = () => {
    if (gameStage !== 'playing') return;
    
    setGameStage('dealerTurn');
    
    // Dealer plays
    let currentDealerHand = { ...dealerHand };
    let currentDeck = [...deck];
    
    // Dealer draws until 17 or higher
    while (currentDealerHand.value < 17) {
      const newCard = currentDeck.shift()!;
      const newDealerCards = [...currentDealerHand.cards, newCard];
      const newDealerValue = calculateHandValue(newDealerCards);
      
      currentDealerHand = {
        cards: newDealerCards,
        value: newDealerValue,
        isBusted: newDealerValue > 21,
        isBlackjack: false
      };
    }
    
    setDealerHand(currentDealerHand);
    setDeck(currentDeck);
    
    // Determine the result
    if (currentDealerHand.isBusted) {
      // Dealer busts, player wins
      setResult('win');
      setWinAmount(bet * 2);
      setCredits(credits + bet * 2);
      setMessage('La casa se pasó de 21 - ¡Ganaste!');
    } else if (currentDealerHand.value > playerHand.value) {
      // Dealer wins
      setResult('lose');
      setWinAmount(0);
      setMessage('La casa gana');
    } else if (playerHand.value > currentDealerHand.value) {
      // Player wins
      setResult('win');
      setWinAmount(bet * 2);
      setCredits(credits + bet * 2);
      setMessage('¡Ganaste!');
    } else {
      // Push
      setResult('push');
      setWinAmount(bet);
      setCredits(credits + bet);
      setMessage('Empate');
    }
    
    setGameStage('complete');
  };

  const calculateHandValue = (cards: Card[]): number => {
    let value = 0;
    let aces = 0;
    
    // Calculate initial value
    for (const card of cards) {
      if (card.rank === 'A') {
        aces++;
        value += 11;
      } else {
        value += card.value;
      }
    }
    
    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const newGame = () => {
    initializeGame();
  };

  const doubleDown = () => {
    if (gameStage !== 'playing' || playerHand.cards.length !== 2 || credits < bet) return;
    
    // Double the bet
    setCredits(credits - bet);
    const doubleBet = bet * 2;
    setBet(doubleBet);
    
    // Deal one more card to player
    const newDeck = [...deck];
    const newCard = newDeck.shift()!;
    const newPlayerCards = [...playerHand.cards, newCard];
    const newPlayerValue = calculateHandValue(newPlayerCards);
    const playerIsBusted = newPlayerValue > 21;
    
    const newPlayerHand: BlackjackHand = {
      cards: newPlayerCards,
      value: newPlayerValue,
      isBusted: playerIsBusted,
      isBlackjack: false
    };
    
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    
    if (playerIsBusted) {
      // Player busts
      setResult('lose');
      setWinAmount(0);
      setMessage('Te has pasado de 21');
      setGameStage('complete');
    } else {
      // Automatically stand after double down
      setGameStage('dealerTurn');
      setTimeout(() => {
        stand();
      }, 500);
    }
  };

  return (
    <div className="bg-[#050d1d] rounded-lg overflow-hidden p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-montserrat font-bold text-[#e6b64c]">Video Blackjack</h2>
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
      
      {/* Game area */}
      <div className="flex flex-col items-center mb-4">
        {/* Dealer cards */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2 text-center">Crupier {gameStage !== 'betting' && gameStage !== 'dealerTurn' && gameStage !== 'complete' ? `(${dealerHand.cards[0]?.value || 0})` : dealerHand.value > 0 ? `(${dealerHand.value})` : ''}</p>
          <div className="flex justify-center">
            {gameStage === 'betting' ? (
              // Placeholder for dealer cards
              <div className="w-16 h-24 md:w-20 md:h-32 bg-[#173776] rounded-lg border border-[#0a1c3e]" />
            ) : (
              <div className="flex space-x-2">
                {dealerHand.cards.map((card, index) => (
                  <PlayingCard 
                    key={index} 
                    card={index === 0 || gameStage === 'dealerTurn' || gameStage === 'complete' ? card : undefined}
                    faceDown={index !== 0 && gameStage !== 'dealerTurn' && gameStage !== 'complete'}
                    animationDelay={index * 0.1}
                    className="w-16 h-24 md:w-20 md:h-32"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Result message */}
        {message && (
          <motion.div 
            className="mb-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`text-2xl font-oswald ${
              result === 'win' ? 'text-[#e6b64c]' : 
              result === 'lose' ? 'text-red-500' : 
              'text-white'
            }`}>
              {message}
            </div>
            {winAmount > 0 && result !== 'push' && (
              <div className="text-white mt-1">
                ¡Ganaste <span className="text-[#e6b64c] font-bold">{formatCurrency(winAmount)}</span>!
              </div>
            )}
          </motion.div>
        )}
        
        {/* Player cards */}
        <div>
          <p className="text-sm text-gray-400 mb-2 text-center">
            Jugador {playerHand.value > 0 ? `(${playerHand.value})` : ''}
          </p>
          <div className="flex justify-center">
            {gameStage === 'betting' ? (
              // Placeholder for player cards
              <div className="w-16 h-24 md:w-20 md:h-32 bg-[#173776] rounded-lg border border-[#0a1c3e]" />
            ) : (
              <div className="flex space-x-2">
                {playerHand.cards.map((card, index) => (
                  <PlayingCard 
                    key={index} 
                    card={card}
                    animationDelay={index * 0.1 + 0.2}
                    className="w-16 h-24 md:w-20 md:h-32"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Game controls */}
      <div className="flex justify-center space-x-2">
        {gameStage === 'betting' && (
          <Button 
            className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-8 py-2 rounded font-bold transition hover:opacity-90"
            onClick={deal}
            disabled={credits < bet}
          >
            REPARTIR
          </Button>
        )}
        
        {gameStage === 'playing' && (
          <>
            <Button 
              className="bg-[#173776] hover:bg-[#0a1c3e] px-4 py-2 rounded transition"
              onClick={hit}
            >
              PEDIR
            </Button>
            <Button 
              className="bg-[#173776] hover:bg-[#0a1c3e] px-4 py-2 rounded transition"
              onClick={stand}
            >
              PLANTARSE
            </Button>
            {playerHand.cards.length === 2 && credits >= bet && (
              <Button 
                className="bg-[#173776] hover:bg-[#0a1c3e] px-4 py-2 rounded transition"
                onClick={doubleDown}
              >
                DOBLAR
              </Button>
            )}
          </>
        )}
        
        {gameStage === 'complete' && (
          <Button 
            className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-8 py-2 rounded font-bold transition hover:opacity-90"
            onClick={newGame}
          >
            NUEVA MANO
          </Button>
        )}
      </div>
      
      {/* Rules */}
      <div className="mt-8">
        <h3 className="text-lg font-montserrat font-bold text-white mb-2">Reglas del Blackjack</h3>
        <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
          <li>El objetivo es conseguir un valor de cartas más cercano a 21 que el crupier sin pasarse.</li>
          <li>Las cartas numeradas valen su número, las figuras (J, Q, K) valen 10 y los Ases valen 1 u 11.</li>
          <li>Blackjack natural paga 3:2 (carta valor 10 + As)</li>
          <li>El crupier debe pedir carta hasta 16 y plantarse en 17 o más.</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoBlackjack;
