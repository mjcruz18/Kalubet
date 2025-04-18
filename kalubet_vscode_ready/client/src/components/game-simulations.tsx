import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KaluBetButton } from './ui/kalubet-button';
import PokerGame from '@/games/poker/poker-game';
import BlackjackGame from '@/games/blackjack/blackjack-game';
import RouletteGame from '@/games/roulette/roulette-game';
import VideoSlots from '@/components/games/VideoSlots';
import AdvancedSlots from '@/components/games/AdvancedSlots';

const GameSimulations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('poker');
  
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-[#f5f5f5]">
          Try Our <span className="text-[#e6b64c]">Games</span>
        </h2>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="hidden md:block"
        >
          <TabsList className="bg-[#0a1c3e]">
            <TabsTrigger 
              value="poker" 
              className={`text-sm ${activeTab === 'poker' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}`}
            >
              Video Poker
            </TabsTrigger>
            <TabsTrigger 
              value="blackjack" 
              className={`text-sm ${activeTab === 'blackjack' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}`}
            >
              Video Blackjack
            </TabsTrigger>
            <TabsTrigger 
              value="roulette" 
              className={`text-sm ${activeTab === 'roulette' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}`}
            >
              Video Roulette
            </TabsTrigger>
            <TabsTrigger 
              value="slots" 
              className={`text-sm ${activeTab === 'slots' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}`}
            >
              Video Slots
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="bg-[#0a1c3e] rounded-lg overflow-hidden shadow-lg border border-[#173776] p-4 md:p-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="md:hidden mb-4"
        >
          <TabsList className="bg-[#050d1d] w-full grid grid-cols-4">
            <TabsTrigger 
              value="poker" 
              className={activeTab === 'poker' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}
            >
              Poker
            </TabsTrigger>
            <TabsTrigger 
              value="blackjack" 
              className={activeTab === 'blackjack' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}
            >
              Blackjack
            </TabsTrigger>
            <TabsTrigger 
              value="roulette" 
              className={activeTab === 'roulette' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}
            >
              Roulette
            </TabsTrigger>
            <TabsTrigger 
              value="slots" 
              className={activeTab === 'slots' ? 'text-[#e6b64c]' : 'text-[#f5f5f5]'}
            >
              Slots
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap -mx-2">
          <TabsContent value="poker" className="w-full px-2 mb-4 lg:mb-0">
            <PokerGame />
          </TabsContent>
          
          <TabsContent value="blackjack" className="w-full px-2 mb-4 lg:mb-0">
            <BlackjackGame />
          </TabsContent>
          
          <TabsContent value="roulette" className="w-full px-2 mb-4 lg:mb-0">
            <RouletteGame />
          </TabsContent>
          
          <TabsContent value="slots" className="w-full px-2">
            <AdvancedSlots />
          </TabsContent>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <KaluBetButton size="lg">
          PLAY FULL VERSION
        </KaluBetButton>
      </div>
    </section>
  );
};

export default GameSimulations;
