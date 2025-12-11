import React from 'react'; import { FileText, Sparkles, Tag, Smile, Meh, Frown } from 'lucide-react';

interface SummaryCardProps { date: string; // ISO date string summary?: string; // main textual summary for the day highlights?: string[]; // short bullet highlights from the day mood?: 'great' | 'good' | 'meh' | 'bad'; // optional mood indicator tags?: string[]; // optional tags/keywords for the day }

const moodMap: Record<NonNullable<SummaryCardProps['mood']>, { label: string; emoji: React.ReactNode }> = { great: { label: 'Great', emoji: <Smile size={16} /> }, good: { label: 'Good', emoji: <Sparkles size={16} /> }, meh: { label: 'Meh', emoji: <Meh size={16} /> }, bad: { label: 'Bad', emoji: <Frown size={16} /> }, };

const SummaryCard: React.FC<SummaryCardProps> = ({ date, summary, highlights = [], mood, tags = [] }) => { const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', });

const wordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;

return ( <div className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"> <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4"> <div> <h2 className="text-xl font-semibold text-white mb-1">Daily Summary</h2> <p className="text-sm text-gray-500 font-mono">{formattedDate}</p> </div>

<div className="flex items-center gap-3">
      {mood && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/3 text-sm text-gray-200">
          <span className="opacity-90">{moodMap[mood].emoji}</span>
          <span className="font-medium">{moodMap[mood].label}</span>
        </div>
      )}

      <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
        <FileText size={16} />
      </div>
    </div>
  </div>

  <div className="flex-1 overflow-y-auto pr-2">
    {/* Main summary text */}
    {summary && summary.trim().length > 0 ? (
      <div className="prose prose-invert max-w-none text-sm md:text-base text-gray-200 leading-relaxed">
        <p>{summary}</p>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <FileText size={32} className="mb-2 opacity-50" />
        <p className="text-sm">No summary written for this day yet.</p>
        <p className="mt-2 text-xs text-gray-400">Click "Add Summary" to write one.</p>
      </div>
    )}

    {/* Highlights */}
    {highlights.length > 0 && (
      <div className="mt-5">
        <h3 className="text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2">
          <Sparkles size={16} /> Highlights
        </h3>
        <ul className="list-disc ml-5 space-y-1 text-gray-200 text-sm">
          {highlights.map((h, i) => (
            <li key={i} className="truncate">{h}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Tags */}
    {tags.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-xs bg-white/3 px-2 py-1 rounded-md text-gray-200"
          >
            <Tag size={12} />
            {t}
          </span>
        ))}
      </div>
    )}
  </div>

  {/* Footer summary */}
  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
    <span className="flex items-center gap-2"> 
      <FileText size={14} />
      {wordCount} words
    </span>

    <div className="flex items-center gap-4">
      <span className="text-xs">{highlights.length} highlights</span>
      <span className="text-xs">{tags.length} tags</span>
    </div>
  </div>
</div>

); };

export default SummaryCard;
