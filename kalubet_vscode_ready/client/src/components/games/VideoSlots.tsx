import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCcw } from 'lucide-react';

// Array de símbolos para las tragamonedas
const SYMBOLS = [
  '🍒', '🍋', '🍊', '🍇', '7️⃣', '💎', '🔔', '💰', '⭐', '🍀'
];

// Configuración de líneas de pago
const PAYLINES = [
  // Horizontal
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  // Diagonal
  [0, 4, 8], [2, 4, 6]
];

// Tabla de pagos
const PAYTABLE: Record<string, number> = {
  '🍒🍒🍒': 5,
  '🍋🍋🍋': 10,
  '🍊🍊🍊': 15,
  '🍇🍇🍇': 20,
  '7️⃣7️⃣7️⃣': 77,
  '💎💎💎': 50,
  '🔔🔔🔔': 30,
  '💰💰💰': 100,
  '⭐⭐⭐': 40,
  '🍀🍀🍀': 25,
};

const VideoSlots = () => {
  const { toast } = useToast();
  const [reels, setReels] = useState<string[][]>([
    ['🍒', '🍋', '🍊'],
    ['🍇', '7️⃣', '💎'],
    ['🔔', '💰', '⭐']
  ]);
  const [spinning, setSpinning] = useState(false);
  const [credits, setCredits] = useState(100);
  const [bet, setBet] = useState(5);
  const [jackpot, setJackpot] = useState(1000);
  const [lastWin, setLastWin] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Función para generar un símbolo aleatorio
  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  // Función para verificar las líneas de pago
  const checkWin = (slots: string[]) => {
    let totalWin = 0;
    let winningLines = [];

    for (const line of PAYLINES) {
      const symbols = line.map(i => slots[i]);
      const lineString = symbols.join('');
      
      if (PAYTABLE[lineString]) {
        const win = PAYTABLE[lineString] * bet;
        totalWin += win;
        winningLines.push({ line, win });
      }
    }

    // Verificar jackpot (todos los símbolos iguales)
    const allSame = slots.every(symbol => symbol === slots[0]);
    if (allSame && slots[0] === '💰') {
      totalWin += jackpot;
      winningLines.push({ line: [0, 1, 2, 3, 4, 5, 6, 7, 8], win: jackpot });
      
      toast({
        title: "¡JACKPOT!",
        description: `¡Has ganado el jackpot de ${jackpot} créditos!`,
        variant: "destructive",
      });
      
      setJackpot(1000);
    } else {
      // Incrementar jackpot en cada giro sin jackpot
      setJackpot(prev => prev + Math.floor(bet * 0.1));
    }

    return { totalWin, winningLines };
  };

  // Función para girar los rodillos
  const spin = () => {
    if (credits < bet) {
      toast({
        title: "Créditos insuficientes",
        description: "No tienes suficientes créditos para apostar.",
        variant: "destructive",
      });
      setAutoPlay(false);
      return;
    }

    setSpinning(true);
    setCredits(prev => prev - bet);
    setLastWin(0);

    // Generar nuevos símbolos para los rodillos
    const newSlots: string[] = [];
    for (let i = 0; i < 9; i++) {
      newSlots.push(getRandomSymbol());
    }

    // Convertir array plano a matriz 3x3 para la visualización
    const newReels: string[][] = [
      [newSlots[0], newSlots[1], newSlots[2]],
      [newSlots[3], newSlots[4], newSlots[5]],
      [newSlots[6], newSlots[7], newSlots[8]]
    ];

    // Animar el giro
    setTimeout(() => {
      setReels(newReels);
      const { totalWin, winningLines } = checkWin(newSlots);
      
      if (totalWin > 0) {
        setLastWin(totalWin);
        setCredits(prev => prev + totalWin);
        
        toast({
          title: "¡Ganaste!",
          description: `Has ganado ${totalWin} créditos`,
          variant: "default",
        });
      }
      
      setSpinning(false);
      
      if (autoPlay && credits >= bet) {
        setTimeout(() => spin(), 1000);
      }
    }, 1000);
  };

  // Función para añadir créditos (demo)
  const addCredits = () => {
    setCredits(prev => prev + 100);
    toast({
      title: "Créditos añadidos",
      description: "Se han añadido 100 créditos a tu cuenta.",
    });
  };

  // Manejar el autoplay
  useEffect(() => {
    if (autoPlay && !spinning && credits >= bet) {
      const timer = setTimeout(() => spin(), 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, spinning, credits, bet]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-2xl bg-gradient-to-b from-indigo-900 to-indigo-950 border-2 border-yellow-400">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-t-lg">
          <CardTitle className="text-center text-3xl font-extrabold tracking-tight">
            KaluBET Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 grid grid-cols-3 gap-4 bg-gradient-to-b from-gray-900 to-black p-4 rounded-lg border-2 border-yellow-500">
            {reels.map((reel, reelIndex) => (
              <div key={reelIndex} className="flex flex-col">
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={`${reelIndex}-${symbolIndex}`}
                    className="h-24 flex items-center justify-center text-6xl bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg m-1 border border-yellow-600 shadow-inner"
                    style={{
                      transform: spinning ? 'translateY(20px)' : 'none',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    {spinning ? (
                      <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
                    ) : (
                      symbol
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-3 rounded-lg text-center border border-yellow-500">
              <p className="text-yellow-500 font-bold">CRÉDITOS</p>
              <p className="text-white text-2xl font-bold">{credits}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center border border-yellow-500">
              <p className="text-yellow-500 font-bold">APUESTA</p>
              <div className="flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                  onClick={() => setBet(Math.max(1, bet - 1))}
                  disabled={spinning}
                >
                  -
                </Button>
                <p className="text-white text-2xl font-bold">{bet}</p>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                  onClick={() => setBet(Math.min(50, bet + 1))}
                  disabled={spinning}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center border border-yellow-500">
              <p className="text-yellow-500 font-bold">ÚLTIMA GANANCIA</p>
              <p className="text-white text-2xl font-bold">{lastWin}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center border border-yellow-500">
              <p className="text-yellow-500 font-bold">JACKPOT</p>
              <p className="text-white text-2xl font-bold animate-pulse">{jackpot}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 text-lg font-bold px-8"
              onClick={spin}
              disabled={spinning || credits < bet}
            >
              {spinning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Girando...
                </>
              ) : (
                'GIRAR'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-gray-800 text-yellow-400 border-yellow-400 hover:bg-gray-700"
              onClick={() => setAutoPlay(!autoPlay)}
              disabled={spinning || credits < bet}
            >
              {autoPlay ? 'Detener Auto' : 'Auto Play'}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-gray-800 text-green-400 border-green-400 hover:bg-gray-700"
              onClick={addCredits}
            >
              Añadir Créditos
            </Button>
          </div>
          
          <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-yellow-500">
            <h3 className="text-yellow-500 font-bold mb-2 text-center">TABLA DE PAGOS</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-white">
              {Object.entries(PAYTABLE).map(([symbols, payout]) => (
                <div key={symbols} className="bg-gray-900 p-2 rounded">
                  <p>{symbols}</p>
                  <p className="text-yellow-400 font-bold">x{payout}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoSlots;