import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BettingSlip from '@/components/common/BettingSlip';
import { gameCategories } from '@/lib/games';
import { Game } from '@shared/schema';

const Casino: React.FC = () => {
  const [bettingSlipOpen, setBettingSlipOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: games, isLoading, error } = useQuery({
    queryKey: ['/api/games'],
    staleTime: 60000
  });

  const filteredGames = selectedCategory 
    ? games?.filter((game: Game) => game.type === selectedCategory)
    : games;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050d1d]">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-montserrat font-bold text-white mb-4">
            Casino <span className="text-[#e6b64c]">KaluBET</span>
          </h1>
          <p className="text-gray-300">
            Disfruta de la mejor experiencia de casino inspirada en Los Santos. 
            Contamos con una amplia variedad de juegos para todos los gustos.
          </p>
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-montserrat font-bold text-white mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-md transition ${
                selectedCategory === null 
                  ? 'bg-[#e6b64c] text-[#050d1d] font-bold' 
                  : 'bg-[#173776] text-white hover:bg-[#0a1c3e]'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </button>
            
            {gameCategories.map((category, index) => (
              <button 
                key={index}
                className={`px-4 py-2 rounded-md transition ${
                  selectedCategory === category.type 
                    ? 'bg-[#e6b64c] text-[#050d1d] font-bold' 
                    : 'bg-[#173776] text-white hover:bg-[#0a1c3e]'
                }`}
                onClick={() => setSelectedCategory(category.type)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Games Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] animate-pulse">
                <div className="h-48 bg-[#173776]"></div>
                <div className="p-4">
                  <div className="h-6 bg-[#173776] rounded mb-2"></div>
                  <div className="h-4 bg-[#173776] rounded mb-4"></div>
                  <div className="h-10 bg-[#173776] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-[#0a1c3e] p-6 rounded-lg text-center">
            <p className="text-red-400">Error al cargar los juegos. Por favor, intente nuevamente más tarde.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredGames?.map((game: Game) => (
              <motion.div 
                key={game.id}
                className="game-card bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] hover:border-[#e6b64c] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                variants={item}
              >
                <div className="relative">
                  <img 
                    src={game.imageUrl} 
                    alt={game.name} 
                    className="w-full h-48 object-cover"
                  />
                  {game.isFeatured && (
                    <div className="absolute top-2 right-2 bg-[#e6b64c] text-[#050d1d] text-xs font-bold py-1 px-2 rounded">
                      DESTACADO
                    </div>
                  )}
                  {game.isPopular && (
                    <div className="absolute top-2 right-2 bg-[#e74c3c] text-white text-xs font-bold py-1 px-2 rounded">
                      POPULAR
                    </div>
                  )}
                  {game.isNew && (
                    <div className="absolute top-2 right-2 bg-[#e6b64c] text-[#050d1d] text-xs font-bold py-1 px-2 rounded">
                      NUEVO
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-montserrat font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">{game.description}</p>
                  <Link href={`/game/${game.id}`}>
                    <a className="block w-full bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] py-2 rounded font-bold transition hover:opacity-90 text-center">
                      JUGAR AHORA
                    </a>
                  </Link>
                </div>
              </motion.div>
            ))}
            
            {filteredGames?.length === 0 && (
              <div className="col-span-full bg-[#0a1c3e] p-6 rounded-lg text-center">
                <p className="text-gray-300">No hay juegos disponibles en esta categoría.</p>
              </div>
            )}
          </motion.div>
        )}
      </main>
      
      <BettingSlip 
        isOpen={bettingSlipOpen} 
        onClose={() => setBettingSlipOpen(false)} 
      />
      
      <Footer />
    </div>
  );
};

export default Casino;
