import { Suit, Rank } from './utils';

// Poker types
export type PokerHandType = 
  | 'Royal Flush'
  | 'Straight Flush'
  | 'Four of a Kind'
  | 'Full House'
  | 'Flush'
  | 'Straight'
  | 'Three of a Kind'
  | 'Two Pair'
  | 'Jacks or Better'
  | 'Nothing';

export interface PokerHand {
  type: PokerHandType;
  payout: number;
}

// Blackjack types
export interface BlackjackHand {
  cards: PlayingCard[];
  value: number;
  isBusted: boolean;
  isBlackjack: boolean;
}

export type BlackjackGameState = 
  | 'betting'
  | 'playerTurn'
  | 'dealerTurn'
  | 'roundOver';

export interface BlackjackResult {
  playerWon: boolean;
  isDraw: boolean;
  payout: number;
  message: string;
}

// Roulette types
export type RouletteColor = 'red' | 'black' | 'green';

export interface RouletteNumber {
  number: number;
  color: RouletteColor;
}

export interface RouletteBet {
  type: string;
  amount: number;
  payout: number;
}

export type RouletteGameState = 
  | 'betting'
  | 'spinning'
  | 'result';

// Card types
export interface PlayingCard {
  suit: Suit;
  rank: Rank;
  isRed: boolean;
  isFlipped?: boolean;
  isHeld?: boolean;
}
