import { Card, CardContent } from "../components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#050d1d] to-[#0a1c3e] p-4">
      <div className="text-9xl font-bold text-[#e6b64c] mb-4">404</div>
      
      <Card className="w-full max-w-md bg-gradient-to-b from-[#0a1c3e] to-[#173776] border-[#173776] text-white">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-white">¡Página no encontrada!</h1>
          </div>

          <p className="mb-6 text-gray-300">
            Parece que has ingresado a un área que no existe en el casino.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {['🎰', '🎲', '🃏'].map((emoji, i) => (
              <div 
                key={i}
                className="aspect-square bg-[#173776] rounded-lg flex items-center justify-center text-3xl animate-pulse"
              >
                {emoji}
              </div>
            ))}
          </div>
          
          <a 
            href="/" 
            className="block w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold rounded-md text-center"
          >
            VOLVER AL CASINO
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
