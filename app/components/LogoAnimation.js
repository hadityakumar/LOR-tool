"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function LogoAnimation({ onComplete, showNavbarElements }) {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsAnimating(true);

      setTimeout(() => {
        onComplete();
      }, 800);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      
      <nav 
        className="w-full backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm transition-opacity duration-700"
        style={{ opacity: isAnimating ? 1 : 0 }}
      >
        <div className="flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-8">
            <div className="w-10 h-10" style={{ visibility: 'hidden' }} />
            
     
            <div 
              className="hidden md:flex items-center gap-8 transition-opacity duration-500 delay-300"
              style={{ 
                opacity: showNavbarElements ? 1 : 0,
              }}
            >
              <a href="#" className="text-black hover:text-gray-600 transition font-medium">
                Home
              </a>
              <a href="#" className="text-black hover:text-gray-600 transition font-medium">
                Products
              </a>
              <a href="#" className="text-black hover:text-gray-600 transition font-medium">
                Pricing
              </a>
            </div>
          </div>

     
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition opacity-0"
            style={{ 
              opacity: showNavbarElements ? 1 : 0,
              transitionDelay: '300ms'
            }}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
          </button>
        </div>


        {isMenuOpen && showNavbarElements && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-md">
            <div className="px-6 py-4 space-y-3">
              <a href="#" className="block text-black hover:text-gray-600 transition font-medium py-2">
                Home
              </a>
              <a href="#" className="block text-black hover:text-gray-600 transition font-medium py-2">
                Products
              </a>
              <a href="#" className="block text-black hover:text-gray-600 transition font-medium py-2">
                Pricing
              </a>
            </div>
          </div>
        )}
      </nav>

      <div
        className="fixed transition-all duration-700 ease-in-out"
        style={{
          top: isAnimating ? "-24px" : "50vh",
          left: isAnimating ? "55px" : "50vw",
          transform: isAnimating 
            ? "translate(0, 0) scale(0.39)" 
            : "translate(-50%, -50%) scale(1)",
          zIndex: 70,
        }}
      >
        <div className="flex items-center gap-1">
          <div className="w-32 h-32 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              className="w-full h-full"
            >
              <g transform="translate(512, 512)">
                <circle
                  cx="0"
                  cy="0"
                  r="220"
                  fill="none"
                  stroke="rgb(0,0,0)"
                  strokeWidth="10"
                />
                <g transform={`rotate(${rotation})`}>
                  <g transform="translate(0, -220)">
                    <circle cx="0" cy="0" r="40" fill="rgb(0,0,0)" />
                    <circle
                      cx="0"
                      cy="0"
                      r="40"
                      fill="none"
                      stroke="rgb(255,255,255)"
                      strokeWidth="8"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <span
            className="text-6xl text-black tracking-[10px] whitespace-nowrap"
            style={{
              fontFamily: '"Helvetica Neue", "Segoe UI", "Roboto", sans-serif',
              fontWeight: 200,
              lineHeight: 1,
            }}
          >
            RBIT
          </span>
        </div>
      </div>


      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 transition-opacity duration-500"
        style={{ 
          opacity: isAnimating ? 0 : 1,
          marginTop: '8rem',
          zIndex: 60
        }}
      >
        <h1 className="text-3xl text-black font-light tracking-wide">
          AI-Letter of Recommendation Writer
        </h1>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
