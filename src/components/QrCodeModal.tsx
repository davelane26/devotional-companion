import React, { useState } from 'react';
import { X, Copy, Check, Download, QrCode } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = 'https://davelane26.github.io/devotional-companion/';
  const qrImageSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=15&data=' + encodeURIComponent(appUrl);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrImageSrc;
    link.download = 'devotional-companion-qr-code.png';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 pt-1">
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Scan to Open on Phone
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Point your smartphone camera at this code
          </p>
        </div>

        {/* QR Code Image */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-inner inline-block mx-auto">
          <img
            src={qrImageSrc}
            alt="Devotional Companion QR Code"
            className="w-48 h-48 rounded-lg object-contain mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={handleCopyLink}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-all active:scale-95 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownloadQr}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
            title="Download QR code image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PNG</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Also saved to your <strong className="text-slate-600 dark:text-slate-400">Downloads</strong> folder as <br />
          <code>devotional-companion-qr-code.png</code>
        </p>
      </div>
    </div>
  );
};
