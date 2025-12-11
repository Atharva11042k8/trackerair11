import React from 'react';
import { Task } from '../types';
import { Check, Circle, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  date: string;
  tasks: Task[] | undefined;
}

const TaskCard: React.FC<TaskCardProps> = ({ date, tasks }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
/*p-6 instead of p-0*/
  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
      <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
        <div>
            <h2 className="text-xl font-semibold text-white mb-1">Daily Tasks</h2>
            <p className="text-sm text-gray-500 font-mono">{formattedDate}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Check size={16} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {!tasks || tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <AlertCircle size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No tasks added for this day.</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={index}
              className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                task.done 
                  ? 'bg-emerald-500/5 border border-emerald-500/20' 
                  : 'bg-white/5 border border-transparent hover:bg-white/10'
              }`}
            >
              <div className={`
                flex-shrink-0 transition-colors duration-300
                ${task.done ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}
              `}>
                {task.done ? <Check size={20} /> : <Circle size={20} />}
              </div>
              <span className={`
                text-sm md:text-base transition-all duration-300
                ${task.done ? 'text-gray-500 line-through' : 'text-gray-200'}
              `}>
                {task.task}
              </span>
            </div>
          ))
        )}
      </div>
      
      {tasks && tasks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
              <span>{tasks.filter(t => t.done).length} completed</span>
              <span>{Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)}% progress</span>
          </div>
      )}
    </div>
  );
};

export default TaskCard;
