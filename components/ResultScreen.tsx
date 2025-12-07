import React from 'react';
import { Question } from '../types';
import { Button } from './Button';
import { Trophy, RefreshCw, Check, X } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: Record<number, string>;
  onRetry: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  questions,
  userAnswers,
  onRetry,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = "";
  let subMessage = "";
  
  if (percentage === 100) {
    message = "Perfection!";
    subMessage = "You're a master of this topic.";
  } else if (percentage >= 80) {
    message = "Great Job!";
    subMessage = "You really know your stuff.";
  } else if (percentage >= 60) {
    message = "Good Effort!";
    subMessage = "You're getting there.";
  } else {
    message = "Keep Learning!";
    subMessage = "Every master was once a beginner.";
  }

  return (
    <div className="max-w-3xl w-full mx-auto p-6 h-full overflow-y-auto animate-in fade-in zoom-in duration-500 custom-scrollbar">
      <div className="text-center space-y-6 mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full ring-1 ring-yellow-500/50 mb-2">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">{message}</h2>
          <p className="text-gray-400">{subMessage}</p>
        </div>

        <div className="inline-block bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">Your Score</div>
          <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {score} / {totalQuestions}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          Review Answers
        </h3>
        
        <div className="grid gap-4">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 min-w-[24px] flex items-center justify-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? <Check size={20} /> : <X size={20} />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-200">{q.questionText}</p>
                    <div className="text-sm grid gap-1">
                      <p className={`${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        Your answer: {userAnswer}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-400">
                          Correct answer: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pb-8">
        <Button onClick={onRetry} className="flex items-center gap-2 px-8">
          <RefreshCw size={20} />
          Play Again
        </Button>
      </div>
    </div>
  );
};