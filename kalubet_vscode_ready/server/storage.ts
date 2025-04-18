import {
  users, type User, type InsertUser,
  games, type Game, type InsertGame,
  sportsCategories, type SportsCategory, type InsertSportsCategory,
  matches, type Match, type InsertMatch,
  winners, type Winner, type InsertWinner,
  casinoCategories, type CasinoCategory, type InsertCasinoCategory,
  promotions, type Promotion, type InsertPromotion,
  bettingSlipItems, type BettingSlipItem, type InsertBettingSlipItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game operations
  getGames(): Promise<Game[]>;
  getFeaturedGames(): Promise<Game[]>;
  getGamesByType(type: string): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Sports category operations
  getSportsCategories(): Promise<SportsCategory[]>;
  getSportsCategory(id: number): Promise<SportsCategory | undefined>;
  createSportsCategory(category: InsertSportsCategory): Promise<SportsCategory>;
  
  // Match operations
  getMatches(): Promise<Match[]>;
  getLiveMatches(): Promise<Match[]>;
  getMatchesBySportCategory(categoryId: number): Promise<Match[]>;
  getMatch(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  
  // Winner operations
  getWinners(): Promise<Winner[]>;
  getRecentWinners(limit: number): Promise<Winner[]>;
  createWinner(winner: InsertWinner): Promise<Winner>;
  
  // Casino category operations
  getCasinoCategories(): Promise<CasinoCategory[]>;
  getCasinoCategory(id: number): Promise<CasinoCategory | undefined>;
  createCasinoCategory(category: InsertCasinoCategory): Promise<CasinoCategory>;
  
  // Promotion operations
  getPromotions(): Promise<Promotion[]>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  
  // Betting slip operations
  getBettingSlipItems(userId: number): Promise<BettingSlipItem[]>;
  createBettingSlipItem(item: InsertBettingSlipItem): Promise<BettingSlipItem>;
  updateBettingSlipItem(id: number, amount: number): Promise<BettingSlipItem | undefined>;
  removeBettingSlipItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private sportsCategories: Map<number, SportsCategory>;
  private matches: Map<number, Match>;
  private winners: Map<number, Winner>;
  private casinoCategories: Map<number, CasinoCategory>;
  private promotions: Map<number, Promotion>;
  private bettingSlipItems: Map<number, BettingSlipItem>;
  
  private userId: number;
  private gameId: number;
  private sportsCategoryId: number;
  private matchId: number;
  private winnerId: number;
  private casinoCategoryId: number;
  private promotionId: number;
  private bettingSlipItemId: number;
  
  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.sportsCategories = new Map();
    this.matches = new Map();
    this.winners = new Map();
    this.casinoCategories = new Map();
    this.promotions = new Map();
    this.bettingSlipItems = new Map();
    
    this.userId = 1;
    this.gameId = 1;
    this.sportsCategoryId = 1;
    this.matchId = 1;
    this.winnerId = 1;
    this.casinoCategoryId = 1;
    this.promotionId = 1;
    this.bettingSlipItemId = 1;
    
    this.initializeData();
  }
  
  private initializeData() {
    // Initialize featured games
    this.createGame({
      name: "Video Poker",
      type: "poker",
      description: "Play poker like in Los Santos, with high-quality graphics.",
      imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      isPopular: false,
      isNew: false
    });
    
    this.createGame({
      name: "Video Blackjack",
      type: "blackjack",
      description: "Beat the dealer and take your game to the next level.",
      imageUrl: "https://images.unsplash.com/photo-1596838132731-31a10caed18f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      isPopular: true,
      isNew: false
    });
    
    this.createGame({
      name: "Video Roulette",
      type: "roulette",
      description: "The excitement of live roulette with realistic graphics.",
      imageUrl: "https://images.unsplash.com/photo-1605166650904-910c45e8ef5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      isPopular: false,
      isNew: false
    });
    
    this.createGame({
      name: "Slots Premium",
      type: "slots",
      description: "The best slot machines with a Los Santos theme.",
      imageUrl: "https://images.unsplash.com/photo-1460324558890-669323ecc167?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      isPopular: false,
      isNew: true
    });
    
    // Initialize casino categories
    this.createCasinoCategory({
      name: "Roulette",
      imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    });
    
    this.createCasinoCategory({
      name: "Blackjack",
      imageUrl: "https://images.unsplash.com/photo-1551368998-d349c755c74c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    });
    
    this.createCasinoCategory({
      name: "Poker",
      imageUrl: "https://images.unsplash.com/photo-1615442229594-a24b31269dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    });
    
    this.createCasinoCategory({
      name: "Slots",
      imageUrl: "https://images.unsplash.com/photo-1627384113973-389a8a55d796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    });
    
    this.createCasinoCategory({
      name: "Baccarat",
      imageUrl: "https://images.unsplash.com/photo-1642548666500-7990b88e72f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    });
    
    this.createCasinoCategory({
      name: "Live Casino",
      imageUrl: "https://images.unsplash.com/photo-1518548235008-15c2e3a4fdd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    });
    
    // Initialize sports categories
    this.createSportsCategory({
      name: "Soccer",
      icon: "futbol",
      matchCount: 24
    });
    
    this.createSportsCategory({
      name: "Basketball",
      icon: "basketball-ball",
      matchCount: 18
    });
    
    this.createSportsCategory({
      name: "Baseball",
      icon: "baseball-ball",
      matchCount: 12
    });
    
    this.createSportsCategory({
      name: "Hockey",
      icon: "hockey-puck",
      matchCount: 8
    });
    
    this.createSportsCategory({
      name: "MMA",
      icon: "fist-raised",
      matchCount: 6
    });
    
    this.createSportsCategory({
      name: "Tennis",
      icon: "table-tennis",
      matchCount: 14
    });
    
    // Initialize matches
    this.createMatch({
      sportsCategoryId: 1,
      homeTeam: "Los Santos FC",
      awayTeam: "Vinewood United",
      startTime: new Date(),
      isLive: true,
      score: "2-1",
      league: "Liga Los Santos",
      odds: {
        home: "2.10",
        draw: "3.25",
        away: "3.50"
      }
    });
    
    this.createMatch({
      sportsCategoryId: 2,
      homeTeam: "Los Santos Lakers",
      awayTeam: "Sandy Shores Bulls",
      startTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      isLive: false,
      league: "NBA",
      odds: {
        home: "1.85",
        handicap: "2.00",
        away: "1.95"
      }
    });
    
    this.createMatch({
      sportsCategoryId: 6,
      homeTeam: "J. Rodríguez",
      awayTeam: "M. Thompson",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      isLive: false,
      league: "Paleto Cup",
      odds: {
        home: "1.45",
        away: "2.70"
      }
    });
    
    // Initialize winners
    this.createWinner({
      username: "Carlos M.",
      amount: 580000,
      game: "Roulette"
    });
    
    this.createWinner({
      username: "María L.",
      amount: 120000,
      game: "Blackjack"
    });
    
    this.createWinner({
      username: "Juan P.",
      amount: 350000,
      game: "Poker"
    });
    
    this.createWinner({
      username: "Ana S.",
      amount: 890000,
      game: "Sports Betting"
    });
    
    this.createWinner({
      username: "Miguel R.",
      amount: 420000,
      game: "Poker"
    });
    
    this.createWinner({
      username: "Diana F.",
      amount: 670000,
      game: "Roulette"
    });
    
    // Initialize promotions
    this.createPromotion({
      title: "Welcome Bonus",
      description: "Register today and receive a 100% bonus on your first deposit up to $100,000.",
      validUntil: new Date(2023, 11, 31), // December 31, 2023
      condition: "Minimum deposit: $5,000",
      isFeatured: true
    });
    
    this.createPromotion({
      title: "Free Spins",
      description: "Get 50 free spins on our most popular slot machines.",
      validUntil: new Date(2023, 11, 31), // December 31, 2023
      condition: "Minimum deposit: $5,000",
      isFeatured: false
    });
    
    this.createPromotion({
      title: "Risk-Free Bet",
      description: "First sports bet risk-free. If you lose, we'll refund up to $25,000.",
      validUntil: new Date(2023, 11, 31), // December 31, 2023
      condition: "For new users only",
      isFeatured: false
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      balance: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Game operations
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getFeaturedGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isFeatured);
  }
  
  async getGamesByType(type: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.type === type);
  }
  
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameId++;
    const game: Game = { ...insertGame, id };
    this.games.set(id, game);
    return game;
  }
  
  // Sports category operations
  async getSportsCategories(): Promise<SportsCategory[]> {
    return Array.from(this.sportsCategories.values());
  }
  
  async getSportsCategory(id: number): Promise<SportsCategory | undefined> {
    return this.sportsCategories.get(id);
  }
  
  async createSportsCategory(insertCategory: InsertSportsCategory): Promise<SportsCategory> {
    const id = this.sportsCategoryId++;
    const category: SportsCategory = { ...insertCategory, id };
    this.sportsCategories.set(id, category);
    return category;
  }
  
  // Match operations
  async getMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }
  
  async getLiveMatches(): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.isLive);
  }
  
  async getMatchesBySportCategory(categoryId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.sportsCategoryId === categoryId);
  }
  
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }
  
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.matchId++;
    const match: Match = { ...insertMatch, id };
    this.matches.set(id, match);
    return match;
  }
  
  // Winner operations
  async getWinners(): Promise<Winner[]> {
    return Array.from(this.winners.values());
  }
  
  async getRecentWinners(limit: number): Promise<Winner[]> {
    return Array.from(this.winners.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  async createWinner(insertWinner: InsertWinner): Promise<Winner> {
    const id = this.winnerId++;
    const winner: Winner = { ...insertWinner, id, timestamp: new Date() };
    this.winners.set(id, winner);
    return winner;
  }
  
  // Casino category operations
  async getCasinoCategories(): Promise<CasinoCategory[]> {
    return Array.from(this.casinoCategories.values());
  }
  
  async getCasinoCategory(id: number): Promise<CasinoCategory | undefined> {
    return this.casinoCategories.get(id);
  }
  
  async createCasinoCategory(insertCategory: InsertCasinoCategory): Promise<CasinoCategory> {
    const id = this.casinoCategoryId++;
    const category: CasinoCategory = { ...insertCategory, id };
    this.casinoCategories.set(id, category);
    return category;
  }
  
  // Promotion operations
  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }
  
  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }
  
  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const id = this.promotionId++;
    const promotion: Promotion = { ...insertPromotion, id };
    this.promotions.set(id, promotion);
    return promotion;
  }
  
  // Betting slip operations
  async getBettingSlipItems(userId: number): Promise<BettingSlipItem[]> {
    return Array.from(this.bettingSlipItems.values()).filter(item => item.userId === userId);
  }
  
  async createBettingSlipItem(insertItem: InsertBettingSlipItem): Promise<BettingSlipItem> {
    const id = this.bettingSlipItemId++;
    const item: BettingSlipItem = { 
      ...insertItem, 
      id, 
      isSettled: false,
      result: undefined
    };
    this.bettingSlipItems.set(id, item);
    return item;
  }
  
  async updateBettingSlipItem(id: number, amount: number): Promise<BettingSlipItem | undefined> {
    const item = this.bettingSlipItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, amount };
    this.bettingSlipItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeBettingSlipItem(id: number): Promise<boolean> {
    return this.bettingSlipItems.delete(id);
  }
}

export const storage = new MemStorage();
