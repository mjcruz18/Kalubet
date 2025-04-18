import { KaluBetButton } from './ui/kalubet-button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative mb-12 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1c3e] to-transparent z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1607872106376-2119be88ce55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
        alt="Casino de Los Santos" 
        className="w-full h-80 object-cover object-center"
      />
      
      <div className="absolute z-20 inset-0 flex flex-col justify-center text-white p-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-[#f5f5f5] mb-4">
          WELCOME TO<br/><span className="text-[#e6b64c]">KALUBET</span>
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-xl">
          The best online gaming experience inspired by Los Santos
        </p>
        <div className="flex flex-wrap gap-3">
          <KaluBetButton>PLAY NOW</KaluBetButton>
          <KaluBetButton variant="secondary">REGISTER</KaluBetButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
