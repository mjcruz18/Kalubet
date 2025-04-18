import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SportsCategory, Match } from '@shared/schema';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const SportsBetting: React.FC = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [addedBets, setAddedBets] = useState<Set<string>>(new Set());

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<SportsCategory[]>({
    queryKey: ['/api/sports/categories'],
  });

  const { data: featuredMatches = [], isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: [selectedCategory ? `/api/matches/category/${selectedCategory}` : '/api/matches'],
  });

  const addToBettingSlip = (match: Match, betType: string, odds: string) => {
    // In a real app, this would call an API to add to the betting slip
    const betKey = `${match.id}-${betType}`;
    
    if (addedBets.has(betKey)) {
      toast({
        title: "Already in betting slip",
        description: "This bet is already in your betting slip",
        variant: "destructive",
      });
      return;
    }
    
    setAddedBets(new Set([...addedBets, betKey]));
    
    toast({
      title: "Bet added",
      description: `Added ${match.homeTeam} vs ${match.awayTeam} - ${betType} (${odds})`,
    });
  };

  return (
    <section id="deportes" className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-[#f5f5f5]">
          Sports <span className="text-[#e6b64c]">Betting</span>
        </h2>
        <a href="#" className="text-[#e6b64c] text-sm hover:underline flex items-center">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      <Card className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sports Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-montserrat font-bold mb-4 text-[#f5f5f5]">Sports</h3>
            
            {categoriesLoading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-12 bg-[#173776] animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <a 
                    key={category.id}
                    href="#"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded transition",
                      selectedCategory === category.id 
                        ? "bg-[#173776] text-[#f5f5f5]" 
                        : "hover:bg-[#173776]"
                    )}
                  >
                    <span className="flex items-center">
                      <i className={`fas fa-${category.icon} mr-3`}></i>
                      {category.name}
                    </span>
                    <span className="bg-[#050d1d] rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {category.matchCount}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Column - Featured Matches */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-montserrat font-bold mb-4 text-[#f5f5f5]">Featured Matches</h3>
            
            {matchesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-32 bg-[#050d1d] animate-pulse rounded"></div>
                ))}
              </div>
            ) : featuredMatches.length === 0 ? (
              <p className="text-gray-400">No matches available for selected category</p>
            ) : (
              <div className="space-y-4">
                {featuredMatches.map((match) => (
                  <div key={match.id} className="bg-[#050d1d] rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{match.league}</span>
                      {match.isLive ? (
                        <span className="text-xs text-[#e6b64c]">LIVE</span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {new Date(match.startTime).toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="font-medium">{match.homeTeam}</span>
                        <span className="mx-2 text-[#e6b64c]">vs</span>
                        <span className="font-medium">{match.awayTeam}</span>
                      </div>
                      {match.isLive && match.score && (
                        <span className="text-xs text-gray-400">{match.score}</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(match.odds as Record<string, string>).map(([betType, odds]) => (
                        <button
                          key={betType}
                          onClick={() => addToBettingSlip(match, betType, odds)}
                          className="bg-[#0a1c3e] hover:bg-[#173776] p-2 rounded text-center transition"
                        >
                          <div className="text-xs text-gray-400">{betType}</div>
                          <div className="font-oswald text-lg">{odds}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default SportsBetting;
