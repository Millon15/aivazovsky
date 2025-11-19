export interface Painting {
  id: string;
  title: string;
  year: number;
  description: string;
  significance: string;
  aestheticScore: number; // 1-100, for charting
  dimensions: string;
  location: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}