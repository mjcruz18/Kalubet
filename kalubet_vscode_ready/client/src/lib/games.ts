// Types for casino games

// Card types
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  color: 'red' | 'black';
}

// Poker types
export type PokerHand = 'High Card' | 'Pair' | 'Two Pair' | 'Three of a Kind' | 'Straight' | 
                         'Flush' | 'Full House' | 'Four of a Kind' | 'Straight Flush' | 'Royal Flush';

export interface PokerGame {
  cards: Card[];
  heldCards: boolean[];
  hand: PokerHand | null;
  bet: number;
  credits: number;
  stage: 'initial' | 'draw';
  winAmount: number;
}

// Blackjack types
export interface BlackjackHand {
  cards: Card[];
  value: number;
  isBusted: boolean;
  isBlackjack: boolean;
}

export interface BlackjackGame {
  playerHand: BlackjackHand;
  dealerHand: BlackjackHand;
  bet: number;
  credits: number;
  status: 'betting' | 'playing' | 'dealerTurn' | 'complete';
  result: 'win' | 'lose' | 'push' | null;
  winAmount: number;
}

// Roulette types
export type RouletteColor = 'red' | 'black' | 'green';
export type RouletteBet = 'red' | 'black' | 'odd' | 'even' | 'high' | 'low' | '1st12' | '2nd12' | '3rd12' | string;

export interface RouletteNumber {
  number: number;
  color: RouletteColor;
}

export interface RouletteBetItem {
  type: RouletteBet;
  amount: number;
}

export interface RouletteGame {
  bets: RouletteBetItem[];
  result: RouletteNumber | null;
  spinning: boolean;
  credits: number;
  lastResults: RouletteNumber[];
  winAmount: number;
}

// Helper functions for game logic
export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      let value: number;
      if (rank === 'A') {
        value = 11;
      } else if (rank === 'J' || rank === 'Q' || rank === 'K') {
        value = 10;
      } else {
        value = parseInt(rank);
      }

      deck.push({
        suit,
        rank,
        value,
        color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
      });
    }
  }

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealCards = (deck: Card[], count: number): Card[] => {
  return deck.slice(0, count);
};

// Roulette numbers with their colors
export const rouletteNumbers: RouletteNumber[] = [
  { number: 0, color: 'green' },
  { number: 1, color: 'red' },
  { number: 2, color: 'black' },
  { number: 3, color: 'red' },
  { number: 4, color: 'black' },
  { number: 5, color: 'red' },
  { number: 6, color: 'black' },
  { number: 7, color: 'red' },
  { number: 8, color: 'black' },
  { number: 9, color: 'red' },
  { number: 10, color: 'black' },
  { number: 11, color: 'black' },
  { number: 12, color: 'red' },
  { number: 13, color: 'black' },
  { number: 14, color: 'red' },
  { number: 15, color: 'black' },
  { number: 16, color: 'red' },
  { number: 17, color: 'black' },
  { number: 18, color: 'red' },
  { number: 19, color: 'red' },
  { number: 20, color: 'black' },
  { number: 21, color: 'red' },
  { number: 22, color: 'black' },
  { number: 23, color: 'red' },
  { number: 24, color: 'black' },
  { number: 25, color: 'red' },
  { number: 26, color: 'black' },
  { number: 27, color: 'red' },
  { number: 28, color: 'black' },
  { number: 29, color: 'black' },
  { number: 30, color: 'red' },
  { number: 31, color: 'black' },
  { number: 32, color: 'red' },
  { number: 33, color: 'black' },
  { number: 34, color: 'red' },
  { number: 35, color: 'black' },
  { number: 36, color: 'red' }
];

export const spinRoulette = (): RouletteNumber => {
  return rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)];
};

// Game categories for UI
export const gameCategories = [
  {
    name: "Ruleta",
    type: "roulette",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Blackjack",
    type: "blackjack",
    imageUrl: "https://images.unsplash.com/photo-1551368998-d349c755c74c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Póker",
    type: "poker",
    imageUrl: "https://images.unsplash.com/photo-1615442229594-a24b31269dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Slots",
    type: "slots",
    imageUrl: "https://images.unsplash.com/photo-1627384113973-389a8a55d796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Baccarat",
    type: "baccarat",
    imageUrl: "https://images.unsplash.com/photo-1642548666500-7990b88e72f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Casino en Vivo",
    type: "live",
    imageUrl: "https://images.unsplash.com/photo-1518548235008-15c2e3a4fdd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];
