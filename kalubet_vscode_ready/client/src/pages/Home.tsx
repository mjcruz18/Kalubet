import ModernHero from "@/components/modern-hero";
import FeaturedGames from "@/components/featured-games";
import SportsBetting from "@/components/sports-betting";
import CasinoCategories from "@/components/casino-categories";
import GameSimulations from "@/components/game-simulations";
import Promotions from "@/components/promotions";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <ModernHero />
      <div className="container mx-auto px-4 py-12">
        <FeaturedGames />
        <SportsBetting />
        <CasinoCategories />
        <GameSimulations />
        <Promotions />
      </div>
    </div>
  );
};

export default Home;
