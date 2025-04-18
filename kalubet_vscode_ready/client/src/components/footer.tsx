import React from 'react';
import { Link } from 'wouter';
import logo from '@assets/Kalubet.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050d1d] border-t border-[#173776] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <img 
              src={logo} 
              alt="KaluBET Logo" 
              className="h-12 mb-4 object-contain" 
            />
            <p className="mb-4 text-gray-400 max-w-md">
              KaluBET es la plataforma líder de apuestas en Los Santos, ofreciendo la mejor experiencia 
              en juegos de casino y apuestas deportivas con los mejores momios y promociones.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon="facebook" />
              <SocialIcon icon="twitter" />
              <SocialIcon icon="instagram" />
              <SocialIcon icon="youtube" />
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <FooterLink href="/" label="Inicio" />
              <FooterLink href="/sports" label="Deportes" />
              <FooterLink href="/casino" label="Casino" />
              <FooterLink href="/live" label="En vivo" />
              <FooterLink href="/promotions" label="Promociones" />
            </ul>
          </div>

          {/* Juegos populares */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Juegos Populares</h3>
            <ul className="space-y-2">
              <FooterLink href="/casino/slots" label="Tragamonedas" />
              <FooterLink href="/casino/roulette" label="Ruleta" />
              <FooterLink href="/casino/blackjack" label="Blackjack" />
              <FooterLink href="/casino/video-poker" label="Video Poker" />
              <FooterLink href="/sports/football" label="Fútbol" />
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Soporte</h3>
            <ul className="space-y-2">
              <FooterLink href="/help" label="Ayuda" />
              <FooterLink href="/faq" label="Preguntas Frecuentes" />
              <FooterLink href="/contact" label="Contacto" />
              <FooterLink href="/terms" label="Términos y Condiciones" />
              <FooterLink href="/responsible-gaming" label="Juego Responsable" />
            </ul>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="mt-12 pt-6 border-t border-[#173776]">
          <h3 className="text-lg font-semibold mb-4 text-white">Métodos de Pago</h3>
          <div className="flex flex-wrap gap-4">
            <PaymentMethod name="Visa" />
            <PaymentMethod name="Mastercard" />
            <PaymentMethod name="PayPal" />
            <PaymentMethod name="Bitcoin" />
            <PaymentMethod name="Ethereum" />
            <PaymentMethod name="Bank Transfer" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-[#173776] text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} KaluBET. Todos los derechos reservados.</p>
          <p className="mt-2">
            KaluBET promueve el juego responsable. Debes tener al menos 18 años para jugar.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Componente de enlace de pie de página
const FooterLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <li>
    <Link href={href}>
      <a className="text-gray-400 hover:text-white transition-colors">
        {label}
      </a>
    </Link>
  </li>
);

// Componente de icono social
const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'facebook':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753c0-.249 1.51-2.772 1.818-4.013z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12s0 3.95-.5 5.85a3.02 3.02 0 0 1-2.12 2.15c-1.8.49-8.75.5-9.34.5-.59 0-7.54-.02-9.34-.5a3.02 3.02 0 0 1-2.12-2.15C0 15.95 0 12 0 12s0-3.95.5-5.85a3.02 3.02 0 0 1 2.12-2.15c1.8-.49 8.75-.5 9.34-.5zm-2.28 9.38l6.17-3.6v.01l-6.17-3.6v7.19z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a 
      href="#" 
      className="w-10 h-10 rounded-full bg-[#173776] hover:bg-[#2a4e99] flex items-center justify-center text-white transition-colors"
    >
      {getIcon()}
    </a>
  );
};

// Componente de método de pago
const PaymentMethod: React.FC<{ name: string }> = ({ name }) => {
  const getIcon = () => {
    // Emoji simplificado para cada método de pago
    switch (name) {
      case 'Visa':
        return '💳';
      case 'Mastercard':
        return '💳';
      case 'PayPal':
        return '📱';
      case 'Bitcoin':
        return '₿';
      case 'Ethereum':
        return 'Ξ';
      case 'Bank Transfer':
        return '🏦';
      default:
        return '💰';
    }
  };

  return (
    <div className="w-16 h-10 bg-[#173776] rounded flex items-center justify-center text-white">
      <div className="flex flex-col items-center">
        <span className="text-lg">{getIcon()}</span>
        <span className="text-xs truncate">{name}</span>
      </div>
    </div>
  );
};

export default Footer;