import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between mx-30 px-6 py-4">
      
        <div className="flex items-center gap-8">
        
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className="w-full h-full">
              
                <g transform="translate(512, 512)">
                  <circle cx="0" cy="0" r="220" fill="none" stroke="rgb(0,0,0)" strokeWidth="10"/>
                  
              
                  <g transform={`rotate(${rotation})`}>
                    <g transform="translate(0, -220)">
                      <circle cx="0" cy="0" r="40" fill="rgb(0,0,0)"/>
                      <circle cx="0" cy="0" r="40" fill="none" stroke="rgb(255,255,255)" strokeWidth="8"/>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span 
              className="text-2xl text-black tracking-[10px]" 
              style={{ 
                fontFamily: '"Helvetica Neue", "Segoe UI", "Roboto", sans-serif',
                fontWeight: 100,
                lineHeight: 1,
                whiteSpace: 'pre-wrap',
                fontStretch: 'ultra-condensed'
              }}
            >
              RBIT
            </span>
          </div>

      
          <div className="hidden md:flex items-center gap-8">
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
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
        </button>
      </div>

    
      {isMenuOpen && (
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
  );
}