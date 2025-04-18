import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";
import { insertWinnerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer });
  
  // Handle WebSocket connections
  wss.on("connection", (ws) => {
    console.log("Client connected");
    
    // Send initial data
    sendWinners(ws);
    
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
  
  // Function to send winners to a WebSocket client
  async function sendWinners(ws: any) {
    const winners = await storage.getRecentWinners(10);
    ws.send(JSON.stringify({
      type: "winners",
      data: winners
    }));
  }
  
  // Function to broadcast winners to all connected clients
  function broadcastWinners() {
    storage.getRecentWinners(10).then(winners => {
      wss.clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(JSON.stringify({
            type: "winners",
            data: winners
          }));
        }
      });
    });
  }
  
  // Set up interval to generate random winners
  setInterval(async () => {
    try {
      const games = ["Roulette", "Blackjack", "Poker", "Slots", "Sports Betting"];
      const names = ["Alex", "Maria", "John", "Sofia", "David", "Emma", "Michael", "Olivia"];
      
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomName = names[Math.floor(Math.random() * names.length)] + " " + 
                        String.fromCharCode(65 + Math.floor(Math.random() * 26)) + ".";
      const randomAmount = Math.floor(Math.random() * 900000) + 100000;
      
      const winner = await storage.createWinner({
        username: randomName,
        amount: randomAmount,
        game: randomGame
      });
      
      broadcastWinners();
    } catch (error) {
      console.error("Error generating random winner:", error);
    }
  }, 10000); // Generate a new winner every 10 seconds
  
  // API Routes
  app.get("/api/games/featured", async (req: Request, res: Response) => {
    try {
      const featuredGames = await storage.getFeaturedGames();
      res.json(featuredGames);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured games" });
    }
  });
  
  app.get("/api/games/:type", async (req: Request, res: Response) => {
    try {
      const games = await storage.getGamesByType(req.params.type);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Error fetching games by type" });
    }
  });
  
  app.get("/api/sports/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getSportsCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sports categories" });
    }
  });
  
  app.get("/api/matches", async (req: Request, res: Response) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching matches" });
    }
  });
  
  app.get("/api/matches/live", async (req: Request, res: Response) => {
    try {
      const liveMatches = await storage.getLiveMatches();
      res.json(liveMatches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching live matches" });
    }
  });
  
  app.get("/api/matches/category/:id", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      const matches = await storage.getMatchesBySportCategory(categoryId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching matches by category" });
    }
  });
  
  app.get("/api/winners/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const winners = await storage.getRecentWinners(limit);
      res.json(winners);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent winners" });
    }
  });
  
  app.post("/api/winners", async (req: Request, res: Response) => {
    try {
      const validateResult = insertWinnerSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid winner data", errors: validateResult.error.errors });
      }
      
      const winner = await storage.createWinner(validateResult.data);
      broadcastWinners();
      
      res.status(201).json(winner);
    } catch (error) {
      res.status(500).json({ message: "Error creating winner" });
    }
  });
  
  app.get("/api/casino/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCasinoCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching casino categories" });
    }
  });
  
  app.get("/api/promotions", async (req: Request, res: Response) => {
    try {
      const promotions = await storage.getPromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching promotions" });
    }
  });
  
  // Betting slip routes (these would normally require authentication)
  app.get("/api/betting-slip/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const items = await storage.getBettingSlipItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching betting slip items" });
    }
  });
  
  app.post("/api/betting-slip", async (req: Request, res: Response) => {
    try {
      // In a real app, we would validate the user is authenticated
      const item = await storage.createBettingSlipItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error adding betting slip item" });
    }
  });
  
  app.put("/api/betting-slip/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const amount = req.body.amount;
      
      const updatedItem = await storage.updateBettingSlipItem(id, amount);
      if (!updatedItem) {
        return res.status(404).json({ message: "Betting slip item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating betting slip item" });
    }
  });
  
  app.delete("/api/betting-slip/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.removeBettingSlipItem(id);
      
      if (!result) {
        return res.status(404).json({ message: "Betting slip item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing betting slip item" });
    }
  });

  return httpServer;
}
