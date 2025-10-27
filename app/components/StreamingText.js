import React, { useState, useEffect, useRef } from "react";

export default function StreamingText({ text, isStreaming }) {
  const [displayedText, setDisplayedText] = useState("");
  const [buffer, setBuffer] = useState("");
  const displayedLengthRef = useRef(0);
  const animationFrameRef = useRef(null);


  useEffect(() => {
    setBuffer(text);
  }, [text]);


  useEffect(() => {
    if (!buffer) return;

    const animate = () => {
      if (displayedLengthRef.current < buffer.length) {
      
        const charsToAdd = Math.min(
          Math.ceil(Math.random() * 2) + 1,
          buffer.length - displayedLengthRef.current
        );
        
        displayedLengthRef.current += charsToAdd;
        setDisplayedText(buffer.slice(0, displayedLengthRef.current));
        
  
        animationFrameRef.current = setTimeout(animate, 20);
      }
    };


    if (displayedLengthRef.current < buffer.length) {
      animationFrameRef.current = setTimeout(animate, 20);
    }

    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
      }
    };
  }, [buffer]);

  useEffect(() => {
    if (text === "") {
      setDisplayedText("");
      setBuffer("");
      displayedLengthRef.current = 0;
    }
  }, [text]);

  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed text-black">
      {displayedText}
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-black ml-0.5 animate-blink"></span>
      )}
    </div>
  );
}
