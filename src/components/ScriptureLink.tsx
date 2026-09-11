import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { getBibleGatewayUrl, cleanPassageName } from '../utils/scriptureUtils';
import { BibleTranslation } from '../types/devotional';

interface ScriptureLinkProps {
  passage: string;
  translation?: BibleTranslation;
  className?: string;
  variant?: 'pill' | 'inline' | 'button';
  showBadge?: boolean;
}

export const ScriptureLink: React.FC<ScriptureLinkProps> = ({
  passage,
  translation = 'NASB1995',
  className = '',
  variant = 'pill',
  showBadge = true,
}) => {
  const url = getBibleGatewayUrl(passage, translation);
  const cleanText = cleanPassageName(passage);
  const displayLabel = translation === 'NASB1995' ? 'NASB' : translation;

  if (variant === 'inline') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400 hover:underline decoration-amber-400 underline-offset-2 ${className}`}
        title={`Read ${cleanText} on BibleGateway (${displayLabel})`}
      >
        <span>{cleanText}</span>
        {showBadge && (
          <span className="text-[10px] uppercase font-bold text-amber-600/70 dark:text-amber-400/70">
            ({displayLabel})
          </span>
        )}
        <ExternalLink className="w-3 h-3 opacity-60" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 shadow-sm
        bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100/80
        dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/60 dark:hover:bg-amber-900/60
        sepia-theme:bg-amber-100 sepia-theme:text-amber-950 sepia-theme:border-amber-300
        ${className}`}
      title={`Read ${cleanText} on BibleGateway (${displayLabel})`}
    >
      <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span>{cleanText}</span>
      {showBadge && (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
          {displayLabel}
        </span>
      )}
      <ExternalLink className="w-3 h-3 text-amber-600/70 dark:text-amber-400/70 ml-0.5" />
    </a>
  );
};
