import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCcw, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import {
  SlotMachine,
  SpinResult,
  SlotSymbol,
  PayLine,
  spinSlotMachine,
  getSlotSymbols,
  getPayLines,
  getJackpotValue,
  incrementJackpot
} from '@/lib/slotsAPI';

const AdvancedSlots: React.FC = () => {
  const { toast } = useToast();
  const [spinning, setSpinning] = useState(false);
  const [credits, setCredits] = useState(1000);
  const [bet, setBet] = useState(10);
  const [jackpot, setJackpot] = useState(getJackpotValue());
  const [lastWin, setLastWin] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [muted, setMuted] = useState(false);
  const [payTableVisible, setPayTableVisible] = useState(false);
  const [symbols] = useState<SlotSymbol[]>(getSlotSymbols());
  const [payLines] = useState<PayLine[]>(getPayLines());
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [spinHistory, setSpinHistory] = useState<Array<{win: number, bet: number, timestamp: Date}>>([]);
  const [tab, setTab] = useState<string>('game');
  
  // Referencias para sonidos
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const jackpotSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Crear elementos de audio
    spinSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
    winSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
    jackpotSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/344/344-preview.mp3');
    
    return () => {
      // Limpiar audio al desmontar
      if (spinSoundRef.current) spinSoundRef.current.pause();
      if (winSoundRef.current) winSoundRef.current.pause();
      if (jackpotSoundRef.current) jackpotSoundRef.current.pause();
    };
  }, []);
  
  // Función para reproducir sonido
  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (!muted && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.error("Error playing sound:", err));
    }
  };
  
  // Función para manejar el incremento/decremento de apuesta
  const adjustBet = (amount: number) => {
    const newBet = Math.max(1, Math.min(100, bet + amount));
    setBet(newBet);
  };
  
  // Función para girar los rodillos
  const spin = async () => {
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
    
    // Reproducir sonido de giro
    playSound(spinSoundRef);
    
    // Incrementar jackpot
    const newJackpot = incrementJackpot(bet);
    setJackpot(newJackpot);
    
    // Simular tiempo de giro
    setTimeout(() => {
      // Obtener resultado
      const result = spinSlotMachine();
      setSpinResult(result);
      
      // Manejar resultado
      if (result.isJackpot) {
        setLastWin(result.totalWin);
        setCredits(prev => prev + result.totalWin);
        
        playSound(jackpotSoundRef);
        
        toast({
          title: "¡¡¡JACKPOT!!!",
          description: `¡GANASTE ${result.totalWin} CRÉDITOS!`,
          variant: "destructive",
        });
        
        // Resetear jackpot después de ganar
        setJackpot(1000);
      } else if (result.totalWin > 0) {
        setLastWin(result.totalWin);
        setCredits(prev => prev + result.totalWin);
        
        playSound(winSoundRef);
        
        toast({
          title: "¡Ganaste!",
          description: `Has ganado ${result.totalWin} créditos`,
          variant: "default",
        });
      }
      
      // Guardar en historial
      setSpinHistory(prev => [
        { win: result.totalWin, bet, timestamp: new Date() },
        ...prev.slice(0, 9) // Mantener solo los últimos 10 giros
      ]);
      
      setSpinning(false);
      
      // Continuar con autoplay si está activado
      if (autoPlay && credits - bet >= 0) {
        setTimeout(() => spin(), 1500);
      }
    }, 1000);
  };
  
  // Función para añadir créditos (demo)
  const addCredits = () => {
    setCredits(prev => prev + 1000);
    toast({
      title: "Créditos añadidos",
      description: "Se han añadido 1000 créditos a tu cuenta.",
    });
  };
  
  // Renderizar la cuadrícula de tragamonedas
  const renderSlotGrid = () => {
    if (!spinResult) {
      // Grid inicial
      return (
        <div className="grid grid-cols-5 gap-2">
          {Array(15).fill(0).map((_, index) => (
            <div 
              key={index}
              className="h-20 w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-4xl shadow-inner border border-gray-700"
            >
              {spinning ? 
                <Loader2 className="h-10 w-10 animate-spin text-yellow-400" /> : 
                symbols[index % symbols.length].symbol
              }
            </div>
          ))}
        </div>
      );
    }
    
    // Grid con resultados
    return (
      <div className="grid grid-cols-5 gap-2">
        {spinResult.grid.flat().map((symbol, index) => {
          // Verificar si este símbolo es parte de una línea ganadora
          const isWinningSymbol = spinResult.winningLines.some(line => 
            line.symbols.includes(symbol)
          );
          
          return (
            <div 
              key={index}
              className={`h-20 w-full ${
                isWinningSymbol 
                  ? 'bg-gradient-to-br from-yellow-700 to-amber-900 border-yellow-500 animate-pulse' 
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
              } rounded-lg flex items-center justify-center text-4xl shadow-inner border-2`}
            >
              {spinning ? 
                <Loader2 className="h-10 w-10 animate-spin text-yellow-400" /> : 
                symbol.symbol
              }
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="bg-gradient-to-r from-gray-800 to-gray-900 p-1 rounded-t-lg border-b border-gray-700">
        <TabsTrigger 
          value="game" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
        >
          Juego
        </TabsTrigger>
        <TabsTrigger 
          value="paytable" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
        >
          Tabla de Pagos
        </TabsTrigger>
        <TabsTrigger 
          value="history" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
        >
          Historial
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="game" className="mt-0">
        <Card className="border-0 shadow-2xl bg-gradient-to-b from-gray-900 to-black rounded-t-none">
          <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-extrabold tracking-tight">
                KaluBET Máquina Tragamonedas
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMuted(!muted)}
                className="text-white"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
            <div className="flex justify-center animate-pulse">
              <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-4 py-1 rounded-full font-bold">
                JACKPOT: {jackpot.toLocaleString()} 🏆
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            {/* Cuadrícula de tragamonedas */}
            <div className="mb-4 bg-gradient-to-b from-black to-gray-900 p-4 rounded-lg border border-gray-800">
              {renderSlotGrid()}
            </div>
            
            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-lg text-center border border-gray-700">
                <p className="text-yellow-500 font-bold">CRÉDITOS</p>
                <p className="text-white text-2xl font-bold">{credits}</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-lg text-center border border-gray-700">
                <p className="text-yellow-500 font-bold">APUESTA</p>
                <div className="flex items-center justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                    onClick={() => adjustBet(-5)}
                    disabled={spinning || bet <= 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <p className="text-white text-2xl font-bold">{bet}</p>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                    onClick={() => adjustBet(5)}
                    disabled={spinning || bet >= 100}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-lg text-center border border-gray-700">
                <p className="text-yellow-500 font-bold">ÚLTIMA GANANCIA</p>
                <p className={`text-2xl font-bold ${lastWin > 0 ? 'text-green-500' : 'text-white'}`}>
                  {lastWin}
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-wrap justify-center gap-4 pb-6">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-600 hover:to-amber-600 text-lg font-bold px-8"
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
              className="bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-500/10"
              onClick={() => setAutoPlay(!autoPlay)}
              disabled={spinning || credits < bet}
            >
              {autoPlay ? 'Detener Auto' : 'Auto Play'}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent text-green-400 border-green-400 hover:bg-green-500/10"
              onClick={addCredits}
            >
              Añadir Créditos
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="paytable" className="mt-0">
        <Card className="border-0 shadow-2xl bg-gradient-to-b from-gray-900 to-black rounded-t-none">
          <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              Tabla de Pagos
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-3">Símbolos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {symbols.map(symbol => (
                  <div key={symbol.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center">
                    <span className="text-3xl mr-3">{symbol.symbol}</span>
                    <div>
                      <p className="text-white font-semibold">{symbol.name}</p>
                      {symbol.isSpecial ? (
                        <p className="text-yellow-400 text-sm">Especial</p>
                      ) : (
                        <p className="text-gray-400 text-sm">Valor: x{symbol.value}</p>
                      )}
                      {symbol.multiplier && (
                        <p className="text-green-400 text-sm">Mult: x{symbol.multiplier}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-3">Líneas de Pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payLines.map(line => (
                  <div key={line.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <p className="text-white font-semibold">Línea #{line.id}</p>
                    <p className="text-gray-400 text-sm">Multiplicador: x{line.multiplier}</p>
                    <div className="mt-2 grid grid-cols-5 gap-1">
                      {Array(15).fill(0).map((_, idx) => (
                        <div 
                          key={idx}
                          className={`h-6 w-full rounded ${
                            line.positions.includes(idx)
                              ? 'bg-yellow-500'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history" className="mt-0">
        <Card className="border-0 shadow-2xl bg-gradient-to-b from-gray-900 to-black rounded-t-none">
          <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              Historial de Juego
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {spinHistory.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No hay historial de juego todavía. ¡Comienza a jugar!</p>
            ) : (
              <div className="space-y-4">
                {spinHistory.map((spin, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      spin.win > 0 
                        ? 'bg-green-900/20 border-green-700' 
                        : 'bg-gray-800 border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">
                          {spin.win > 0 ? `Ganancia: ${spin.win}` : 'No hubo ganancia'}
                        </p>
                        <p className="text-gray-400 text-sm">Apuesta: {spin.bet}</p>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {spin.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdvancedSlots;