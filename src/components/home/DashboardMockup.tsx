--- START OF FILE src/components/home/DashboardMockup.tsx ---

import React from 'react';

interface DashboardMockupProps {
  activeStep: number; // 0: Log, 1: Track, 2: Verify
}

const DashboardMockup = ({ activeStep }: DashboardMockupProps) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto perspective-1000">
      <div 
        className="relative bg-dark-card border border-gray-700 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-700 ease-out rotate-y-12 rotate-x-6 hover:rotate-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* --- Fake Browser Header --- */}
        <div className="bg-gray-800 p-3 flex items-center gap-2 border-b border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 bg-gray-900 rounded-md px-3 py-1 text-xs text-gray-500 flex-1 text-center font-mono">
            tutordeck.org/dashboard
          </div>
        </div>

        {/* --- Dashboard Content --- */}
        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-16 md:w-64 bg-gray-900 border-r border-gray-800 p-4 hidden md:flex flex-col gap-4">
            <div className="h-8 w-8 bg-primary rounded-full mb-6"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
            <div className="mt-auto h-12 w-full bg-gray-800 rounded-lg"></div>
          </div>

          {/* Main Area */}
          <div className="flex-1 bg-dark-bg p-6 md:p-8 overflow-hidden relative">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-800 rounded"></div>
              </div>
              <div className={`px-4 py-2 rounded-lg bg-primary text-dark-bg font-bold transition-all duration-500 ${activeStep === 0 ? 'scale-110 ring-4 ring-primary/50' : 'opacity-70'}`}>
                + Log Activity
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`bg-dark-card p-4 rounded-lg border border-gray-700 transition-all duration-500 ${activeStep === 1 ? 'scale-105 border-primary shadow-[0_0_15px_rgba(52,211,153,0.2)]' : ''}`}>
                  <div className="h-8 w-8 bg-gray-800 rounded mb-2"></div>
                  <div className="h-6 w-16 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="bg-dark-card border border-gray-700 rounded-lg p-4 h-48 mb-8 flex items-end justify-between gap-2">
              {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <div key={i} className="w-full bg-gray-800 rounded-t-sm transition-all duration-1000" style={{ height: `${activeStep === 1 ? h : h * 0.5}%` }}></div>
              ))}
            </div>

            {/* Transcript / Verification Overlay (Step 2) */}
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ${activeStep === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="bg-white text-black p-8 rounded-lg shadow-2xl max-w-sm w-full transform rotate-3">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-black rounded-full"></div>
                  <div className="text-right">
                    <div className="h-4 w-24 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="h-16 w-16 bg-black p-1">
                    <div className="w-full h-full bg-white"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
