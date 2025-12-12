// src/components/TaskCard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Calendar, AlertCircle, Check } from 'lucide-react';

type Task = {
  task: string;
  done?: boolean;
};

type SummaryEntry = {
  date: string; // ISO date string like "2025-12-11" or "2025-12-11T00:00:00Z"
  summary?: string; // optional full-text summary for the day
  highlights?: string[]; // optional array of short highlights
  tasks?: Task[]; // optional - backward compatibility with your tasks format
};

interface TaskCardProps {
  date: string; // the date you want to show, e.g. "2025-12-11"
  jsonPath?: string; // optional override of the JSON path (defaults to "/data/tasks.json")
}

const TaskCard: React.FC<TaskCardProps> = ({ date, jsonPath = '/data/tasks.json' }) => {
  const [data, setData] = useState<SummaryEntry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Normalized date key (keep only yyyy-mm-dd for matching)
  const normalize = (d: string) => {
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch {
      return d.slice(0, 10);
    }
  };
  const normalizedRequested = useMemo(() => normalize(date), [date]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(jsonPath)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load ${jsonPath}: ${res.status}`);
        const json = await res.json();
        return json as SummaryEntry[];
      })
      .then((json) => {
        if (!mounted) return;
        setData(Array.isArray(json) ? json : []);
      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(err?.message ?? 'Failed to load data');
        setData([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [jsonPath]);

  // Find entry for requested date
  const entry = useMemo(() => {
    if (!data) return undefined;
    return data.find((e) => normalize(e.date) === normalizedRequested);
  }, [data, normalizedRequested]);

  // If entry has tasks, compute progress
  const progress = useMemo(() => {
    if (!entry?.tasks || entry.tasks.length === 0) return null;
    const done = entry.tasks.filter((t) => t.done).length;
    const percent = Math.round((done / entry.tasks.length) * 100);
    return { done, total: entry.tasks.length, percent };
  }, [entry]);

  const formattedDate = useMemo(
    () =>
      new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [date]
  );

  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Daily Summary</h2>
          <p className="text-sm text-gray-500 font-mono">{formattedDate}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <FileText size={16} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <div className="animate-pulse mb-2">
              <Calendar size={32} className="opacity-50" />
            </div>
            <p className="text-sm">Loading summary...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 text-rose-400">
            <AlertCircle size={32} className="mb-2 opacity-60" />
            <p className="text-sm">Error: {error}</p>
          </div>
        ) : !entry ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <AlertCircle size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No summary found for this date.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* If there is a full summary string, show it */}
            {entry.summary ? (
              <div className="prose prose-invert text-sm md:text-base max-w-full">
                <p>{entry.summary}</p>
              </div>
            ) : null}

            {/* If there are highlights, show them */}
            {entry.highlights && entry.highlights.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Highlights</h3>
                <ul className="space-y-2">
                  {entry.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-transparent hover:bg-white/8 transition"
                    >
                      <div className="flex-shrink-0 text-emerald-400 mt-1">
                        <Check size={16} />
                      </div>
                      <div className="text-sm text-gray-200">{h}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Backwards-compatible tasks view */}
            {entry.tasks && entry.tasks.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Tasks</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {entry.tasks.map((t, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        t.done
                          ? 'bg-emerald-500/5 border border-emerald-500/20'
                          : 'bg-white/5 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className={t.done ? 'text-emerald-400' : 'text-gray-500'}>
                        {t.done ? <Check size={18} /> : <div className="w-4 h-4 rounded-full border border-gray-500" />}
                      </div>
                      <span className={`text-sm md:text-base ${t.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                        {t.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: only show when we have progress or an entry */}
      {!loading && !error && entry && (
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
          <span>
            {entry.tasks && entry.tasks.length > 0
              ? `${progress?.done ?? 0} completed`
              : entry.highlights && entry.highlights.length > 0
              ? `${entry.highlights.length} highlights`
              : 'Summary'}
          </span>
          <span>{entry.tasks && entry.tasks.length > 0 ? `${progress?.percent ?? 0}% progress` : ''}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
