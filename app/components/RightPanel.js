import React, { useState, useRef, useEffect } from "react";
import PrewrittenCarousel from "./PrewrittenCarousel";
import StreamingText from "./StreamingText";
import { Maximize2, Minimize2, Download, ChevronDown } from "lucide-react";

export default function RightPanel({ 
  letters = [], 
  isActive = true, 
  generatedLOR = "", 
  isGenerating = false,
  onTweak,
  isFullscreen = false,
  onToggleFullscreen
}) {
  const [tweakInput, setTweakInput] = useState("");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const scrollRef = useRef(null);
  const downloadMenuRef = useRef(null);


  useEffect(() => {
    if (scrollRef.current && isGenerating) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [generatedLOR, isGenerating]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTweakSubmit = (e) => {
    e.preventDefault();
    if (tweakInput.trim() && onTweak) {
      onTweak(tweakInput.trim());
      setTweakInput("");
    }
  };

  const handleDownload = (format) => {
    if (!generatedLOR) return;

    const blob = new Blob([generatedLOR], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `letter_of_recommendation.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  return (
    <section 
      className="bg-white rounded-2xl p-5 text-black h-full flex flex-col overflow-hidden w-full"
      style={{
        transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isFullscreen 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          : '0 1px 0 rgba(0,0,0,0.04), 0 6px 18px rgba(2,6,23,0.6), 0 2px 6px rgba(2,6,23,0.4)',
        transform: isFullscreen ? 'scale(1)' : 'scale(1)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">
          {generatedLOR ? "Generated Letter" : "Example Letters"}
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Download Button with Dropdown */}
          {generatedLOR && !isGenerating && (
            <div className="relative" ref={downloadMenuRef}>
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
              >
                <Download size={14} />
                Download
                <ChevronDown size={12} />
              </button>
              
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => handleDownload("txt")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
                  >
                    .txt
                  </button>
                  <button
                    onClick={() => handleDownload("doc")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    .doc
                  </button>
                  <button
                    onClick={() => handleDownload("md")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg"
                  >
                    .md
                  </button>
                </div>
              )}
            </div>
          )}
          
     
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 size={18} />
            ) : (
              <Maximize2 size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden mb-3 min-h-0 w-full">
        {generatedLOR || isGenerating ? (
          <div ref={scrollRef} className="h-full overflow-y-auto pr-2 custom-scrollbar w-full">
            <StreamingText text={generatedLOR} isStreaming={isGenerating} />
          </div>
        ) : (
          <PrewrittenCarousel
            letters={letters}
            cycleInterval={3000}
            isActive={isActive}
          />
        )}
      </div>

      {generatedLOR && !isGenerating && (
        <form onSubmit={handleTweakSubmit} className="shrink-0 w-full">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-full">
            <input
              type="text"
              value={tweakInput}
              onChange={(e) => setTweakInput(e.target.value)}
              placeholder="Type tweaks and press Enter..."
              className="flex-1 bg-transparent outline-none text-black placeholder-gray-400 text-sm"
            />
            <button
              type="submit"
              className="text-xs px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Apply
            </button>
          </div>
        </form>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <style jsx global>{`
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  );
}