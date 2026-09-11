import React, { useState, useEffect, useMemo } from 'react';
import { NotebookPen, Search, Download, Trash2, Calendar, Radio, BookOpen } from 'lucide-react';
import { ReflectionNote } from '../types/devotional';
import { formatReadableDate } from '../utils/dateUtils';

interface JournalViewProps {
  onSelectReading?: (type: 'sermon' | 'book', idOrDate: string) => void;
}

const STORAGE_INDEX_KEY = 'all_devotional_reflection_notes_index';

export const JournalView: React.FC<JournalViewProps> = ({ onSelectReading }) => {
  const [notes, setNotes] = useState<ReflectionNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sermon' | 'book'>('all');

  // Load all notes from localStorage
  const loadNotes = () => {
    try {
      const rawIndex = localStorage.getItem(STORAGE_INDEX_KEY);
      const index: string[] = rawIndex ? JSON.parse(rawIndex) : [];
      const loaded: ReflectionNote[] = [];

      index.forEach((noteId) => {
        const rawNote = localStorage.getItem(`note_${noteId}`);
        if (rawNote) {
          try {
            const parsed: ReflectionNote = JSON.parse(rawNote);
            if (parsed && parsed.content && parsed.content.trim().length > 0) {
              loaded.push(parsed);
            }
          } catch {
            // ignore corrupt entry
          }
        }
      });

      // Sort by updatedAt descending
      loaded.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setNotes(loaded);
    } catch {
      setNotes([]);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesFilter = filterType === 'all' || n.type === filterType;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        n.title.toLowerCase().includes(query) ||
        (n.subtitle && n.subtitle.toLowerCase().includes(query)) ||
        n.content.toLowerCase().includes(query) ||
        n.date.includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [notes, filterType, searchQuery]);

  // Export notes to markdown/txt
  const handleExport = () => {
    if (notes.length === 0) return;
    let exportText = `# Daily Devotional Journal Notes\nExported on: ${new Date().toLocaleString()}\n\n`;

    notes.forEach((n) => {
      exportText += `## ${n.title}\n`;
      exportText += `**Type:** ${n.type === 'sermon' ? 'Sermon Plan' : 'Book Study'} | **Date:** ${n.date}\n\n`;
      exportText += `${n.content}\n\n---\n\n`;
    });

    const blob = new Blob([exportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devotional-journal-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Delete this reflection note?')) {
      localStorage.removeItem(`note_${noteId}`);
      try {
        const rawIndex = localStorage.getItem(STORAGE_INDEX_KEY);
        let index: string[] = rawIndex ? JSON.parse(rawIndex) : [];
        index = index.filter((id) => id !== noteId);
        localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
      } catch {
        // ignore
      }
      loadNotes();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Personal Notes & Journal
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            My Reflection Journal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {notes.length} {notes.length === 1 ? 'reflection note' : 'reflection notes'} saved on this device
          </p>
        </div>

        {notes.length > 0 && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm shrink-0 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export Notes (.md)</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword, title, or scripture..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 self-stretch sm:self-auto justify-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {(['all', 'sermon', 'book'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filterType === type
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {type === 'all' ? 'All' : type === 'sermon' ? 'Sermon' : 'Book'}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <NotebookPen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {notes.length === 0 ? 'No reflection notes yet' : 'No matching notes found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {notes.length === 0
              ? 'As you read daily through the Sermon Plan or Book Study, write your thoughts in the reflection section below each day.'
              : 'Try a different keyword or reset your filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const formattedDate = formatReadableDate(note.date);
            const timeStr = new Date(note.updatedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={note.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          note.type === 'sermon'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                        }`}
                      >
                        {note.type === 'sermon' ? (
                          <>
                            <Radio className="w-3 h-3" /> Sermon
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3 h-3" /> Book
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formattedDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {note.title}
                    </h3>
                    {note.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {note.subtitle}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Note Content */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-serif leading-relaxed">
                  {note.content}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Last edited at {timeStr}</span>
                  {onSelectReading && (
                    <button
                      onClick={() => onSelectReading(note.type, note.date)}
                      className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                    >
                      Go to reading →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

