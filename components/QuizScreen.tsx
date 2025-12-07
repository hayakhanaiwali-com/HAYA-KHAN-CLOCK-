import React from 'react';
import { Question } from '../types';
import { Button } from './Button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizScreenProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  selectedAnswer?: string;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
  onNext,
  selectedAnswer,
}) => {
  const isAnswered = !!selectedAnswer;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl w-full mx-auto p-4 md:p-6 flex flex-col h-full md:h-auto justify-center animate-in slide-in-from-bottom-4 duration-500">
      {/* Header / Progress */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium text-gray-400">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span className="text-indigo-400 font-bold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-2xl mb-6">
        <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-white">
          {question.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;
          const showResult = isAnswered;

          let buttonStyle = "bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-indigo-500/50";
          let icon = null;

          if (showResult) {
            if (isCorrect) {
              buttonStyle = "bg-green-500/10 border-green-500 text-green-400";
              icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
            } else if (isSelected && !isCorrect) {
              buttonStyle = "bg-red-500/10 border-red-500 text-red-400";
              icon = <XCircle className="w-5 h-5 text-red-500" />;
            } else {
              buttonStyle = "bg-gray-800/50 border-gray-700 opacity-50";
            }
          } else if (isSelected) {
            buttonStyle = "bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-500/30";
          }

          return (
            <button
              key={idx}
              onClick={() => !isAnswered && onAnswer(option)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-xl border transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
            >
              <span className="font-medium">{option}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next Button */}
      {isAnswered && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
            <p className="text-sm text-indigo-200">
              <span className="font-bold text-indigo-400 block mb-1">Did you know?</span>
              {question.explanation}
            </p>
          </div>
          <Button onClick={onNext} className="w-full shadow-xl">
            {currentQuestionIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </div>
      )}
    </div>
  );
};