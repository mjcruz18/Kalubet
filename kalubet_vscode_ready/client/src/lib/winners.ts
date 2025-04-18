import { createWebSocketConnection } from './utils';

export interface Winner {
  id: number;
  userId: number;
  username: string;
  gameType: string;
  amount: number;
  createdAt: Date;
}

class WinnersService {
  private ws: WebSocket | null = null;
  private listeners: Array<(winners: Winner[]) => void> = [];
  private winners: Winner[] = [];
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 3000;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      this.ws = createWebSocketConnection();
      
      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.connected = true;
        this.reconnectAttempts = 0;
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'winners') {
            // Update winners list
            this.winners = data.data.map((winner: any) => ({
              ...winner,
              createdAt: new Date(winner.createdAt)
            }));
            this.notifyListeners();
          } else if (data.type === 'newWinner') {
            // Add new winner to the list
            const newWinner = {
              ...data.data,
              createdAt: new Date(data.data.createdAt)
            };
            
            this.winners = [newWinner, ...this.winners].slice(0, 20);
            this.notifyListeners();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.connected = false;
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket connection:', error);
    }
  }
  
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.initialize();
      }, this.reconnectTimeout);
    } else {
      console.error('Maximum reconnect attempts reached. Giving up.');
    }
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.winners));
  }
  
  public fetchWinners(): Promise<Winner[]> {
    return fetch('/api/winners')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch winners');
        }
        return response.json();
      })
      .then(data => {
        this.winners = data.map((winner: any) => ({
          ...winner,
          createdAt: new Date(winner.createdAt)
        }));
        this.notifyListeners();
        return this.winners;
      })
      .catch(error => {
        console.error('Error fetching winners:', error);
        return this.winners;
      });
  }
  
  public getWinners(): Winner[] {
    return this.winners;
  }
  
  public addListener(callback: (winners: Winner[]) => void): () => void {
    this.listeners.push(callback);
    
    // If we already have winners, notify immediately
    if (this.winners.length > 0) {
      callback(this.winners);
    } else {
      // Otherwise fetch them
      this.fetchWinners();
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  public cleanup(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners = [];
  }
}

export const winnersService = new WinnersService();
