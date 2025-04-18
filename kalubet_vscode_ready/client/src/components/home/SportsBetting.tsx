import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useBetting } from '@/context/BettingContext';
import { sportsCategories } from '@/lib/sportsData';
import { formatMatchTime } from '@/lib/sportsData';
import { Sport, Match } from '@/lib/sportsData';

const SportsBetting: React.FC = () => {
  const [activeSport, setActiveSport] = useState<string>("Fútbol");
  const { addBet } = useBetting();
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['/api/sports/events'],
    staleTime: 60000
  });

  const handleAddBet = (match: Match, selection: 'home' | 'draw' | 'away', odds: number) => {
    const selectionLabel = selection === 'home' 
      ? `Victoria ${match.homeTeam}` 
      : selection === 'away' 
        ? `Victoria ${match.awayTeam}` 
        : 'Empate';
        
    addBet({
      id: `sport-${match.id}-${selection}`,
      type: 'sport',
      event: `${match.homeTeam} vs ${match.awayTeam}`,
      category: `${match.sport} - ${match.league}`,
      selection,
      selectionLabel,
      odds,
      amount: 1000
    });
  };

  if (isLoading) {
    return (
      <section id="deportes" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-montserrat font-bold text-white">
            Apuestas <span className="text-[#e6b64c]">Deportivas</span>
          </h2>
        </div>
        <div className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] p-4 md:p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-[#173776] rounded mb-4 w-48"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-[#173776] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !events) {
    return (
      <section id="deportes" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-montserrat font-bold text-white">
            Apuestas <span className="text-[#e6b64c]">Deportivas</span>
          </h2>
        </div>
        <div className="bg-[#0a1c3e] p-6 rounded-lg text-center">
          <p className="text-red-400">Error al cargar los eventos deportivos. Por favor, intente nuevamente más tarde.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="deportes" className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-white">
          Apuestas <span className="text-[#e6b64c]">Deportivas</span>
        </h2>
        <Link href="/sports">
          <a className="text-[#e6b64c] text-sm hover:underline">
            Ver todos <i className="fas fa-chevron-right ml-1"></i>
          </a>
        </Link>
      </div>
      
      <div className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sports Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-montserrat font-bold mb-4 text-white">Deportes</h3>
            <div className="space-y-2">
              {sportsCategories.map((sport, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`flex items-center justify-between p-3 rounded ${
                    activeSport === sport.name
                      ? 'bg-[#173776] text-white'
                      : 'hover:bg-[#173776] transition text-white'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSport(sport.name);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    <i className={`fas fa-${sport.icon} mr-3`}></i>
                    {sport.name}
                  </span>
                  <span className="bg-[#050d1d] rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {sport.count}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Right Column - Featured Matches */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-montserrat font-bold mb-4 text-white">Partidos Destacados</h3>
            
            <div className="space-y-4">
              {events
                .filter((event: Match) => event.sport === activeSport || activeSport === 'Todos')
                .slice(0, 3)
                .map((match: Match) => (
                  <motion.div 
                    key={match.id}
                    className="bg-[#050d1d] rounded p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{match.sport} - {match.league}</span>
                      {match.isLive ? (
                        <span className="text-xs text-[#e6b64c]">EN VIVO</span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {formatMatchTime(match.startTime, match.isLive, match.currentMinute)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="font-medium">{match.homeTeam}</span>
                        <span className="mx-2 text-[#e6b64c]">vs</span>
                        <span className="font-medium">{match.awayTeam}</span>
                      </div>
                      {match.isLive && match.currentMinute && (
                        <span className="text-xs text-gray-400">{match.currentMinute}'</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        className="bg-[#0a1c3e] hover:bg-[#173776] p-2 rounded text-center transition"
                        onClick={() => handleAddBet(match, 'home', match.homeOdds)}
                      >
                        <div className="text-xs text-gray-400">1</div>
                        <div className="font-oswald text-lg">{match.homeOdds.toFixed(2)}</div>
                      </button>
                      
                      {match.drawOdds ? (
                        <button 
                          className="bg-[#0a1c3e] hover:bg-[#173776] p-2 rounded text-center transition"
                          onClick={() => handleAddBet(match, 'draw', match.drawOdds as number)}
                        >
                          <div className="text-xs text-gray-400">X</div>
                          <div className="font-oswald text-lg">{match.drawOdds.toFixed(2)}</div>
                        </button>
                      ) : (
                        <button 
                          className="bg-[#0a1c3e] hover:bg-[#173776] p-2 rounded text-center transition"
                        >
                          <div className="text-xs text-gray-400">Hándicap</div>
                          <div className="font-oswald text-lg">2.00</div>
                        </button>
                      )}
                      
                      <button 
                        className="bg-[#0a1c3e] hover:bg-[#173776] p-2 rounded text-center transition"
                        onClick={() => handleAddBet(match, 'away', match.awayOdds)}
                      >
                        <div className="text-xs text-gray-400">2</div>
                        <div className="font-oswald text-lg">{match.awayOdds.toFixed(2)}</div>
                      </button>
                    </div>
                  </motion.div>
                ))}

              {events.filter((event: Match) => event.sport === activeSport || activeSport === 'Todos').length === 0 && (
                <div className="bg-[#050d1d] rounded p-4 text-center">
                  <p className="text-gray-400">No hay partidos disponibles para {activeSport} en este momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SportsBetting;
