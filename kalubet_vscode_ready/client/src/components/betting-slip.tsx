import React, { useState } from 'react';
import { X, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Tipos de datos
interface BettingItem {
  id: number;
  type: 'sport' | 'casino';
  event: string;
  selection: string;
  odds: number;
  stake: number;
}

interface BettingSlipProps {
  visible: boolean;
  onClose: () => void;
}

const BettingSlip: React.FC<BettingSlipProps> = ({ visible, onClose }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<BettingItem[]>([
    {
      id: 1,
      type: 'sport',
      event: 'Real Madrid vs Barcelona',
      selection: 'Real Madrid',
      odds: 2.5,
      stake: 100
    },
    {
      id: 2,
      type: 'sport',
      event: 'Los Santos Warriors vs Vice City Heat',
      selection: 'Los Santos Warriors',
      odds: 1.75,
      stake: 200
    },
    {
      id: 3,
      type: 'casino',
      event: 'Ruleta',
      selection: 'Rojo',
      odds: 2.0,
      stake: 50
    }
  ]);
  
  // Calcular total apostado y potencial ganancia
  const totalStake = items.reduce((sum, item) => sum + item.stake, 0);
  const potentialWin = items.reduce((sum, item) => sum + (item.stake * item.odds), 0);
  
  // Eliminar un ítem
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Apuesta eliminada",
      description: "Se ha eliminado la selección de tu boleta.",
    });
  };
  
  // Actualizar la cantidad apostada
  const updateStake = (id: number, value: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, stake: value } : item
    ));
  };
  
  // Ajustar stake con botones +/-
  const adjustStake = (id: number, amount: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newStake = Math.max(1, item.stake + amount);
        return { ...item, stake: newStake };
      }
      return item;
    }));
  };
  
  // Realizar apuesta
  const placeBet = () => {
    if (items.length === 0) {
      toast({
        title: "Boleta vacía",
        description: "Debes agregar selecciones a tu boleta para realizar una apuesta.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "¡Apuesta realizada!",
      description: `Has apostado $${totalStake.toFixed(2)} con una ganancia potencial de $${potentialWin.toFixed(2)}`,
    });
    
    // Reiniciar boleta después de apostar
    setItems([]);
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-b from-[#050d1d] to-[#0a1c3e] border-[#173776] text-white shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#0a1c3e] to-[#173776] pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Boleta de Apuestas</CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="text-gray-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Tu boleta está vacía.</p>
                <p>Selecciona eventos para agregar a tu boleta.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div 
                    key={item.id}
                    className="bg-[#173776]/30 rounded-lg p-3 border border-[#173776]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge 
                          variant="outline" 
                          className={`mb-1 ${
                            item.type === 'sport' 
                              ? 'bg-blue-600/30 text-blue-300 border-blue-500' 
                              : 'bg-purple-600/30 text-purple-300 border-purple-500'
                          }`}
                        >
                          {item.type === 'sport' ? 'Deportes' : 'Casino'}
                        </Badge>
                        <h4 className="font-medium text-sm">{item.event}</h4>
                        <p className="text-gray-300 text-xs">{item.selection}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[#e6b64c] font-bold">{item.odds.toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => adjustStake(item.id, -50)}
                        className="text-gray-400 hover:text-white"
                        disabled={item.stake <= 50}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={item.stake}
                        onChange={(e) => updateStake(item.id, parseInt(e.target.value) || 0)}
                        className="mx-2 bg-[#050d1d] border-[#173776] text-white text-center h-8"
                      />
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => adjustStake(item.id, 50)}
                        className="text-gray-400 hover:text-white"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      
                      <span className="ml-2 text-sm text-gray-300">
                        Gan: ${(item.stake * item.odds).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {items.length > 0 && (
              <div className="mt-4 space-y-2">
                <Separator className="bg-[#173776]" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Tipo de boleta:</span>
                  <span className="font-medium">Simple</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Total apostado:</span>
                  <span className="font-medium">${totalStake.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Ganancia potencial:</span>
                  <span className="font-bold text-[#e6b64c]">${potentialWin.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="bg-[#173776]/30 p-4">
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold"
              onClick={placeBet}
              disabled={items.length === 0}
            >
              REALIZAR APUESTA
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BettingSlip;