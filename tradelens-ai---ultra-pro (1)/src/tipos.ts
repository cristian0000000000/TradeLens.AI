
export enum Bias {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export interface NewsEvent {
  event: string;
  timeRelative: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TradePlan {
  id: string;
  timestamp: number;
  pair: string;
  bias: Bias;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  confidenceScore: number;
  positionSize?: string;
  marketStructure: string;
  confluenceVerdict: string;
  keyZones: string[];
  reasoning: string[];
  patterns: string[];
  nearbyNews: NewsEvent[];
  imageUrl: string;
  secondaryImageUrl?: string;
}

export interface JournalEntry extends TradePlan {
  status: 'PENDING' | 'WON' | 'LOST' | 'CLOSED';
  notes?: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  previous?: string;
  forecast?: string;
}
