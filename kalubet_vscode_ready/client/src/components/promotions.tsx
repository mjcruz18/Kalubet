import { useQuery } from '@tanstack/react-query';
import { Promotion } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KaluBetButton } from './ui/kalubet-button';

const Promotions: React.FC = () => {
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/promotions'],
  });

  return (
    <section id="promociones" className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-[#f5f5f5]">
          Special <span className="text-[#e6b64c]">Promotions</span>
        </h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="bg-[#0a1c3e] animate-pulse h-48 rounded-lg"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Card 
              key={promo.id} 
              className={`${
                promo.isFeatured 
                  ? 'bg-gradient-to-br from-[#0a1c3e] to-[#173776] border-[#e6b64c] golden-border' 
                  : 'bg-[#0a1c3e] border-[#173776]'
              } rounded-lg overflow-hidden shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-montserrat font-bold text-[#e6b64c]">{promo.title}</h3>
                  {promo.isFeatured && (
                    <Badge className="bg-[#e6b64c] text-[#050d1d]">FEATURED</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-6">{promo.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {promo.condition}
                  </span>
                  <KaluBetButton 
                    variant={promo.isFeatured ? "primary" : "secondary"}
                    size="sm"
                  >
                    CLAIM
                  </KaluBetButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default Promotions;
