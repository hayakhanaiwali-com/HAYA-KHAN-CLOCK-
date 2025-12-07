import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { HelpCircle, Trophy, ArrowUp, ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { GuessRecord } from '../types';

export const GuessGame: React.FC = () => {
  const [target, setTarget] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setTarget(Math.floor(Math.random() * 10) + 1);
    setAttempts(0);
    setGameOver(false);
    setHistory([]);
    setFeedback(null);
  };

  const handleGuess = (num: number) => {
    if (gameOver) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let result: 'High' | 'Low' | 'Correct';

    if (num === target) {
      result = 'Correct';
      setGameOver(true);
      setFeedback('Correct!');
    } else if (num > target) {
      result = 'High';
      setFeedback('Too High!');
    } else {
      result = 'Low';
      setFeedback('Too Low!');
    }

    setHistory(prev => [...prev, { value: num, result }]);
  };

  // Helper to check if a number has been guessed already
  const getGuessStatus = (num: number) => {
    return history.find(h => h.value === num);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 flex flex-col items-center justify-center h-full">
      
      {/* Header Section */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-2 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-900/20">
          <HelpCircle className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
          Guess the Number
        </h1>
        <p className="text-slate-400">Pick a number between 1 and 10</p>
      </div>

      {/* Game Board */}
      <div className="w-full glass-panel p-6 rounded-2xl shadow-xl relative overflow-hidden">
        
        {/* Victory Overlay */}
        {gameOver && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
            <Trophy className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-white mb-2">You Won!</h2>
            <p className="text-slate-300 mb-6">It took you <span className="text-indigo-400 font-bold">{attempts}</span> attempts.</p>
            <Button onClick={startNewGame} className="flex items-center gap-2">
              <RefreshCw size={18} /> Play Again
            </Button>
          </div>
        )}

        {/* Feedback Display */}
        <div className="h-16 flex items-center justify-center mb-6">
          {feedback ? (
            <div className={`px-6 py-2 rounded-full border flex items-center gap-2 font-semibold animate-in zoom-in duration-300 ${
              feedback === 'Correct!' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : feedback === 'Too High!'
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                  : 'bg-blue-500/20 border-blue-500/50 text-blue-300'
            }`}>
              {feedback === 'Correct!' && <Trophy size={18} />}
              {feedback === 'Too High!' && <ArrowUp size={18} />}
              {feedback === 'Too Low!' && <ArrowDown size={18} />}
              {feedback}
            </div>
          ) : (
             <div className="text-slate-500 flex items-center gap-2 text-sm">
               <AlertCircle size={16} /> Start guessing...
             </div>
          )}
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
            const guessStatus = getGuessStatus(num);
            const isGuessed = !!guessStatus;
            
            let btnClass = "h-14 rounded-xl font-bold text-lg transition-all duration-200 relative group overflow-hidden ";
            
            if (isGuessed) {
               if (guessStatus.result === 'Correct') {
                 btnClass += "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] border-green-400 scale-105 z-10";
               } else {
                 btnClass += "bg-slate-800 text-slate-500 border-slate-700 opacity-50 cursor-not-allowed";
               }
            } else {
               btnClass += "bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-700 hover:border-indigo-500 text-slate-200 active:scale-95";
            }

            return (
              <button
                key={num}
                onClick={() => !isGuessed && handleGuess(num)}
                disabled={isGuessed || gameOver}
                className={btnClass}
              >
                {num}
                {isGuessed && guessStatus.result !== 'Correct' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                    {guessStatus.result === 'High' ? <ArrowUp size={12} className="text-orange-400"/> : <ArrowDown size={12} className="text-blue-400"/>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center text-sm text-slate-500 pt-4 border-t border-white/5">
          <span>Attempts: <span className="text-slate-300 font-mono">{attempts}</span></span>
          <button onClick={startNewGame} className="hover:text-white transition-colors flex items-center gap-1">
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
