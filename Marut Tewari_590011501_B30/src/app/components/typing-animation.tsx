'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypingAnimation({ text, className, speed = 20 }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); 
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return (
    <div className={cn('font-body text-foreground/90', className)}>
      {displayedText}
      <span className="animate-pulse opacity-70">▋</span>
    </div>
  );
}
