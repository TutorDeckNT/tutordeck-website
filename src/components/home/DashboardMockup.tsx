import React from 'react';

interface DashboardMockupProps {
  activeStep: number; // 0: Log, 1: Track, 2: Verify
}

const DashboardMockup = ({ activeStep }: DashboardMockupProps) => {
  
  // Logic to determine the 3D rotation and scale of the "Camera"
  const getTransformStyles = () => {
    switch (activeStep) {
      case 0: // Log Mode: Slight tilt, focused on the floating modal
        return { transform: 'rotateX(5deg) rotateY(-5deg) scale(1)' };
      case 1: // Track Mode: Tilted to emphasize the depth of the charts
        return { transform: 'rotateX(5deg) rotateY(-12deg) scale(1.1) translateX(20px)' };
      case 2: // Verify Mode: Flat and zoomed in to read the document
        return { transform: 'rotateX(0deg) rotateY(0deg) scale(1.05)' };
      default:
        return { transform: 'rotateX(5deg) rotateY(-5deg) scale(1)' };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex items-center justify-center perspective-1000">
      
      {/* --- LAYER 0: Ambient Glow (Backlight) --- */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] transition-colors duration-1000 ${
          activeStep === 2 ? 'bg-blue-600/20' : 'bg-primary/20'
        }`} 
      />

      {/* --- LAYER 1: The Camera Rig (Main 3D Container) --- */}
      <div 
        className="relative w-full max-w-4xl bg-dark-card/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] transform-style-3d"
        style={getTransformStyles()}
      >
        
        {/* Fake Browser Header (Glass effect) */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-inner"></div>
          </div>
          <div className="ml-4 h-6 w-64 bg-black/20 rounded-md flex items-center px-3 border border-white/5">
             <span className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
               <i className="fas fa-lock text-[8px]"></i> tutordeck.org/dashboard
             </span>
          </div>
        </div>

        {/* --- LAYER 2: Main Dashboard UI --- */}
        <div className="flex h-[500px] relative">
          
          {/* Left Sidebar */}
          <div className="w-20 bg-black/20 border-r border-white/5 flex flex-col items-center py-6 gap-6 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 text-dark-bg font-bold text-lg">
               T
            </div>
            <div className="flex-1 w-full flex flex-col items-center gap-4 mt-4">
               {[1,2,3,4].map((i) => (
                 <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300 ${i===1 ? 'bg-white/10 text-white shadow-inner' : ''}`}>
                   <i className={`fas fa-${['home','chart-pie','calendar','cog'][i-1]}`}></i>
                 </div>
               ))}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20"></div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 bg-dark-bg/40 p-8 relative overflow-hidden">
            
            {/* Focus Handler: Blurs the dashboard when the Transcript Overlay is active */}
            <div className={`transition-all duration-700 ease-in-out ${activeStep === 2 ? 'blur-sm opacity-30 scale-95' : 'blur-0 opacity-100 scale-100'}`}>
              
              {/* Header Area */}
              <div className="flex justify-between items-end mb-8">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-1">Mission Control</h2>
                   <p className="text-gray-400 text-sm">Welcome back, Volunteer.</p>
                </div>
                {/* "Log Activity" Button: Pulses and glows in Step 0 */}
                <div className={`px-4 py-2 bg-primary text-dark-bg font-bold rounded-lg text-sm transition-all duration-500 shadow-lg flex items-center gap-2 ${activeStep === 0 ? 'scale-110 shadow-primary/50 ring-2 ring-primary/50' : 'opacity-70'}`}>
                  <i className="fas fa-plus-circle"></i> Log Hours
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { l: 'Total Hours', v: '124.5', i: 'clock', c: 'text-primary' },
                  { l: 'Sessions', v: '42', i: 'check-circle', c: 'text-secondary' },
                  { l: 'Impact', v: 'Gold', i: 'medal', c: 'text-yellow-400' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-dark-card/60 border border-white/10 p-4 rounded-xl backdrop-blur-md flex flex-col justify-between h-28 group hover:border-white/20 transition-colors">
                     <div className={`text-xl ${stat.c} mb-auto`}><i className={`fas fa-${stat.i}`}></i></div>
                     <div>
                       <div className="text-2xl font-bold text-white tracking-tight">{stat.v}</div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{stat.l}</div>
                     </div>
                  </div>
                ))}
              </div>

              {/* Chart Section: Bars animate in Step 1 */}
              <div className="bg-dark-card/60 border border-white/10 rounded-xl p-6 h-64 relative overflow-hidden">
                 <div className="flex justify-between mb-6 relative z-10">
                    <div>
                      <h3 className="font-bold text-white text-sm">Activity Trends</h3>
                      <p className="text-xs text-gray-500">Last 6 Months</p>
                    </div>
                 </div>
                 
                 {/* The Bars */}
                 <div className="absolute inset-x-6 bottom-6 h-32 flex items-end justify-between gap-3">
                    {[35, 55, 40, 70, 45, 90, 65, 85].map((h, i) => (
                      <div key={i} className="w-full bg-white/5 rounded-t-sm relative">
                         <div 
                           className={`absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-primary/60 to-primary transition-all duration-1000 ease-out ${activeStep === 1 ? 'opacity-100 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'opacity-50'}`}
                           style={{ 
                             height: `${h}%`, 
                             transitionDelay: activeStep === 1 ? `${i * 100}ms` : '0ms' 
                           }}
                         ></div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* --- LAYER 3: FLOATING OVERLAYS --- */}

            {/* Overlay 1: Log Activity Modal (Visible in Step 0) */}
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-dark-card/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                activeStep === 0 
                  ? 'opacity-100 scale-100 translate-y-[-50%]' 
                  : 'opacity-0 scale-90 translate-y-[-40%] pointer-events-none'
              }`}
            >
               <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl ring-2 ring-primary/30">
                    <i className="fas fa-stopwatch"></i>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">Log Session</div>
                    <div className="text-xs text-gray-400">Peer Tutoring • 1.5 hrs</div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase font-bold">Proof of Work</div>
                    <div className="h-10 bg-black/40 rounded-lg border border-white/10 flex items-center px-3 gap-2">
                       <i className="fas fa-file-audio text-primary"></i>
                       <span className="text-xs text-gray-300">recording-session.mp3</span>
                    </div>
                  </div>
                  <div className="pt-2">
                     <div className="h-10 w-full bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center text-sm font-bold text-dark-bg">
                       Submit Activity
                     </div>
                  </div>
               </div>
            </div>

            {/* Overlay 2: Official Transcript (Visible in Step 2) */}
            <div 
               className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                 activeStep === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
               }`}
            >
               <div 
                 className={`w-[320px] bg-white text-black rounded-sm shadow-2xl p-8 relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] origin-bottom ${
                   activeStep === 2 
                     ? 'translate-y-0 rotate-x-0 scale-100' 
                     : 'translate-y-32 rotate-x-45 scale-90'
                 }`}
               >
                  {/* Decorative: Paper Shine/Texture */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-yellow-50 to-white transform rotate-45 opacity-50"></div>

                  {/* Document Header */}
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm">
                          <i className="fas fa-graduation-cap text-sm"></i>
                        </div>
                        <div className="font-bold text-lg leading-tight">TutorDeck<br/><span className="text-[10px] font-normal text-gray-500 uppercase tracking-widest">Official Record</span></div>
                     </div>
                     <div className="w-12 h-12 bg-black p-0.5">
                        <div className="w-full h-full bg-white grid grid-cols-3 gap-0.5 p-0.5">
                           {[...Array(9)].map((_,i) => <div key={i} className="bg-black"></div>)}
                        </div>
                     </div>
                  </div>

                  {/* Document Body */}
                  <div className="space-y-5 mb-10 relative z-10">
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Volunteer Name</span>
                        <span className="text-sm font-bold">Manav A.</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Total Hours</span>
                        <span className="text-sm font-bold">124.5</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Date Issued</span>
                        <span className="text-sm font-bold">Oct 26, 2025</span>
                     </div>
                  </div>

                  {/* Footer / Gold Seal */}
                  <div className="flex justify-between items-end relative z-10">
                     <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative group">
                        <div className="absolute inset-1 border border-white/40 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                        <i className="fas fa-check text-white text-2xl drop-shadow-sm"></i>
                        {/* Shine Effect on Seal */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <div className="text-right">
                        <div className="text-[8px] text-gray-400 mb-1">AUTHORIZED SIGNATURE</div>
                        <div className="h-6 w-24 bg-contain bg-no-repeat bg-right" style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMjAiPjxwYXRoIGQ9Ik0xMCwxMCBDMjAsMCA0MCwyMCA1MCwxMCBDNjAsMCA4MCwyMCA5MCwxMCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+")' }}></div> 
                     </div>
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
