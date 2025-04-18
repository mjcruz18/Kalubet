// Game constants
export const POKER_HAND_TYPES = [
  { name: 'Royal Flush', payout: 250 },
  { name: 'Straight Flush', payout: 50 },
  { name: 'Four of a Kind', payout: 25 },
  { name: 'Full House', payout: 9 },
  { name: 'Flush', payout: 6 },
  { name: 'Straight', payout: 4 },
  { name: 'Three of a Kind', payout: 3 },
  { name: 'Two Pair', payout: 2 },
  { name: 'Jacks or Better', payout: 1 },
];

export const ROULETTE_NUMBERS = [
  { number: 0, color: 'green' },
  { number: 32, color: 'red' },
  { number: 15, color: 'black' },
  { number: 19, color: 'red' },
  { number: 4, color: 'black' },
  { number: 21, color: 'red' },
  { number: 2, color: 'black' },
  { number: 25, color: 'red' },
  { number: 17, color: 'black' },
  { number: 34, color: 'red' },
  { number: 6, color: 'black' },
  { number: 27, color: 'red' },
  { number: 13, color: 'black' },
  { number: 36, color: 'red' },
  { number: 11, color: 'black' },
  { number: 30, color: 'red' },
  { number: 8, color: 'black' },
  { number: 23, color: 'red' },
  { number: 10, color: 'black' },
  { number: 5, color: 'red' },
  { number: 24, color: 'black' },
  { number: 16, color: 'red' },
  { number: 33, color: 'black' },
  { number: 1, color: 'red' },
  { number: 20, color: 'black' },
  { number: 14, color: 'red' },
  { number: 31, color: 'black' },
  { number: 9, color: 'red' },
  { number: 22, color: 'black' },
  { number: 18, color: 'red' },
  { number: 29, color: 'black' },
  { number: 7, color: 'red' },
  { number: 28, color: 'black' },
  { number: 12, color: 'red' },
  { number: 35, color: 'black' },
  { number: 3, color: 'red' },
  { number: 26, color: 'black' }
];

export const ROULETTE_BETS = [
  { name: '1-12', payout: 3 },
  { name: '13-24', payout: 3 },
  { name: '25-36', payout: 3 },
  { name: 'Red', payout: 2 },
  { name: 'Black', payout: 2 },
  { name: 'Odd', payout: 2 },
  { name: 'Even', payout: 2 },
  { name: '1-18', payout: 2 },
  { name: '19-36', payout: 2 }
];

// User Interface constants
export const ANIMATION_DURATION = {
  CARD_DEAL: 500,
  ROULETTE_SPIN: 3000,
};

// API Endpoints
export const API_ENDPOINTS = {
  FEATURED_GAMES: '/api/games/featured',
  SPORTS_CATEGORIES: '/api/sports/categories',
  MATCHES: '/api/matches',
  WINNERS: '/api/winners/recent',
  CASINO_CATEGORIES: '/api/casino/categories',
  PROMOTIONS: '/api/promotions',
};
