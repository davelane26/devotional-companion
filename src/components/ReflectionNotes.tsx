import React, { useState, useEffect, useRef } from 'react';
import { PenLine, Check, Copy, Trash2, Sparkles } from 'lucide-react';
import { ReflectionNote } from '../types/devotional';

interface ReflectionNotesProps {
  noteId: string;
  type: 'sermon' | 'book';
  dateStr: string;
  title: string;
  subtitle?: string;
  placeholder?: string;
}

const STORAGE_INDEX_KEY = 'all_devotional_reflection_notes_index';

export const ReflectionNotes: React.FC<ReflectionNotesProps> = ({
  noteId,
  type,
  dateStr,
  title,
  subtitle,
  placeholder = "Write your reflections, what God is speaking to you, or prayer points here...",
}) => {
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Load note on mount or when noteId changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`note_${noteId}`);
      if (raw) {
        const parsed: ReflectionNote = JSON.parse(raw);
        setContent(parsed.content || '');
        if (parsed.updatedAt) {
          const date = new Date(parsed.updatedAt);
          setLastSavedTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } else {
        setContent('');
        setLastSavedTime(null);
      }
    } catch {
      setContent('');
    }
  }, [noteId]);

  // Debounced save
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    setIsSaving(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      saveNote(newText);
    }, 400);
  };

  const saveNote = (text: string) => {
    try {
      const trimmed = text.trim();
      const noteKey = `note_${noteId}`;

      // Update index
      let index: string[] = [];
      try {
        const rawIndex = localStorage.getItem(STORAGE_INDEX_KEY);
        index = rawIndex ? JSON.parse(rawIndex) : [];
      } catch {
        index = [];
      }

      if (trimmed.length > 0) {
        const now = new Date();
        const noteObj: ReflectionNote = {
          id: noteId,
          type,
          date: dateStr,
          title,
          subtitle,
          content: text,
          updatedAt: now.toISOString(),
        };
        localStorage.setItem(noteKey, JSON.stringify(noteObj));

        if (!index.includes(noteId)) {
          index.unshift(noteId);
          localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
        }
        setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        // If empty, remove from storage and index
        localStorage.removeItem(noteKey);
        index = index.filter((id) => id !== noteId);
        localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
        setLastSavedTime(null);
      }

      setIsSaving(false);
    } catch (err) {
      console.error('Failed to save note to localStorage:', err);
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleClear = () => {
    if (content && window.confirm('Are you sure you want to clear your reflection note?')) {
      setContent('');
      saveNote('');
    }
  };

  const wordCount = content.trim().length > 0 ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
            <PenLine className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              Personal Reflection
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Saved automatically to this device
            </p>
          </div>
        </div>

        {/* Status indicator & Actions */}
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium animate-pulse">
              <Sparkles className="w-3 h-3" /> Saving...
            </span>
          ) : lastSavedTime ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-3 h-3" /> Saved {lastSavedTime}
            </span>
          ) : null}

          {content.length > 0 && (
            <>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy note to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Note Textarea */}
      <div className="relative rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-500 bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80 shadow-inner">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          rows={5}
          className="w-full p-3.5 sm:p-4 rounded-2xl bg-transparent resize-y text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
        />

        {/* Word count footer */}
        <div className="px-3.5 pb-2 text-[10px] sm:text-xs text-slate-400 flex justify-end">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </div>
      </div>
    </div>
  );
};

