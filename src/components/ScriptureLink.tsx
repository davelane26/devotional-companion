import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { getBibleGatewayUrl, cleanPassageName } from '../utils/scriptureUtils';

interface ScriptureLinkProps {
  passage: string;
  className?: string;
  variant?: 'pill' | 'inline' | 'button';
}

export const ScriptureLink: React.FC<ScriptureLinkProps> = ({
  passage,
  className = '',
  variant = 'pill',
}) => {
  const url = getBibleGatewayUrl(passage);
  const cleanText = cleanPassageName(passage);

  if (variant === 'inline') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400 hover:underline decoration-amber-400 underline-offset-2 ${className}`}
        title={`Read ${cleanText} on BibleGateway`}
      >
        <span>{cleanText}</span>
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
      title={`Read ${cleanText} on BibleGateway`}
    >
      <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span>{cleanText}</span>
      <ExternalLink className="w-3 h-3 text-amber-600/70 dark:text-amber-400/70 ml-0.5" />
    </a>
  );
};

