import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const HeroSection: React.FC = () => {
  return (
    <section className="relative mb-12 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1c3e] to-transparent z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1607872106376-2119be88ce55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
        alt="Casino de Los Santos" 
        className="w-full h-80 object-cover object-center"
      />
      
      <motion.div 
        className="absolute z-20 inset-0 flex flex-col justify-center text-white p-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white mb-4">
          BIENVENIDO A<br />
          <span className="text-[#e6b64c]">KALUBET</span>
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-xl">
          La mejor experiencia de juego en línea inspirada en Los Santos
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/casino">
            <a className="bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-6 py-3 rounded-md font-bold transition hover:opacity-90">
              JUGAR AHORA
            </a>
          </Link>
          <button className="bg-[#173776] border border-[#e6b64c] text-[#e6b64c] px-6 py-3 rounded-md font-bold transition hover:bg-[#e6b64c] hover:text-[#050d1d]">
            REGISTRARSE
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
