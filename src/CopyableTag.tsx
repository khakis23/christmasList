import React, { useState, useRef, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyableTagProps {
  label: string;
}

export const CopyableTag: React.FC<CopyableTagProps> = ({ label }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const didLongPress = useRef(false);

  const performCopy = useCallback(() => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(label).catch(() => {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = label;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        } catch {
          // Ignore fallback errors
        }
      });
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(50);
      } catch {
        // Ignore vibration errors
      }
    }

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, [label]);

  const handleTouchStart = (e: React.TouchEvent) => {
    didLongPress.current = false;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };

    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      performCopy();
    }, 450);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || !timerRef.current) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    performCopy();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      aria-label={copied ? `Copied: ${label}` : `Copy ${label}`}
      title="Click or hold to copy"
      className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-normal transition-all select-text cursor-pointer touch-manipulation text-left ${
        copied
          ? 'bg-pine-100 border border-pine-300 text-pine-900 ring-1 ring-pine-200'
          : 'bg-warm-100/90 hover:bg-warm-200/80 active:bg-warm-200 border border-warm-200/90 text-warm-800'
      }`}
    >
      {copied ? (
        <Check className="w-3 h-3 text-pine-700 shrink-0" aria-hidden="true" />
      ) : (
        <Copy className="w-3 h-3 text-warm-500 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      )}
      <span className="select-text">{label}</span>
      {copied && (
        <span className="text-[10px] font-medium text-pine-700 bg-pine-200/70 px-1 py-0.5 rounded-xs leading-none">
          Copied
        </span>
      )}
    </button>
  );
};
