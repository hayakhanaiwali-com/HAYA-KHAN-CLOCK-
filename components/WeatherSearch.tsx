import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './Button';

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-sky-200 to-sky-400 pb-2">
          Weather AI
        </h1>
        <p className="text-sky-200/60 text-lg">Real-time forecasts grounded in Google Search</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl shadow-2xl shadow-sky-900/20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 w-5 h-5" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g., Tokyo)"
              className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-sky-500/20 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-white placeholder-sky-500/40 text-lg"
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            disabled={!city.trim() || isLoading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white py-4 text-lg"
            isLoading={isLoading}
          >
            {isLoading ? 'Scanning Skies...' : 'Get Forecast'}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['London', 'New York', 'Tokyo', 'Sydney'].map((c) => (
            <button
              key={c}
              onClick={() => onSearch(c)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm rounded-full bg-slate-800/50 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
