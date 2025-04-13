export interface CommandHandler {
  command: string;
  description: string;
  handler: (...args: string[]) => Promise<string | object>;
}

export interface DataPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  
  // Data fetching capabilities
  canFetchStockData: boolean;
  canFetchCryptoData: boolean;
  canFetchEconomicData: boolean;
  
  // Methods
  fetchStockData?: (symbol: string, period: string) => Promise<any>;
  fetchCryptoData?: (symbol: string, period: string) => Promise<any>;
  fetchEconomicIndicator?: (indicator: string) => Promise<any>;
  
  // Command registration
  registerCommands?: () => CommandHandler[];
  
  // Initialization
  initialize: (config: any) => Promise<void>;
}

export type Plugin = DataPlugin;
