import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import WinnersTicker from '@/components/winners-ticker';
import logo from '@assets/Kalubet.jpg';

const ModernHero: React.FC = () => {
  return (
    <div className="w-full">
      {/* Banner de ganadores */}
      <div className="bg-gradient-to-r from-purple-900 via-violet-800 to-purple-900 py-1.5">
        <WinnersTicker />
      </div>
      
      {/* Hero principal */}
      <div className="bg-gradient-to-b from-[#050d1d] to-[#0a1c3e] py-16 md:py-20 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div 
            className="absolute w-64 h-64 rounded-full bg-blue-700/20 blur-3xl"
            animate={{
              x: [0, 100, 50, 0],
              y: [0, 50, 100, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-purple-700/20 blur-3xl"
            animate={{
              x: [0, -100, -50, 0],
              y: [0, 50, 100, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ top: '30%', right: '10%' }}
          />
          <motion.div 
            className="absolute w-80 h-80 rounded-full bg-yellow-500/10 blur-3xl"
            animate={{
              x: [0, 70, 0],
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ bottom: '10%', left: '20%' }}
          />
        </div>
        
        {/* Contenido del hero */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            {/* Columna izquierda con texto */}
            <div className="w-full md:w-1/2 md:pr-8 mb-10 md:mb-0 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
                  La <span className="text-[#e6b64c]">MEJOR</span> experiencia de apuestas en línea
                </h1>
                <p className="text-gray-300 mb-8 text-lg md:text-xl">
                  Disfruta de cientos de juegos de casino y apuestas deportivas
                  con las mejores cuotas en Los Santos.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button 
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold text-lg py-6 rounded-md shadow-lg"
                    size="lg"
                  >
                    JUGAR AHORA
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-2 border-[#e6b64c] text-[#e6b64c] hover:bg-[#e6b64c]/10 font-bold text-lg py-6"
                    size="lg"
                  >
                    REGISTRARSE
                  </Button>
                </div>
                
                <div className="mt-8 text-gray-400 flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Pago inmediato</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Soporte 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Seguridad garantizada</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Columna derecha con imagen */}
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-700 to-blue-700 rounded-lg p-1">
                  <div className="bg-gradient-to-b from-gray-900 to-black rounded-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/10 pointer-events-none" />
                    
                    <div className="flex justify-center mb-4">
                      <img 
                        src={logo} 
                        alt="KaluBET Logo" 
                        className="h-16 object-contain"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-md mb-4">
                      <h3 className="text-[#e6b64c] font-bold text-lg mb-1">¡Bono de bienvenida!</h3>
                      <p className="text-white text-xl font-bold mb-2">$25,000 + 250 Giros Gratis</p>
                      <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((game) => (
                        <div 
                          key={game} 
                          className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-md overflow-hidden flex items-center justify-center relative hover:scale-105 transition duration-200 cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-black/30" />
                          <span className="text-3xl">{
                            ['🎰', '🎲', '🎯', '🃏', '🏆', '🎮'][game - 1]
                          }</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <Button 
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold"
                      >
                        OBTENER BONO AHORA
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Efectos decorativos */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 blur-xl rounded-full -z-10 opacity-50" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-yellow-500 to-amber-500 blur-xl rounded-full -z-10 opacity-50" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;