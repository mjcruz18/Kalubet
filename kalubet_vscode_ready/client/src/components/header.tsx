import { useState } from "react";
import { Link } from "wouter";
import Logo from "./logo";
import WinnersTicker from "./winners-ticker";
import { KaluBetButton } from "./ui/kalubet-button";
import { MenuIcon, X } from "lucide-react";

interface HeaderProps {
  onBettingSlipToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBettingSlipToggle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
            <a className="cursor-pointer">
              <Logo />
            </a>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/">
            <a className="text-[#e6b64c] hover:text-[#d4a438] transition">HOME</a>
          </Link>
          <Link href="#casino">
            <a className="text-[#f5f5f5] hover:text-[#e6b64c] transition">CASINO</a>
          </Link>
          <Link href="#deportes">
            <a className="text-[#f5f5f5] hover:text-[#e6b64c] transition">SPORTS</a>
          </Link>
          <Link href="#promociones">
            <a className="text-[#f5f5f5] hover:text-[#e6b64c] transition">PROMOTIONS</a>
          </Link>
          <Link href="#ayuda">
            <a className="text-[#f5f5f5] hover:text-[#e6b64c] transition">HELP</a>
          </Link>
        </nav>
        
        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <KaluBetButton className="hidden sm:block" size="sm">LOGIN</KaluBetButton>
          <KaluBetButton className="hidden sm:block" variant="secondary" size="sm">REGISTER</KaluBetButton>
          <button 
            className="md:hidden text-[#f5f5f5] hover:text-[#e6b64c] transition"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-[#0a1c3e] border-t border-[#e6b64c] pb-4 px-4`}>
        <div className="flex flex-col space-y-3 mt-3">
          <Link href="/">
            <a className="py-2 px-3 bg-[#173776] rounded text-[#e6b64c] font-medium">HOME</a>
          </Link>
          <Link href="#casino">
            <a className="py-2 px-3 hover:bg-[#173776] rounded transition">CASINO</a>
          </Link>
          <Link href="#deportes">
            <a className="py-2 px-3 hover:bg-[#173776] rounded transition">SPORTS</a>
          </Link>
          <Link href="#promociones">
            <a className="py-2 px-3 hover:bg-[#173776] rounded transition">PROMOTIONS</a>
          </Link>
          <Link href="#ayuda">
            <a className="py-2 px-3 hover:bg-[#173776] rounded transition">HELP</a>
          </Link>
          <div className="flex space-x-2 mt-2">
            <KaluBetButton className="flex-1">LOGIN</KaluBetButton>
            <KaluBetButton className="flex-1" variant="secondary">REGISTER</KaluBetButton>
          </div>
          <button
            className="py-2 px-3 rounded bg-[#173776] text-center text-[#f5f5f5] mt-2"
            onClick={onBettingSlipToggle}
          >
            BETTING SLIP
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
