import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Game } from '@shared/schema';

const FeaturedGames: React.FC = () => {
  const { data: games, isLoading, error } = useQuery({
    queryKey: ['/api/games/featured'],
    staleTime: 60000
  });

  if (isLoading) {
    return (
      <section id="casino" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-montserrat font-bold text-white">
            Juegos <span className="text-[#e6b64c]">Destacados</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
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
      </section>
    );
  }

  if (error || !games) {
    return (
      <section id="casino" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-montserrat font-bold text-white">
            Juegos <span className="text-[#e6b64c]">Destacados</span>
          </h2>
        </div>
        <div className="bg-[#0a1c3e] p-6 rounded-lg text-center">
          <p className="text-red-400">Error al cargar los juegos destacados. Por favor, intente nuevamente más tarde.</p>
        </div>
      </section>
    );
  }

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
    <section id="casino" className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-white">
          Juegos <span className="text-[#e6b64c]">Destacados</span>
        </h2>
        <Link href="/casino">
          <a className="text-[#e6b64c] text-sm hover:underline">
            Ver todos <i className="fas fa-chevron-right ml-1"></i>
          </a>
        </Link>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {games.map((game: Game) => (
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
      </motion.div>
    </section>
  );
};

export default FeaturedGames;
