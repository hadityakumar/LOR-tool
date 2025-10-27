import React, { useState, useEffect, useRef } from "react";

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

export default function LineChars({ text = "", shuffling = false, initialShuffle = false }) {
  const chars = Array.from(text);
  const [displayChars, setDisplayChars] = useState(chars);
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef(null);
  const iterationRef = useRef(0);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (initialShuffle && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      iterationRef.current = 0;
      
      setDisplayChars(chars.map((char) => {
        if (char === " " || char === "\n") return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }));
      
      const animate = () => {
        setDisplayChars((prev) =>
          prev.map((char, index) => {
            if (chars[index] === " " || chars[index] === "\n") return chars[index];
            
            if (index < iterationRef.current) {
              return chars[index];
            }
            
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
        );

        if (iterationRef.current < chars.length) {
          iterationRef.current += 0.15;
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);

      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }
    
    if (shuffling) {
      iterationRef.current = 0;
      
      const animate = () => {
        setDisplayChars((prev) =>
          prev.map((char, index) => {
            if (chars[index] === " " || chars[index] === "\n") return chars[index];
            
            if (index < iterationRef.current) {
              return chars[index];
            }
            
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
        );

        if (iterationRef.current < chars.length) {
          iterationRef.current += 0.15;
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);

      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    } else if (hasInitializedRef.current) {
      setDisplayChars(chars);
    }
  }, [shuffling, text, initialShuffle, mounted]);

  return (
    <span>
      {displayChars.map((ch, i) => {
        if (ch === " ") return <span key={`sp-${i}`}>&nbsp;</span>;
        return (
          <span key={`c-${i}`} style={{ display: "inline-block" }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}