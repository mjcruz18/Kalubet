import React from 'react';
import { Link } from 'wouter';
import kaluBetLogo from '@assets/Kalubet.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a1c3e] border-t border-[#e6b64c] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src={kaluBetLogo} alt="KaluBET" className="h-10 mb-4" />
            <p className="text-sm text-gray-400 mb-4">La mejor plataforma de juegos de casino y apuestas deportivas en Los Santos.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#e6b64c] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-[#e6b64c] transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-[#e6b64c] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-[#e6b64c] transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[#e6b64c] font-montserrat font-bold mb-4">Juegos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/casino/roulette"><a className="text-white hover:text-[#e6b64c] transition">Ruleta</a></Link></li>
              <li><Link href="/casino/blackjack"><a className="text-white hover:text-[#e6b64c] transition">Blackjack</a></Link></li>
              <li><Link href="/casino/poker"><a className="text-white hover:text-[#e6b64c] transition">Póker</a></Link></li>
              <li><Link href="/casino/slots"><a className="text-white hover:text-[#e6b64c] transition">Tragamonedas</a></Link></li>
              <li><Link href="/casino/live"><a className="text-white hover:text-[#e6b64c] transition">Casino en Vivo</a></Link></li>
              <li><Link href="/sports"><a className="text-white hover:text-[#e6b64c] transition">Apuestas Deportivas</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#e6b64c] font-montserrat font-bold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help"><a className="text-white hover:text-[#e6b64c] transition">Centro de Ayuda</a></Link></li>
              <li><Link href="/terms"><a className="text-white hover:text-[#e6b64c] transition">Términos y Condiciones</a></Link></li>
              <li><Link href="/privacy"><a className="text-white hover:text-[#e6b64c] transition">Política de Privacidad</a></Link></li>
              <li><Link href="/responsible-gaming"><a className="text-white hover:text-[#e6b64c] transition">Juego Responsable</a></Link></li>
              <li><Link href="/contact"><a className="text-white hover:text-[#e6b64c] transition">Contacto</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#e6b64c] font-montserrat font-bold mb-4">Información de Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-[#e6b64c]"></i>
                <span className="text-white">Vinewood Boulevard 123, Los Santos</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-2 text-[#e6b64c]"></i>
                <span className="text-white">+1 555-KALUBET</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-2 text-[#e6b64c]"></i>
                <span className="text-white">contacto@kalubet.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[#173776] text-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} KaluBET. Todos los derechos reservados. Juega responsablemente. Solo para mayores de 18 años.</p>
          <div className="flex justify-center mt-4 space-x-4">
            {/* Payment method icons */}
            <i className="fab fa-cc-visa text-gray-300 text-2xl"></i>
            <i className="fab fa-cc-mastercard text-gray-300 text-2xl"></i>
            <i className="fab fa-cc-paypal text-gray-300 text-2xl"></i>
            <i className="fab fa-bitcoin text-gray-300 text-2xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
