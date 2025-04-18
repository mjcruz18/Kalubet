import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { gameCategories } from '@/lib/games';

const CasinoCategories: React.FC = () => {
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
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-white">
          Categorías de <span className="text-[#e6b64c]">Casino</span>
        </h2>
        <Link href="/casino">
          <a className="text-[#e6b64c] text-sm hover:underline">
            Ver todos <i className="fas fa-chevron-right ml-1"></i>
          </a>
        </Link>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {gameCategories.map((category, index) => (
          <motion.div 
            key={index}
            variants={item}
            whileHover={{ y: -5, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link href={`/casino/${category.type}`}>
              <a className="block group">
                <div className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] group-hover:border-[#e6b64c] transition">
                  <div className="relative">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050d1d] to-transparent"></div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-montserrat font-medium text-white group-hover:text-[#e6b64c] transition">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </a>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CasinoCategories;
