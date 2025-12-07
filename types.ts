export interface AlarmState {
  time: string; // HH:MM
  isActive: boolean;
  label?: string;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  description: string;
  humidity: string;
  windSpeed: string;
  sources: { uri: string; title: string }[];
}

export interface Lap {
  id: number;
  totalTime: number;
  splitTime: number;
  lapNumber: number;
}

export interface GuessRecord {
  value: number;
  result: 'High' | 'Low' | 'Correct';
}

export interface WordData {
  word: string;
  hint: string;
}

export interface LetterTile {
  id: string;
  char: string;
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
  rate: number;
}