import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Button } from './Button';
import { Lap } from '../types';

export const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  // Persist state
  useEffect(() => {
    const savedTime = localStorage.getItem('stopwatch-time');
    const savedLaps = localStorage.getItem('stopwatch-laps');
    if (savedTime) setTime(parseInt(savedTime, 10));
    if (savedLaps) setLaps(JSON.parse(savedLaps));
  }, []);

  useEffect(() => {
    let intervalId: any;
    if (isRunning) {
      const start = Date.now() - time;
      intervalId = setInterval(() => {
        setTime(Date.now() - start);
      }, 10);
    } else {
      // Save state when stopped
      if (time > 0) {
        localStorage.setItem('stopwatch-time', time.toString());
      }
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    localStorage.removeItem('stopwatch-time');
    localStorage.removeItem('stopwatch-laps');
  };

  const handleLap = () => {
    const lastLapTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const newLap: Lap = {
      id: Date.now(),
      totalTime: time,
      splitTime: time - lastLapTotal,
      lapNumber: laps.length + 1
    };
    const updatedLaps = [newLap, ...laps];
    setLaps(updatedLaps);
    localStorage.setItem('stopwatch-laps', JSON.stringify(updatedLaps));
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return {
      min: minutes.toString().padStart(2, '0'),
      sec: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0')
    };
  };

  const t = formatTime(time);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-full max-h-[90vh]">
      {/* Timer Display */}
      <div className="flex-none pt-8 pb-8 flex flex-col items-center justify-center relative">
        <div className="w-72 h-72 rounded-full border-4 border-slate-800 bg-slate-900/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative backdrop-blur-sm">
          {/* Progress Ring Animation (Decorative) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-800"/>
             <circle 
              cx="50" cy="50" r="48" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeDasharray="301.59"
              strokeDashoffset={301.59 - ((time % 60000) / 60000) * 301.59}
              className={`text-indigo-500 transition-all duration-75 ${!isRunning && time === 0 ? 'opacity-0' : 'opacity-100'}`}
              strokeLinecap="round"
            />
          </svg>

          <div className="text-center z-10 font-mono">
            <div className="text-6xl font-bold tracking-wider text-white flex items-baseline justify-center">
              <span>{t.min}</span>
              <span className="mx-1 text-slate-500">:</span>
              <span>{t.sec}</span>
            </div>
            <div className="text-3xl text-indigo-400 font-medium mt-1">
              .{t.ms}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-none flex justify-center gap-8 mb-8">
        {!isRunning && time === 0 ? (
           <Button variant="circle" onClick={handleStartStop} className="bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500/20 hover:scale-105">
             <Play size={32} className="ml-1" />
           </Button>
        ) : (
          <>
            <Button 
              variant="circle" 
              onClick={isRunning ? handleLap : handleReset}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              {isRunning ? <Flag size={28} /> : <RotateCcw size={28} />}
            </Button>
            
            <Button 
              variant="circle" 
              onClick={handleStartStop}
              className={`${isRunning 
                ? 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20' 
                : 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500/20'}`}
            >
              {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </Button>
          </>
        )}
      </div>

      {/* Laps List */}
      <div className="flex-1 overflow-hidden flex flex-col bg-slate-900/30 rounded-t-3xl border-t border-slate-800 backdrop-blur-md">
        <div className="flex justify-between px-8 py-4 border-b border-slate-800 text-xs font-semibold uppercase tracking-widest text-slate-500">
          <span>Lap No.</span>
          <span>Split</span>
          <span>Total</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {laps.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
              <Flag size={24} className="opacity-20" />
              <span className="text-sm">No laps recorded</span>
            </div>
          ) : (
            <div className="space-y-1">
              {laps.map((lap, index) => {
                 const split = formatTime(lap.splitTime);
                 const total = formatTime(lap.totalTime);
                 // Determine if this is the fastest or slowest lap (basic logic)
                 // This requires finding min/max in the whole array, for simplicity we just list them
                 return (
                   <div key={lap.id} className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-white/5 transition-colors font-mono text-sm border border-transparent hover:border-white/5 animate-in slide-in-from-bottom-2 duration-300">
                      <span className="text-slate-400 w-16">#{lap.lapNumber.toString().padStart(2, '0')}</span>
                      <span className="text-slate-300">{split.min}:{split.sec}.{split.ms}</span>
                      <span className="text-white font-medium">{total.min}:{total.sec}.{total.ms}</span>
                   </div>
                 );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
