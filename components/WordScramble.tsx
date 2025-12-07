import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { WordData, LetterTile } from '../types';
import { Shuffle, Lightbulb, RefreshCw, Trophy, RotateCcw } from 'lucide-react';

// Predefined word bank
const WORD_BANK: WordData[] = [
  { word: "GALAXY", hint: "A massive system of stars, stellar remnants, and dark matter." },
  { word: "PUZZLE", hint: "A game, toy, or problem designed to test ingenuity." },
  { word: "JUNGLE", hint: "A land covered with dense forest and tangled vegetation." },
  { word: "CAMERA", hint: "A device for recording visual images." },
  { word: "WINTER", hint: "The coldest season of the year." },
  { word: "OCEAN", hint: "A very large expanse of sea." },
  { word: "GUITAR", hint: "A stringed musical instrument." },
  { word: "SILVER", hint: "A precious shiny grayish-white metal." },
  { word: "PYTHON", hint: "A large heavy-bodied snake or a programming language." },
  { word: "PLANET", hint: "A celestial body moving in an elliptical orbit around a star." },
  { word: "ROBOT", hint: "A machine capable of carrying out a complex series of actions." },
  { word: "CASTLE", hint: "A large building typically of the medieval period, fortified against attack." },
];

export const WordScramble: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [targetWord, setTargetWord] = useState<WordData>(WORD_BANK[0]);
  
  // Two pools of letters: those in the "bank" (scrambled) and those in the "answer" (user input)
  const [scrambledLetters, setScrambledLetters] = useState<LetterTile[]>([]);
  const [userAnswer, setUserAnswer] = useState<LetterTile[]>([]);
  
  const [gameState, setGameState] = useState<'playing' | 'won' | 'wrong'>('playing');
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Initialize Game
  useEffect(() => {
    loadNewWord(0);
  }, []);

  const loadNewWord = (index: number) => {
    const safeIndex = index % WORD_BANK.length;
    const wordData = WORD_BANK[safeIndex];
    setTargetWord(wordData);
    setCurrentWordIndex(safeIndex);
    
    // Create letter tiles with unique IDs
    const tiles: LetterTile[] = wordData.word.split('').map((char, i) => ({
      id: `${char}-${i}-${Date.now()}`,
      char: char.toUpperCase()
    }));

    // Shuffle until it's not the original word
    let shuffled = [...tiles];
    let attempts = 0;
    while (shuffled.map(t => t.char).join('') === wordData.word && attempts < 10) {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
      attempts++;
    }
    // Fallback shuffle if loop exits
    if (attempts >= 10) shuffled = shuffled.sort(() => Math.random() - 0.5);

    setScrambledLetters(shuffled);
    setUserAnswer([]);
    setGameState('playing');
    setShowHint(false);
  };

  const handleTileClick = (tile: LetterTile, source: 'scrambled' | 'answer') => {
    if (gameState === 'won') return;

    if (source === 'scrambled') {
      // Move from scrambled to answer
      setScrambledLetters(prev => prev.filter(t => t.id !== tile.id));
      setUserAnswer(prev => {
        const newAnswer = [...prev, tile];
        checkAnswer(newAnswer);
        return newAnswer;
      });
      setGameState('playing'); // Reset error state on input
    } else {
      // Move from answer back to scrambled
      setUserAnswer(prev => prev.filter(t => t.id !== tile.id));
      setScrambledLetters(prev => [...prev, tile]);
      setGameState('playing');
    }
  };

  const checkAnswer = (currentAnswer: LetterTile[]) => {
    // Only check if full word is formed
    if (currentAnswer.length === targetWord.word.length) {
      const formedWord = currentAnswer.map(t => t.char).join('');
      if (formedWord === targetWord.word) {
        setGameState('won');
        setStreak(s => s + 1);
      } else {
        setGameState('wrong');
      }
    }
  };

  const shuffleRemaining = () => {
    setScrambledLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const nextLevel = () => {
    loadNewWord(currentWordIndex + 1);
  };

  const resetCurrent = () => {
    // Return all letters to scrambled
    const allTiles = [...userAnswer, ...scrambledLetters];
    // Re-shuffle all
    setScrambledLetters(allTiles.sort(() => Math.random() - 0.5));
    setUserAnswer([]);
    setGameState('playing');
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-4 flex flex-col items-center justify-center h-full">
      
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-indigo-300">
          Word Scramble
        </h1>
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Trophy size={16} className="text-yellow-400" />
            Streak: <span className="text-white font-mono">{streak}</span>
          </span>
        </div>
      </div>

      <div className="w-full glass-panel p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Victory Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <Trophy className="w-20 h-20 text-yellow-400 mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-white mb-2">Excellent!</h2>
            <p className="text-slate-300 mb-8">You found <span className="text-teal-400 font-bold">{targetWord.word}</span></p>
            <Button onClick={nextLevel} className="px-8 text-lg bg-teal-500 hover:bg-teal-400 border-teal-500">
              Next Word
            </Button>
          </div>
        )}

        {/* Hint Section */}
        <div className="min-h-[3rem] mb-6 flex items-center justify-center">
          {showHint ? (
            <div className="bg-indigo-900/30 text-indigo-200 px-4 py-2 rounded-lg text-sm md:text-base border border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold mr-2">Hint:</span>{targetWord.hint}
            </div>
          ) : (
             gameState !== 'won' && (
               <button 
                onClick={() => setShowHint(true)}
                className="text-slate-500 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors"
               >
                 <Lightbulb size={16} /> Need a hint?
               </button>
             )
          )}
        </div>

        {/* Answer Area */}
        <div className="mb-10">
          <div className={`flex flex-wrap justify-center gap-2 min-h-[4rem] transition-transform ${gameState === 'wrong' ? 'animate-shake' : ''}`}>
             {/* Render Answer Tiles */}
             {userAnswer.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile, 'answer')}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-teal-600 text-white text-2xl font-bold shadow-lg shadow-teal-900/50 hover:bg-teal-500 active:scale-95 transition-all animate-pop flex items-center justify-center border-b-4 border-teal-800"
                >
                  {tile.char}
                </button>
             ))}

             {/* Render Empty Slots for remaining letters */}
             {Array.from({ length: Math.max(0, targetWord.word.length - userAnswer.length) }).map((_, i) => (
               <div 
                key={`empty-${i}`} 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center"
               />
             ))}
          </div>
          {gameState === 'wrong' && (
            <p className="text-center text-red-400 text-sm mt-3 animate-pulse font-medium">
              Not quite! Tap letters to remove them and try again.
            </p>
          )}
        </div>

        {/* Scrambled Pool Area */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
           {scrambledLetters.map((tile) => (
             <button
                key={tile.id}
                onClick={() => handleTileClick(tile, 'scrambled')}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-700 text-slate-200 text-2xl font-bold shadow-md hover:bg-slate-600 hover:text-white active:scale-95 transition-all border-b-4 border-slate-800 flex items-center justify-center"
              >
                {tile.char}
              </button>
           ))}
           {/* Placeholder to keep height if empty */}
           {scrambledLetters.length === 0 && <div className="h-14 w-full text-center text-slate-600 text-sm italic py-4">All letters used</div>}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 pt-4 border-t border-slate-800">
          <Button 
            variant="secondary" 
            onClick={shuffleRemaining}
            disabled={scrambledLetters.length < 2 || gameState === 'won'}
            title="Shuffle Letters"
            className="p-3"
          >
            <Shuffle size={20} />
          </Button>
          <Button 
            variant="secondary" 
            onClick={resetCurrent}
            disabled={userAnswer.length === 0 || gameState === 'won'}
            title="Clear Answer"
            className="p-3"
          >
            <RotateCcw size={20} />
          </Button>
          <Button
             variant="secondary"
             onClick={() => loadNewWord(currentWordIndex + 1)}
             className="p-3"
             title="Skip Word"
          >
             <RefreshCw size={20} />
          </Button>
        </div>

      </div>
    </div>
  );
};
