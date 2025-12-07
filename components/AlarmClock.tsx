import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Bell, BellOff, Clock, Timer, Moon, Sun } from 'lucide-react';

export const AlarmClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState<string>('07:00');
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Interval Ref to prevent multiple triggers in same minute if logic is imperfect
  const lastTriggeredRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      checkAlarm(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [alarmTime, isAlarmActive, isRinging]);

  const checkAlarm = (now: Date) => {
    if (!isAlarmActive || isRinging) return;

    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    if (currentTimeStr === alarmTime && lastTriggeredRef.current !== currentTimeStr) {
      triggerAlarm();
      lastTriggeredRef.current = currentTimeStr;
    }
  };

  const startSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      // Create oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      
      // Pulse volume for alarm effect
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      gain.gain.linearRampToValueAtTime(0.5, now + 1.0);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);
      
      // Loop the beeping manually or let it play continuously? 
      // A simple continuous pulse is easier with LFO, but let's just make it annoying.
      // Re-triggering logic is complex in simple useEffect, so let's use an LFO for volume.
      
      // Better approach for steady beep:
      const lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.value = 2; // 2Hz beep
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 500; 
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Apply LFO to gain? Simpler: Just rely on CSS for visual and a constant tone or repeating interval.
      // Let's stick to a simple repeating interval in JS to restart oscillator if needed, 
      // OR just a continuous annoying tone.
      
      // Let's do a modulated siren
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 1.0);
      
      // Loop the frequency ramp
      // Since Web Audio scheduling is precise but one-off, let's just set it to start.
      // We will loop it using a specialized function if we wanted complexity.
      // For MVP: Continuous Square Wave.
      
      osc.start();
      
      // Osc needs to be recreated every time we stop/start, so we store it.
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

    } catch (e) {
      console.error("Audio Error:", e);
    }
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
  };

  const triggerAlarm = () => {
    setIsRinging(true);
    startSound();
    
    // Fallback: Ensure audio context is resumed if suspended (browsers auto-suspend)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleStop = () => {
    setIsRinging(false);
    setIsAlarmActive(false); // Turn off alarm for next day
    stopSound();
  };

  const handleSnooze = () => {
    setIsRinging(false);
    stopSound();
    
    // Add 5 minutes
    const [hours, minutes] = alarmTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 5);
    
    const newHours = date.getHours().toString().padStart(2, '0');
    const newMinutes = date.getMinutes().toString().padStart(2, '0');
    setAlarmTime(`${newHours}:${newMinutes}`);
    
    // Alarm stays active
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Helper to ensure AudioContext is ready on user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  return (
    <div className={`h-full w-full flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000 ${isRinging ? 'animate-alarm bg-red-950/50' : ''}`}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        
        {/* Ringing Overlay */}
        {isRinging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl rounded-3xl p-8 animate-in zoom-in duration-300 border border-red-500/30">
            <Bell className="w-24 h-24 text-red-500 mb-6 animate-bounce" />
            <h1 className="text-4xl font-bold text-white mb-2">WAKE UP!</h1>
            <p className="text-red-300 mb-8 text-xl font-mono">{formatTime(currentTime)}</p>
            
            <div className="flex flex-col w-full gap-4">
              <Button 
                onClick={handleSnooze} 
                variant="secondary"
                className="w-full py-5 text-xl font-bold border-gray-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <Timer className="w-6 h-6" /> Snooze (5m)
                </div>
              </Button>
              <Button 
                onClick={handleStop}
                variant="danger"
                className="w-full py-5 text-xl font-bold bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-red-500/20 shadow-lg"
              >
                Stop Alarm
              </Button>
            </div>
          </div>
        )}

        {/* Main Clock UI */}
        <div className="text-center space-y-2 mb-12">
          <div className="flex items-center justify-center gap-2 text-indigo-300 mb-4">
            {currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? <Sun size={20} /> : <Moon size={20} />}
            <span className="uppercase tracking-widest text-xs font-semibold">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          <div className="font-mono text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter">
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Alarm Controls */}
        <div className="w-full glass-panel rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10" onClick={initAudio}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${isAlarmActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                <Clock size={24} />
              </div>
              <div>
                <div className="text-sm text-slate-400 font-medium">Alarm Time</div>
                <div className="text-2xl font-bold text-white tracking-wide">
                  {isAlarmActive ? "ON" : "OFF"}
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isAlarmActive}
                onChange={() => setIsAlarmActive(!isAlarmActive)}
              />
              <div className="w-14 h-8 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="relative group">
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold ml-1">
              Set Time
            </label>
            <input
              type="time"
              value={alarmTime}
              onChange={(e) => {
                setAlarmTime(e.target.value);
                // Optionally auto-enable alarm when time changes? 
                // setIsAlarmActive(true); 
              }}
              className="w-full bg-slate-900/60 border border-slate-700 text-white text-3xl md:text-4xl p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-center cursor-pointer hover:bg-slate-800"
              onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-slate-500">
             {isAlarmActive ? (
               <>
                 <Bell size={14} className="text-indigo-400" />
                 <span>Alarm set for {alarmTime}</span>
               </>
             ) : (
               <>
                 <BellOff size={14} />
                 <span>Alarm disabled</span>
               </>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};