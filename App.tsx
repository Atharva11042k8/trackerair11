import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import StatsChart from './components/StatsChart';
import { fetchAllData } from './services/dataService';
import { AppState } from './types';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>({
    tasks: {},
    study: {},
    sleep: {},
    isLoading: true,
    error: null,
  });

  // Default to first date in mock data for demo purposes, or today
  const [selectedDate, setSelectedDate] = useState<string>('2025-01-01');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchAllData();
        setData({
          tasks: result.tasks,
          study: result.study,
          sleep: result.sleep,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setData(prev => ({ ...prev, isLoading: false, error: 'Failed to load tracker data. Ensure JSON files are in /data/.' }));
      }
    };
    load();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  if (data.isLoading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-emerald-400">
          <Loader2 className="animate-spin" size={40} />
          <span className="font-mono text-sm tracking-widest">LOADING SYSTEM...</span>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-xl border-red-500/30 max-w-md w-full text-center">
          <h2 className="text-xl text-red-400 font-bold mb-2">System Error</h2>
          <p className="text-gray-400 mb-4">{data.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] pb-12 overflow-x-hidden text-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Header />

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="glass-card p-1.5 rounded-xl flex items-center gap-2">
            <button 
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-transparent border-none text-white font-mono text-sm focus:ring-0 date-picker-custom outline-none"
            />
            <button 
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="text-xs font-mono text-gray-500 flex gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Data
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Sync Active
            </span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Tasks */}
          <div className="lg:col-span-4 h-[500px]">
            <TaskCard date={selectedDate} tasks={data.tasks[selectedDate]} />
          </div>

          {/* Right Column: Graphs */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-[500px]">
            
            {/* Study Graph */}
            <div className="flex-1 h-1/2">
              <StatsChart 
                title="Study Focus" 
                unit="hrs" 
                dataMap={data.study} 
                color="#10b981" // emerald-500
                currentDate={selectedDate}
              />
            </div>

            {/* Sleep Graph */}
            <div className="flex-1 h-1/2">
              <StatsChart 
                title="Sleep Cycles" 
                unit="hrs" 
                dataMap={data.sleep} 
                color="#3b82f6" // blue-500
                currentDate={selectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;