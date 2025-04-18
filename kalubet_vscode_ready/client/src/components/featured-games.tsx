import { useQuery } from '@tanstack/react-query';
import { Game } from '@shared/schema';
import { KaluBetButton } from './ui/kalubet-button';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturedGames: React.FC = () => {
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/featured'],
  });

  return (
    <section id="casino" className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-[#f5f5f5]">
          Featured <span className="text-[#e6b64c]">Games</span>
        </h2>
        <a href="#" className="text-[#e6b64c] text-sm hover:underline flex items-center">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="bg-[#0a1c3e] border-[#173776]">
              <div className="h-48 bg-[#173776] animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-[#173776] animate-pulse mb-2 w-3/4"></div>
                <div className="h-4 bg-[#173776] animate-pulse mb-4"></div>
                <div className="h-10 bg-[#173776] animate-pulse w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="game-card bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776]"
            >
              <div className="relative">
                <img 
                  src={game.imageUrl} 
                  alt={game.name} 
                  className="w-full h-48 object-cover" 
                />
                {game.isFeatured && (
                  <Badge className="absolute top-2 right-2 bg-[#e6b64c] text-[#050d1d]">
                    FEATURED
                  </Badge>
                )}
                {game.isPopular && (
                  <Badge className="absolute top-2 right-2 bg-[#e74c3c] text-white">
                    POPULAR
                  </Badge>
                )}
                {game.isNew && (
                  <Badge className="absolute top-2 right-2 bg-[#e6b64c] text-[#050d1d]">
                    NEW
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-montserrat font-bold text-[#f5f5f5] mb-2">{game.name}</h3>
                <p className="text-sm text-gray-300 mb-4">{game.description}</p>
                <KaluBetButton className="w-full">PLAY NOW</KaluBetButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedGames;
