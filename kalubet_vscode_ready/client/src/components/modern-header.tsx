import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import logo from '@assets/Kalubet.jpg';

const ModernHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#050d1d] sticky top-0 z-50 border-b border-[#173776]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src={logo} alt="KaluBET" className="h-10 object-contain" />
          </Link>

          {/* Navegación para escritorio */}
          <nav className="hidden lg:flex space-x-8">
            <NavItem href="/" label="Inicio" />
            <NavDropdown 
              label="Deportes" 
              items={[
                { label: 'Fútbol', href: '/sports/football' },
                { label: 'Baloncesto', href: '/sports/basketball' },
                { label: 'Tenis', href: '/sports/tennis' },
                { label: 'MMA/UFC', href: '/sports/mma' },
                { label: 'Motor', href: '/sports/motor' },
              ]} 
            />
            <NavDropdown 
              label="Casino" 
              items={[
                { label: 'Tragamonedas', href: '/casino/slots' },
                { label: 'Ruleta', href: '/casino/roulette' },
                { label: 'Blackjack', href: '/casino/blackjack' },
                { label: 'Video Poker', href: '/casino/video-poker' },
                { label: 'Baccarat', href: '/casino/baccarat' },
              ]} 
            />
            <NavItem href="/live" label="En Vivo" isHot />
            <NavItem href="/promotions" label="Promociones" />
          </nav>

          {/* Botones de acción */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-[#e6b64c] text-[#e6b64c] hover:bg-[#e6b64c]/10"
            >
              Ingresar
            </Button>
            <Button 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
            >
              Registrarse
            </Button>
          </div>

          {/* Botón de menú móvil */}
          <div className="lg:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0a1c3e] border-t border-[#173776]">
          <div className="container mx-auto px-4 py-3">
            <div className="space-y-1">
              <MobileNavItem href="/" label="Inicio" />
              <MobileNavItem href="/sports" label="Deportes" />
              <MobileNavItem href="/casino" label="Casino" />
              <MobileNavItem href="/live" label="En Vivo" />
              <MobileNavItem href="/promotions" label="Promociones" />
            </div>
            <div className="mt-4 flex flex-col space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-[#e6b64c] text-[#e6b64c] hover:bg-[#e6b64c]/10"
              >
                Ingresar
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Componente de ítem de navegación
const NavItem: React.FC<{ href: string; label: string; isHot?: boolean }> = ({ 
  href, 
  label,
  isHot = false
}) => (
  <Link href={href}>
    <a className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium relative">
      {label}
      {isHot && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          LIVE
        </span>
      )}
    </a>
  </Link>
);

// Componente de ítem de navegación móvil
const MobileNavItem: React.FC<{ href: string; label: string }> = ({ 
  href, 
  label
}) => (
  <Link href={href}>
    <a className="block text-gray-300 hover:text-white hover:bg-[#173776] transition-colors px-3 py-2 rounded-md">
      {label}
    </a>
  </Link>
);

// Componente de dropdown de navegación
const NavDropdown: React.FC<{ 
  label: string; 
  items: { label: string; href: string }[]
}> = ({ label, items }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium flex items-center outline-none">
        {label}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-[#0a1c3e] border-[#173776] text-white" align="start">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <DropdownMenuItem className="cursor-pointer hover:bg-[#173776] focus:bg-[#173776]">
            {item.label}
          </DropdownMenuItem>
        </Link>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ModernHeader;