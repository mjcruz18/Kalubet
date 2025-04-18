import { useQuery } from '@tanstack/react-query';
import { CasinoCategory } from '@shared/schema';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CasinoCategories: React.FC = () => {
  const { data: categories = [], isLoading } = useQuery<CasinoCategory[]>({
    queryKey: ['/api/casino/categories'],
  });

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-[#f5f5f5]">
          Casino <span className="text-[#e6b64c]">Categories</span>
        </h2>
        <a href="#" className="text-[#e6b64c] text-sm hover:underline flex items-center">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-48 bg-[#0a1c3e] animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <a key={category.id} href="#" className="block group">
              <Card className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] group-hover:border-[#e6b64c] transition">
                <div className="relative">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-32 object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050d1d] to-transparent"></div>
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-montserrat font-medium text-[#f5f5f5] group-hover:text-[#e6b64c] transition">
                    {category.name}
                  </h3>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

export default CasinoCategories;
