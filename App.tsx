import React from 'react';
import { AlarmClock } from './components/AlarmClock';

const App: React.FC = () => {
  return (
    <div className="h-screen w-full bg-slate-950 text-white relative flex flex-col">
      <main className="flex-1 relative z-10 overflow-hidden flex items-center justify-center">
        <AlarmClock />
      </main>
    </div>
  );
};

export default App;