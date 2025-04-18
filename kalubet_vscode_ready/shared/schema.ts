import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  balance: integer("balance").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Games table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'poker', 'blackjack', 'roulette', 'slots', etc.
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isPopular: boolean("is_popular").default(false),
  isNew: boolean("is_new").default(false),
});

// Sports categories
export const sportsCategories = pgTable("sports_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(), // FontAwesome icon name
  matchCount: integer("match_count").default(0),
});

// Sports matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  sportsCategoryId: integer("sports_category_id").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  startTime: timestamp("start_time").notNull(),
  isLive: boolean("is_live").default(false),
  score: text("score"),
  league: text("league").notNull(),
  odds: jsonb("odds").notNull(), // JSON with odds for different outcomes
});

// Winners
export const winners = pgTable("winners", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  amount: integer("amount").notNull(),
  game: text("game").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Casino categories
export const casinoCategories = pgTable("casino_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
});

// Promotions
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  validUntil: timestamp("valid_until"),
  condition: text("condition"),
  isFeatured: boolean("is_featured").default(false),
});

// Betting slip items
export const bettingSlipItems = pgTable("betting_slip_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  matchId: integer("match_id").notNull(),
  betType: text("bet_type").notNull(), // 'home', 'away', 'draw', etc.
  odds: text("odds").notNull(),
  amount: integer("amount"),
  isSettled: boolean("is_settled").default(false),
  result: text("result"), // 'win', 'loss', 'void'
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export const insertSportsCategorySchema = createInsertSchema(sportsCategories).omit({
  id: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export const insertWinnerSchema = createInsertSchema(winners).omit({
  id: true,
  timestamp: true,
});

export const insertCasinoCategorySchema = createInsertSchema(casinoCategories).omit({
  id: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
});

export const insertBettingSlipItemSchema = createInsertSchema(bettingSlipItems).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertSportsCategory = z.infer<typeof insertSportsCategorySchema>;
export type SportsCategory = typeof sportsCategories.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertWinner = z.infer<typeof insertWinnerSchema>;
export type Winner = typeof winners.$inferSelect;

export type InsertCasinoCategory = z.infer<typeof insertCasinoCategorySchema>;
export type CasinoCategory = typeof casinoCategories.$inferSelect;

export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Promotion = typeof promotions.$inferSelect;

export type InsertBettingSlipItem = z.infer<typeof insertBettingSlipItemSchema>;
export type BettingSlipItem = typeof bettingSlipItems.$inferSelect;
