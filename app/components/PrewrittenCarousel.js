import React, { useState, useEffect, useRef } from "react";
import LineChars from "./LineChars";

export default function PrewrittenCarousel({
  letters = [],
  cycleInterval = 3000,
  isActive = true,
}) {
  const [index, setIndex] = useState(0);
  const [shuffling, setShuffling] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (initialLoad) {

      const initialTimer = setTimeout(() => {
        setInitialLoad(false);
        startCycle();
      }, 2000);
      
      return () => clearTimeout(initialTimer);
    } else {
      startCycle();
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }

  }, [index, isActive, initialLoad]);

  function startCycle() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setShuffling(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % letters.length);
        setShuffling(false);
      }, 1200);
    }, cycleInterval);
  }

  const raw = letters[index] || "";
  const lines = raw.split("\n");

  return (
    <div className="relative w-full h-full">
      <div
        className="prose prose-invert max-w-none text-sm leading-relaxed p-2 overflow-auto h-full"
        style={{
          color: `rgba(0,0,0,0.45)`,
        }}
      >
        {lines.map((line, li) => (
          <div
            key={`${index}-${li}`}
            style={{
              marginBottom: "0.45rem",
              whiteSpace: "pre-wrap",
            }}
          >
            <LineChars text={line} shuffling={shuffling} initialShuffle={initialLoad} />
          </div>
        ))}
      </div>
    </div>
  );
}