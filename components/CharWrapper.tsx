import React from 'react';

interface CharWrapperProps {
  text: string;
  className?: string;
}

export function CharWrapper({ text, className = '' }: CharWrapperProps) {
  return (
    <>
      {text.split('').map((char, index) => (
        <span 
          key={`${char}-${index}`} 
          className={`base-char inline-block ${className}`}
          data-char={char === ' ' ? '\u00A0' : char}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  );
} 