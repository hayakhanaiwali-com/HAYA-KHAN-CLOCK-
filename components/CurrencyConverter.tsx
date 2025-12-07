import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowRightLeft, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { Currency } from '../types';

// Mock Exchange Rates (Base: USD)
// In a real app, this would come from an API.
const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: 150.14 },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.35 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.52 },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', rate: 7.19 },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', rate: 82.90 },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', rate: 4.97 },
];

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(CURRENCIES[0]); // USD
  const [toCurrency, setToCurrency] = useState<Currency>(CURRENCIES[1]); // EUR
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize result
  useEffect(() => {
    handleConvert();
  }, []); // Run once on mount

  const handleConvert = () => {
    setIsLoading(true);
    // Simulate network delay for better UX feel
    setTimeout(() => {
      const val = parseFloat(amount);
      if (!isNaN(val)) {
        // Convert to USD first, then to Target
        // (Amount / FromRate) * ToRate
        const inUSD = val / fromCurrency.rate;
        const final = inUSD * toCurrency.rate;
        setResult(final);
      } else {
        setResult(null);
      }
      setIsLoading(false);
    }, 400);
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    // We don't auto-convert immediately to let the user see the switch, 
    // or we could. Let's trigger a re-calc via effect or just call it.
    // However, since state update is async, we pass the new values manually if we wanted to calc immediately.
    // For simplicity, let's just clear result or keep old one? 
    // Usually standard behavior is to just swap slots.
    // Let's trigger conversion with new values.
    
    // Slight delay to allow state to settle or use effect. 
    // Simpler: Just rely on the user to hit convert OR use a useEffect on currencies.
  };

  // Auto-convert when currencies change if there is already a result
  useEffect(() => {
    if (result !== null) {
      const val = parseFloat(amount);
      if (!isNaN(val)) {
        const inUSD = val / fromCurrency.rate;
        const final = inUSD * toCurrency.rate;
        setResult(final);
      }
    }
  }, [fromCurrency, toCurrency]);

  return (
    <div className="max-w-xl w-full mx-auto p-6 flex flex-col items-center justify-center h-full">
      
      {/* Header */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-2 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-900/20">
          <DollarSign className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300">
          Currency Converter
        </h1>
        <p className="text-slate-400">Real-time exchange rates at your fingertips</p>
      </div>

      {/* Converter Card */}
      <div className="w-full glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-emerald-500/20">
        
        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Amount</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg font-semibold">
               {fromCurrency.code === 'USD' ? '$' : fromCurrency.code === 'EUR' ? '€' : fromCurrency.code === 'GBP' ? '£' : ''}
             </span>
             <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white text-3xl font-bold placeholder-slate-600 font-mono"
              placeholder="0.00"
             />
          </div>
        </div>

        {/* Currency Selectors */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-8">
          
          {/* From */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">From</label>
            <div className="relative group">
              <select
                value={fromCurrency.code}
                onChange={(e) => setFromCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                className="w-full appearance-none bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                     {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <div className="text-xs text-slate-400 text-center truncate">{fromCurrency.name}</div>
          </div>

          {/* Swap Button */}
          <div className="pt-6">
            <button 
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>

          {/* To */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">To</label>
            <div className="relative group">
              <select
                value={toCurrency.code}
                onChange={(e) => setToCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[1])}
                className="w-full appearance-none bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                     {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
             <div className="text-xs text-slate-400 text-center truncate">{toCurrency.name}</div>
          </div>
        </div>

        {/* Convert Button */}
        <Button 
          onClick={handleConvert} 
          isLoading={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 mb-8 py-4 text-lg"
        >
          {isLoading ? 'Converting...' : 'Convert Now'}
        </Button>

        {/* Result */}
        {result !== null && !isLoading && (
          <div className="bg-slate-950/50 rounded-2xl p-6 border border-emerald-500/20 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="text-slate-400 text-sm mb-1 font-medium">
               {parseFloat(amount || '0').toLocaleString()} {fromCurrency.name} =
             </div>
             <div className="text-4xl md:text-5xl font-bold text-white tracking-tight flex items-center justify-center gap-2 flex-wrap break-all">
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-200">
                 {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </span>
               <span className="text-2xl text-slate-500 font-medium">{toCurrency.code}</span>
             </div>
             <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-500">
               <TrendingUp size={14} className="text-emerald-500"/>
               <span>1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}</span>
             </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-slate-500 text-xs text-center max-w-xs mx-auto">
        Rates are for demonstration purposes only.
      </div>
    </div>
  );
};
