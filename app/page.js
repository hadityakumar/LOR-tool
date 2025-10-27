"use client";

import React, { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import LogoAnimation from "./components/LogoAnimation";
import OnboardingFlow from "./components/OnboardingFlow";
import { PREWRITTEN_LORS } from "./constants/prewrittenLors";

export default function Page() {
  const [showLogoAnimation, setShowLogoAnimation] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [qualities, setQualities] = useState([]);
  const [softTraits, setSoftTraits] = useState([]);
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const [generatedLOR, setGeneratedLOR] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    duration: "",
    institution: "",
    targetProgram: "",
    targetInstitution: "",
    field: "",
    achievements: "",
    anecdote: "",
    referrer: "",
    tone: "",
    lorType: "",
    strength: "",
  });

  const recognitionRef = useRef(null);

  const handleMicInput = (field) => {
    const win = typeof window !== "undefined" ? window : null;
    const SpeechRecognition = win && (win.SpeechRecognition || win.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] ? prev[field] + " " : "") + text,
      }));
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCVUpload = () => {
    //will hav 2 implement this latter
  };

  const handleChipAdd = (field, value) => {
    if (!value || value.trim() === "") return;
    const v = value.trim();
    if (field === "qualities") {
      if (!qualities.includes(v)) setQualities((s) => [...s, v]);
    } else if (field === "softTraits") {
      if (!softTraits.includes(v)) setSoftTraits((s) => [...s, v]);
    }
  };

  const handleChipRemove = (field, value) => {
    if (field === "qualities") setQualities((s) => s.filter((c) => c !== value));
    if (field === "softTraits") setSoftTraits((s) => s.filter((c) => c !== value));
  };

  const handleGenerateLOR = async () => {
    setIsCarouselActive(false);
    setIsGenerating(true);
    setGeneratedLOR("");
    
    try {
      const response = await fetch("/api/generate-lor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          qualities,
          softTraits,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate LOR");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setGeneratedLOR(accumulatedText);
      }

      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating LOR:", error);
      alert("Failed to generate LOR. Please try again.");
      setIsCarouselActive(true);
      setIsGenerating(false);
    }
  };

  const handleTweakLOR = async (tweakRequest) => {
    if (!generatedLOR) return;

    setIsGenerating(true);
    setGeneratedLOR("");
    
    try {
      const response = await fetch("/api/tweak-lor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentLOR: generatedLOR,
          tweakRequest,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to tweak LOR");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setGeneratedLOR(accumulatedText);
      }

      setIsGenerating(false);
    } catch (error) {
      console.error("Error tweaking LOR:", error);
      alert("Failed to tweak LOR. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleLogoAnimationComplete = () => {
    setLogoAnimationComplete(true);
    setTimeout(() => {
      setShowLogoAnimation(false);
      setShowOnboarding(true);
    }, 100);
  };

  const handleOnboardingComplete = (data) => {
    setFormData(data);
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  if (showLogoAnimation) {
    return (
      <div className="min-h-screen max-h-screen overflow-hidden bg-white text-black flex flex-col relative">
        <LogoAnimation 
          onComplete={handleLogoAnimationComplete}
          showNavbarElements={logoAnimationComplete}
        />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen max-h-screen overflow-hidden bg-white text-black flex flex-col relative">
        <Navbar />
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-white text-black flex flex-col relative">
      <Navbar />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden min-h-0 w-full relative px-6 py-4">
        <div 
          className="perspective-container min-h-0 w-full"
          style={{
            transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isFullscreen ? 0 : 1,
            transform: isFullscreen ? 'scale(0.9)' : 'scale(1)',
            pointerEvents: isFullscreen ? 'none' : 'auto'
          }}
        >
          <LeftPanel
            formData={formData}
            onChange={handleChange}
            onMic={handleMicInput}
            qualities={qualities}
            softTraits={softTraits}
            onAddChip={handleChipAdd}
            onRemoveChip={handleChipRemove}
            onCVUpload={handleCVUpload}
            onGenerate={handleGenerateLOR}
            isGenerating={isGenerating}
          />
        </div>

        <div 
          className="perspective-container min-h-0 w-full"
          style={{
            transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFullscreen 
              ? 'translate(calc(-50vw + 50%), calc(-50vh + 50% + 2rem)) scale(1.0)' 
              : 'translate(0, 0) scale(1)',
            transformOrigin: 'center center',
            zIndex: isFullscreen ? 50 : 'auto',
          }}
        >
          <RightPanel 
            letters={PREWRITTEN_LORS} 
            isActive={isCarouselActive} 
            generatedLOR={generatedLOR}
            isGenerating={isGenerating}
            onTweak={handleTweakLOR}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      </main>

      {/* Overlay when fullscreen */}
      <div 
        className="fixed inset-0 bg-black z-40 pointer-events-none"
        style={{
          transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isFullscreen ? 0.7 : 0,
          pointerEvents: isFullscreen ? 'auto' : 'none'
        }}
        onClick={() => setIsFullscreen(false)}
      />

      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
          box-shadow:
            0 1px 0 rgba(0,0,0,0.04),
            0 6px 18px rgba(2,6,23,0.6),
            0 2px 6px rgba(2,6,23,0.4);
        }

        .card-3d:hover {
          transform: rotateX(2deg) rotateY(-2deg);
        }

        @keyframes lineIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes letterIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
