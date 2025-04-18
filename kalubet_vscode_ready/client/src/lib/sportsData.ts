export interface Sport {
  name: string;
  icon: string;
  count: number;
}

export interface Match {
  id: number;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  isLive: boolean;
  currentMinute?: number;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
}

export const sportsCategories: Sport[] = [
  { name: "Fútbol", icon: "futbol", count: 24 },
  { name: "Baloncesto", icon: "basketball-ball", count: 18 },
  { name: "Béisbol", icon: "baseball-ball", count: 12 },
  { name: "Hockey", icon: "hockey-puck", count: 8 },
  { name: "MMA", icon: "fist-raised", count: 6 },
  { name: "Tenis", icon: "table-tennis", count: 14 }
];

// Mock featured matches for initial display
export const getFeaturedMatches = async (): Promise<Match[]> => {
  try {
    const response = await fetch('/api/sports/events');
    if (!response.ok) {
      throw new Error('Failed to fetch sports events');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured matches:', error);
    return [];
  }
};

// Get live matches
export const getLiveMatches = async (): Promise<Match[]> => {
  try {
    const response = await fetch('/api/sports/events/live');
    if (!response.ok) {
      throw new Error('Failed to fetch live sports events');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
};

// Get matches by sport
export const getMatchesBySport = async (sport: string): Promise<Match[]> => {
  try {
    const response = await fetch(`/api/sports/events?sport=${encodeURIComponent(sport)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${sport} events`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${sport} matches:`, error);
    return [];
  }
};

// Format time for display
export const formatMatchTime = (date: Date, isLive: boolean, currentMinute?: number): string => {
  if (isLive && currentMinute) {
    return `${currentMinute}'`;
  }
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const matchDate = new Date(date);
  
  if (matchDate.toDateString() === today.toDateString()) {
    return `Hoy, ${matchDate.getHours().toString().padStart(2, '0')}:${matchDate.getMinutes().toString().padStart(2, '0')}`;
  } else if (matchDate.toDateString() === tomorrow.toDateString()) {
    return `Mañana, ${matchDate.getHours().toString().padStart(2, '0')}:${matchDate.getMinutes().toString().padStart(2, '0')}`;
  } else {
    return `${matchDate.getDate()}/${matchDate.getMonth() + 1}, ${matchDate.getHours().toString().padStart(2, '0')}:${matchDate.getMinutes().toString().padStart(2, '0')}`;
  }
};
