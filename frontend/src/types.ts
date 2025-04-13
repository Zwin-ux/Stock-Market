export type CommandType = 
  | 'BUY' 
  | 'SELL' 
  | 'CHART' 
  | 'ANALYZE'
  | 'PORTFOLIO'
  | 'NEWS';

export interface Command {
  type: CommandType;
  params: Record<string, string>;
}
