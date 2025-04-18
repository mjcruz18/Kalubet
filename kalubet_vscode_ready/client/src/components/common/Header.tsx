import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import WinnersTicker from './WinnersTicker';
import kaluBetLogo from '@assets/Kalubet.jpg';

const Header: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isLinkActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-[#0a1c3e] border-b border-[#e6b64c] sticky top-0 z-50">
      {/* Winners Ticker */}
      <WinnersTicker />
      
      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <img src={kaluBetLogo} alt="KaluBET" className="h-10 mr-2" />
            </a>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/">
            <a className={isLinkActive("/") ? "text-[#e6b64c]" : "text-white hover:text-[#e6b64c] transition"}>
              INICIO
            </a>
          </Link>
          <Link href="/casino">
            <a className={isLinkActive("/casino") ? "text-[#e6b64c]" : "text-white hover:text-[#e6b64c] transition"}>
              CASINO
            </a>
          </Link>
          <Link href="/sports">
            <a className={isLinkActive("/sports") ? "text-[#e6b64c]" : "text-white hover:text-[#e6b64c] transition"}>
              DEPORTES
            </a>
          </Link>
          <Link href="/promotions">
            <a className={isLinkActive("/promotions") ? "text-[#e6b64c]" : "text-white hover:text-[#e6b64c] transition"}>
              PROMOCIONES
            </a>
          </Link>
          <Link href="/help">
            <a className={isLinkActive("/help") ? "text-[#e6b64c]" : "text-white hover:text-[#e6b64c] transition"}>
              AYUDA
            </a>
          </Link>
        </nav>
        
        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <button className="hidden sm:block bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-4 py-2 rounded font-bold text-sm transition hover:opacity-90">
            INGRESO
          </button>
          <button className="hidden sm:block bg-[#050d1d] border border-[#e6b64c] text-[#e6b64c] px-4 py-2 rounded font-bold text-sm transition hover:bg-[#e6b64c] hover:text-[#050d1d]">
            REGISTRO
          </button>
          <button 
            className="md:hidden text-white hover:text-[#e6b64c] transition"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-[#0a1c3e] border-t border-[#e6b64c] pb-4 px-4`}>
        <div className="flex flex-col space-y-3 mt-3">
          <Link href="/">
            <a className={`py-2 px-3 ${isLinkActive("/") ? "bg-[#173776] text-[#e6b64c]" : ""} rounded font-medium hover:bg-[#173776]`}>
              INICIO
            </a>
          </Link>
          <Link href="/casino">
            <a className={`py-2 px-3 ${isLinkActive("/casino") ? "bg-[#173776] text-[#e6b64c]" : ""} rounded font-medium hover:bg-[#173776]`}>
              CASINO
            </a>
          </Link>
          <Link href="/sports">
            <a className={`py-2 px-3 ${isLinkActive("/sports") ? "bg-[#173776] text-[#e6b64c]" : ""} rounded font-medium hover:bg-[#173776]`}>
              DEPORTES
            </a>
          </Link>
          <Link href="/promotions">
            <a className={`py-2 px-3 ${isLinkActive("/promotions") ? "bg-[#173776] text-[#e6b64c]" : ""} rounded font-medium hover:bg-[#173776]`}>
              PROMOCIONES
            </a>
          </Link>
          <Link href="/help">
            <a className={`py-2 px-3 ${isLinkActive("/help") ? "bg-[#173776] text-[#e6b64c]" : ""} rounded font-medium hover:bg-[#173776]`}>
              AYUDA
            </a>
          </Link>
          <div className="flex space-x-2 mt-2">
            <button className="flex-1 bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] px-4 py-2 rounded font-bold text-sm transition hover:opacity-90">
              INGRESO
            </button>
            <button className="flex-1 bg-[#050d1d] border border-[#e6b64c] text-[#e6b64c] px-4 py-2 rounded font-bold text-sm transition hover:bg-[#e6b64c] hover:text-[#050d1d]">
              REGISTRO
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
