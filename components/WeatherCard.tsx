import React from 'react';
import { WeatherData } from '../types';
import { 
  Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, 
  Thermometer, ArrowLeft, ExternalLink, CloudLightning 
} from 'lucide-react';
import { Button } from './Button';

interface WeatherCardProps {
  data: WeatherData;
  onBack: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, onBack }) => {
  // Simple logic to pick an icon based on condition text
  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="w-24 h-24 text-sky-400" />;
    if (c.includes('snow') || c.includes('ice')) return <CloudSnow className="w-24 h-24 text-white" />;
    if (c.includes('storm') || c.includes('thunder')) return <CloudLightning className="w-24 h-24 text-yellow-400" />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="w-24 h-24 text-gray-400" />;
    if (c.includes('wind')) return <Wind className="w-24 h-24 text-teal-300" />;
    return <Sun className="w-24 h-24 text-yellow-400" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <Button 
        variant="outline" 
        onClick={onBack} 
        className="mb-6 border-sky-500/30 text-sky-300 hover:bg-sky-500/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Search Again
      </Button>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        {/* Main Weather Section */}
        <div className="p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-500/10 to-transparent pointer-events-none" />
          
          <h2 className="text-3xl font-bold text-white mb-2 relative z-10">{data.location}</h2>
          <p className="text-sky-200 mb-8 relative z-10">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="flex flex-col items-center justify-center gap-6 mb-8 relative z-10">
            <div className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse-slow">
              {getIcon(data.condition)}
            </div>
            <div className="text-7xl font-bold tracking-tighter text-white">
              {data.temperature}
            </div>
            <div className="text-2xl font-medium text-sky-200">
              {data.condition}
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-lg mx-auto leading-relaxed relative z-10">
            {data.description}
          </p>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 border-t border-sky-500/20 bg-slate-900/40">
          <div className="p-6 border-r border-sky-500/20 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <Droplets className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Humidity</span>
            </div>
            <span className="text-xl font-bold">{data.humidity}</span>
          </div>
          <div className="p-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <Wind className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Wind</span>
            </div>
            <span className="text-xl font-bold">{data.windSpeed}</span>
          </div>
        </div>

        {/* Sources / Grounding */}
        {data.sources.length > 0 && (
          <div className="p-4 bg-slate-950/50 border-t border-sky-500/20 text-xs text-slate-500">
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
              <span className="font-semibold text-slate-400">Sources:</span>
              {data.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-sky-400 transition-colors"
                >
                  {source.title} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
