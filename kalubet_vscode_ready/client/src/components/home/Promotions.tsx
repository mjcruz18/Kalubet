import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PromotionProps {
  title: string;
  description: string;
  validUntil?: string;
  minDeposit?: string;
  onlyForNew?: boolean;
  isHighlighted?: boolean;
}

const PromotionCard: React.FC<PromotionProps> = ({ 
  title, 
  description, 
  validUntil, 
  minDeposit, 
  onlyForNew, 
  isHighlighted 
}) => {
  return (
    <motion.div 
      className={`rounded-lg overflow-hidden shadow-lg transition duration-300 hover:shadow-xl ${
        isHighlighted 
          ? 'bg-gradient-to-br from-[#0a1c3e] to-[#173776] border border-[#e6b64c] golden-border' 
          : 'bg-[#0a1c3e] border border-[#173776]'
      }`}
      whileHover={{ y: -5 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-montserrat font-bold text-[#e6b64c]">{title}</h3>
          {isHighlighted && (
            <span className="bg-[#e6b64c] text-[#050d1d] text-xs font-bold py-1 px-2 rounded">
              DESTACADO
            </span>
          )}
        </div>
        <p className="text-sm text-gray-300 mb-6">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {validUntil ? `Válido hasta: ${validUntil}` : 
             minDeposit ? `Depósito mínimo: ${minDeposit}` : 
             onlyForNew ? 'Solo para nuevos usuarios' : ''}
          </span>
          <Button 
            className={isHighlighted 
              ? "bg-[#e6b64c] text-[#050d1d] hover:bg-[#d4a438]" 
              : "bg-[#173776] hover:bg-[#e6b64c] hover:text-[#050d1d] text-white border border-[#e6b64c]"}
          >
            RECLAMAR
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Promotions: React.FC = () => {
  const promotions: PromotionProps[] = [
    {
      title: 'Bono de Bienvenida',
      description: 'Regístrate hoy y recibe un bono del 100% en tu primer depósito hasta $100,000.',
      validUntil: '31/12/2023',
      isHighlighted: true
    },
    {
      title: 'Giros Gratis',
      description: 'Recibe 50 giros gratis en nuestras máquinas tragamonedas más populares.',
      minDeposit: '$5,000'
    },
    {
      title: 'Apuesta Sin Riesgo',
      description: 'Primera apuesta deportiva sin riesgo. Si pierdes, te devolvemos hasta $25,000.',
      onlyForNew: true
    }
  ];

  return (
    <section id="promociones" className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-white">
          Promociones <span className="text-[#e6b64c]">Especiales</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {promotions.map((promo, index) => (
          <PromotionCard
            key={index}
            {...promo}
          />
        ))}
      </div>
    </section>
  );
};

export default Promotions;
