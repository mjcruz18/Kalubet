/**
 * Una API de tragamonedas de código abierto
 * Esta API simula un sistema de tragamonedas con características realistas
 */

// Tipos de símbolos disponibles
export type SlotSymbol = {
  id: string;
  name: string;
  symbol: string;
  value: number;
  isSpecial: boolean;
  multiplier?: number;
};

// Configuración de una línea de pago
export type PayLine = {
  id: number;
  positions: number[];
  multiplier: number;
};

// Resultado de un giro
export type SpinResult = {
  grid: SlotSymbol[][];
  winningLines: WinningLine[];
  totalWin: number;
  isJackpot: boolean;
};

// Línea ganadora
export type WinningLine = {
  payLineId: number;
  symbols: SlotSymbol[];
  win: number;
};

// Catálogo de símbolos disponibles
const SYMBOLS: SlotSymbol[] = [
  { id: 'cherry', name: 'Cherry', symbol: '🍒', value: 5, isSpecial: false },
  { id: 'lemon', name: 'Lemon', symbol: '🍋', value: 10, isSpecial: false },
  { id: 'orange', name: 'Orange', symbol: '🍊', value: 15, isSpecial: false },
  { id: 'watermelon', name: 'Watermelon', symbol: '🍉', value: 20, isSpecial: false },
  { id: 'grapes', name: 'Grapes', symbol: '🍇', value: 25, isSpecial: false },
  { id: 'bell', name: 'Bell', symbol: '🔔', value: 30, isSpecial: false },
  { id: 'seven', name: 'Seven', symbol: '7️⃣', value: 77, isSpecial: false },
  { id: 'diamond', name: 'Diamond', symbol: '💎', value: 50, isSpecial: false },
  { id: 'jackpot', name: 'Jackpot', symbol: '💰', value: 100, isSpecial: true },
  { id: 'wild', name: 'Wild', symbol: '⭐', value: 0, isSpecial: true, multiplier: 2 },
  { id: 'scatter', name: 'Scatter', symbol: '🎲', value: 0, isSpecial: true, multiplier: 1 },
];

// Catálogo de líneas de pago
const PAYLINES: PayLine[] = [
  // Horizontales
  { id: 1, positions: [0, 1, 2, 3, 4], multiplier: 1 },
  { id: 2, positions: [5, 6, 7, 8, 9], multiplier: 1 },
  { id: 3, positions: [10, 11, 12, 13, 14], multiplier: 1 },
  
  // Diagonales
  { id: 4, positions: [0, 6, 12, 8, 4], multiplier: 1.5 },
  { id: 5, positions: [10, 6, 2, 8, 14], multiplier: 1.5 },
  
  // Formas en V
  { id: 6, positions: [0, 5, 10, 5, 0], multiplier: 2 },
  { id: 7, positions: [4, 9, 14, 9, 4], multiplier: 2 },
  
  // Zigzags
  { id: 8, positions: [0, 6, 2, 8, 4], multiplier: 2.5 },
  { id: 9, positions: [10, 6, 12, 8, 14], multiplier: 2.5 },
];

/**
 * Clase SlotMachine para simular una máquina de tragamonedas
 */
export class SlotMachine {
  private rows: number;
  private cols: number;
  private symbols: SlotSymbol[];
  private payLines: PayLine[];
  private jackpotValue: number;
  private wildcardMultiplier: number;
  
  constructor(
    rows: number = 3,
    cols: number = 5,
    jackpotValue: number = 1000,
    wildcardMultiplier: number = 2,
    symbols: SlotSymbol[] = SYMBOLS,
    payLines: PayLine[] = PAYLINES
  ) {
    this.rows = rows;
    this.cols = cols;
    this.symbols = symbols;
    this.payLines = payLines;
    this.jackpotValue = jackpotValue;
    this.wildcardMultiplier = wildcardMultiplier;
  }
  
  /**
   * Genera un símbolo aleatorio
   */
  private getRandomSymbol(): SlotSymbol {
    // Los símbolos raros tienen menor probabilidad
    const rarityFactor = Math.random();
    let symbolPool: SlotSymbol[];
    
    if (rarityFactor < 0.03) {
      // 3% de probabilidad de símbolos muy raros (jackpot)
      symbolPool = this.symbols.filter(s => s.isSpecial && s.id === 'jackpot');
    } else if (rarityFactor < 0.10) {
      // 7% de probabilidad de símbolos especiales (wild, scatter)
      symbolPool = this.symbols.filter(s => s.isSpecial && s.id !== 'jackpot');
    } else if (rarityFactor < 0.40) {
      // 30% de probabilidad de símbolos de alto valor
      symbolPool = this.symbols.filter(s => !s.isSpecial && s.value >= 30);
    } else {
      // 60% de probabilidad de símbolos comunes
      symbolPool = this.symbols.filter(s => !s.isSpecial && s.value < 30);
    }
    
    // Si por alguna razón no hay símbolos en el grupo seleccionado, usar todos
    if (symbolPool.length === 0) symbolPool = this.symbols;
    
    return symbolPool[Math.floor(Math.random() * symbolPool.length)];
  }
  
  /**
   * Verifica si una línea tiene combinación ganadora
   */
  private checkPayLine(grid: SlotSymbol[][], payLine: PayLine): WinningLine | null {
    const positions = payLine.positions;
    const lineSymbols: SlotSymbol[] = positions.map(pos => {
      const row = Math.floor(pos / this.cols);
      const col = pos % this.cols;
      return grid[row][col];
    });
    
    // Obtener el primer símbolo que no sea wildcard para comparar
    const firstNonWildSymbol = lineSymbols.find(s => s.id !== 'wild') || lineSymbols[0];
    
    // Contar matches (incluyendo wildcards)
    let matchingCount = 0;
    let containsWildcard = false;
    
    for (let symbol of lineSymbols) {
      if (symbol.id === 'wild') {
        matchingCount++;
        containsWildcard = true;
      } else if (symbol.id === firstNonWildSymbol.id) {
        matchingCount++;
      } else {
        break; // Romper la secuencia al primer símbolo diferente
      }
    }
    
    // Debe haber al menos 3 símbolos iguales para ganar
    if (matchingCount >= 3) {
      let win = firstNonWildSymbol.value * matchingCount * payLine.multiplier;
      
      // Aplicar multiplicador de wildcard si hay uno en la línea
      if (containsWildcard) {
        win *= this.wildcardMultiplier;
      }
      
      return {
        payLineId: payLine.id,
        symbols: lineSymbols.slice(0, matchingCount),
        win: win
      };
    }
    
    return null;
  }
  
  /**
   * Verifica si hay jackpot (toda la cuadrícula con símbolos jackpot)
   */
  private checkJackpot(grid: SlotSymbol[][]): boolean {
    let jackpotCount = 0;
    const totalCells = this.rows * this.cols;
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (grid[row][col].id === 'jackpot') {
          jackpotCount++;
        }
      }
    }
    
    // Jackpot si al menos el 80% de la cuadrícula tiene símbolos jackpot
    return jackpotCount >= Math.floor(totalCells * 0.8);
  }
  
  /**
   * Realiza un giro en la máquina
   */
  public spin(): SpinResult {
    // Generar cuadrícula de símbolos
    const grid: SlotSymbol[][] = [];
    for (let row = 0; row < this.rows; row++) {
      const rowSymbols: SlotSymbol[] = [];
      for (let col = 0; col < this.cols; col++) {
        rowSymbols.push(this.getRandomSymbol());
      }
      grid.push(rowSymbols);
    }
    
    // Verificar líneas ganadoras
    const winningLines: WinningLine[] = [];
    for (const payLine of this.payLines) {
      const result = this.checkPayLine(grid, payLine);
      if (result) {
        winningLines.push(result);
      }
    }
    
    // Calcular ganancia total
    const totalWin = winningLines.reduce((total, line) => total + line.win, 0);
    
    // Verificar jackpot
    const isJackpot = this.checkJackpot(grid);
    const finalWin = isJackpot ? this.jackpotValue : totalWin;
    
    return {
      grid,
      winningLines,
      totalWin: finalWin,
      isJackpot
    };
  }
  
  /**
   * Obtiene todas las líneas de pago
   */
  public getPayLines(): PayLine[] {
    return this.payLines;
  }
  
  /**
   * Obtiene todos los símbolos disponibles
   */
  public getSymbols(): SlotSymbol[] {
    return this.symbols;
  }
  
  /**
   * Obtiene el valor actual del jackpot
   */
  public getJackpotValue(): number {
    return this.jackpotValue;
  }
  
  /**
   * Establece un nuevo valor para el jackpot
   */
  public setJackpotValue(value: number): void {
    this.jackpotValue = value;
  }
  
  /**
   * Aumenta el valor del jackpot por un porcentaje de la apuesta
   */
  public incrementJackpot(betAmount: number, percentage: number = 0.1): number {
    this.jackpotValue += Math.floor(betAmount * percentage);
    return this.jackpotValue;
  }
}

// Exportar una instancia por defecto
export const defaultSlotMachine = new SlotMachine();

// Funciones helper para acceder a la API desde cualquier componente
export const getSlotSymbols = () => defaultSlotMachine.getSymbols();
export const getPayLines = () => defaultSlotMachine.getPayLines();
export const spinSlotMachine = () => defaultSlotMachine.spin();
export const getJackpotValue = () => defaultSlotMachine.getJackpotValue();
export const incrementJackpot = (bet: number) => defaultSlotMachine.incrementJackpot(bet);