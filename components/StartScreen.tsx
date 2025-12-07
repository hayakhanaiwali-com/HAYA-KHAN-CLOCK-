import React, { useState } from 'react';
import { Button } from './Button';
import { Difficulty } from '../types';
import { BrainCircuit, Sparkles, BookOpen, Globe } from 'lucide-react';

interface StartScreenProps {
  onStart: (topic: string, difficulty: Difficulty) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const predefinedTopics = [
    { icon: <Globe size={18} />, label: "World History" },
    { icon: <BrainCircuit size={18} />, label: "Science & Tech" },
    { icon: <BookOpen size={18} />, label: "Literature" },
    { icon: <Sparkles size={18} />, label: "Pop Culture" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart(topic, difficulty);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4 ring-1 ring-indigo-500/50">
          <BrainCircuit className="w-12 h-12 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Gemini Quiz
        </h1>
        <p className="text-gray-400">
          Generate an AI-powered quiz on any topic you can imagine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">
            What's the topic?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Quantum Physics, 90s Music, JavaScript..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {predefinedTopics.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTopic(t.label)}
              className="flex items-center justify-center gap-2 p-2 text-sm bg-gray-800/50 hover:bg-gray-700 border border-gray-700/50 rounded-lg text-gray-300 transition-colors"
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-800 rounded-xl border border-gray-700">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  difficulty === level
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full text-lg" 
          disabled={!topic.trim()}
        >
          Generate Quiz
        </Button>
      </form>
    </div>
  );
};