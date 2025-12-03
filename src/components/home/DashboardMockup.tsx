--- START OF FILE DashboardMockup.tsx ---

import React from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useReducedMotion
} from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface DashboardMockupProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
}

const DashboardMockup = ({ scrollContainerRef }: DashboardMockupProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  // --- TIMELINE DEFINITION ---
  // 0.00 -> 0.25: PHASE 1: LOG (Modal visible, Camera angled left)
  // 0.25 -> 0.35: TRANSITION 1 (Modal exits, Camera centers)
  // 0.35 -> 0.65: PHASE 2: TRACK (Charts grow, Dashboard clear)
  // 0.65 -> 0.75: TRANSITION 2 (Dashboard blurs, Document enters)
  // 0.75 -> 1.00: PHASE 3: VERIFY (Document fully visible)

  // --- 1. Camera Rig (Rotations & Scale) ---
  const rotateX = useTransform(
    smoothProgress, 
    [0, 0.25, 0.35, 0.65, 0.75, 1], 
    isDesktop && !prefersReducedMotion 
      ? [5, 5, 5, 5, 0, 0]   // Tilt stays consistent until Document phase
      : [0, 0, 0, 0, 0, 0]
  );
  
  const rotateY = useTransform(
    smoothProgress, 
    [0, 0.25, 0.35, 0.65, 0.75, 1], 
    isDesktop && !prefersReducedMotion 
      ? [-5, -5, -12, -12, 0, 0] // Log(-5) -> Track(-12) -> Verify(0)
      : [0, 0, 0, 0, 0, 0]
  );
  
  const scale = useTransform(
    smoothProgress, 
    [0, 0.25, 0.35, 0.65, 0.75, 1], 
    isDesktop 
      ? [1, 1, 1.1, 1.1, 1.05, 1.05] // Zoom in for Charts, slight pull back for Doc
      : [1, 1, 1, 1, 1, 1]
  );

  const x = useTransform(
    smoothProgress,
    [0, 0.25, 0.35, 0.65, 0.75, 1],
    isDesktop 
      ? ["0%", "0%", "5%", "5%", "0%", "0%"] // Shift right during Track phase to center charts
      : ["0%", "0%", "0%", "0%", "0%", "0%"]
  );

  // --- 2. Scene 1: Log Modal ---
  // Exits strictly during Transition 1
  const modalOpacity = useTransform(smoothProgress, [0.25, 0.35], [1, 0]);
  const modalY = useTransform(smoothProgress, [0.25, 0.35], ["-50%", "-60%"]);
  const modalBlur = useTransform(smoothProgress, [0.25, 0.35], ["0px", "10px"]);
  const modalPointerEvents = useTransform(smoothProgress, (v: number) => v > 0.3 ? 'none' : 'auto');

  // --- 3. Scene 2: Charts ---
  // Grow during the early part of Phase 2
  const barStart = 0.35;
  const barEnd = 0.55;
  
  const bar1Height = useTransform(smoothProgress, [barStart, barEnd], ["0%", "35%"]);
  const bar2Height = useTransform(smoothProgress, [barStart + 0.02, barEnd], ["0%", "55%"]);
  const bar3Height = useTransform(smoothProgress, [barStart + 0.04, barEnd], ["0%", "40%"]);
  const bar4Height = useTransform(smoothProgress, [barStart + 0.06, barEnd], ["0%", "70%"]);
  const bar5Height = useTransform(smoothProgress, [barStart + 0.08, barEnd], ["0%", "45%"]);
  const bar6Height = useTransform(smoothProgress, [barStart + 0.10, barEnd], ["0%", "90%"]);
  const bar7Height = useTransform(smoothProgress, [barStart + 0.12, barEnd], ["0%", "65%"]);
  const bar8Height = useTransform(smoothProgress, [barStart + 0.14, barEnd], ["0%", "85%"]);
  
  const chartGlowOpacity = useTransform(smoothProgress, [barStart, barEnd], [0, 0.6]); // Reduced max opacity for clarity

  // --- 4. Scene 3: Document ---
  // Enters during Transition 2
  const docY = useTransform(smoothProgress, [0.65, 0.75], ["120%", "0%"]);
  const docRotateX = useTransform(smoothProgress, [0.65, 0.75], [45, 0]);
  const docOpacity = useTransform(smoothProgress, [0.65, 0.70], [0, 1]);
  
  // Dashboard background blurs out ONLY when Document enters
  const dashboardBlur = useTransform(smoothProgress, [0.65, 0.75], ["0px", "4px"]);
  const dashboardOpacity = useTransform(smoothProgress, [0.65, 0.75], [1, 0.4]);

  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex items-center justify-center perspective-1000" aria-hidden="true">
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px]"
        style={{
          backgroundColor: useTransform(
            smoothProgress, 
            [0, 0.6, 1], 
            ["rgba(52, 211, 153, 0.2)", "rgba(52, 211, 153, 0.2)", "rgba(37, 99, 235, 0.2)"]
          )
        }} 
      />

      <motion.div 
        className="relative w-full max-w-4xl bg-dark-card/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform-style-3d will-change-transform"
        style={{ rotateX, rotateY, scale, x }}
      >
        {/* Browser Header */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 backface-hidden">
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

        <div className="flex h-[500px] relative">
          {/* Sidebar */}
          <div className="w-20 bg-black/20 border-r border-white/5 flex flex-col items-center py-6 gap-6 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 text-dark-bg font-bold text-lg">T</div>
            <div className="flex-1 w-full flex flex-col items-center gap-4 mt-4">
               {[1,2,3,4].map((i) => (
                 <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300 ${i===1 ? 'bg-white/10 text-white shadow-inner' : ''}`}>
                   <i className={`fas fa-${['home','chart-pie','calendar','cog'][i-1]}`}></i>
                 </div>
               ))}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20"></div>
          </div>

          {/* Main Dashboard Content */}
          <motion.div 
            className="flex-1 bg-dark-bg/40 p-8 relative overflow-hidden"
            style={{ filter: useTransform(dashboardBlur, (v: string) => `blur(${v})`), opacity: dashboardOpacity }}
          >
            <div className="flex justify-between items-end mb-8">
              <div>
                 <h2 className="text-2xl font-bold text-white mb-1">Mission Control</h2>
                 <p className="text-gray-400 text-sm">Welcome back, Volunteer.</p>
              </div>
              <motion.div 
                className="px-4 py-2 bg-primary text-dark-bg font-bold rounded-lg text-sm flex items-center gap-2 shadow-lg"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: ["0 0 0px rgba(52,211,153,0)", "0 0 20px rgba(52,211,153,0.5)", "0 0 0px rgba(52,211,153,0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <i className="fas fa-plus-circle"></i> Log Hours
              </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { l: 'Total Hours', v: '124.5', i: 'clock', c: 'text-primary' },
                { l: 'Sessions', v: '42', i: 'check-circle', c: 'text-secondary' },
                { l: 'Impact', v: 'Gold', i: 'medal', c: 'text-yellow-400' },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx} 
                  className="bg-dark-card/60 border border-white/10 p-4 rounded-xl backdrop-blur-md flex flex-col justify-between h-28"
                  style={{ y: useTransform(smoothProgress, [0, 1], [0, (idx + 1) * -10]) }}
                >
                   <div className={`text-xl ${stat.c} mb-auto`}><i className={`fas fa-${stat.i}`}></i></div>
                   <div>
                     <div className="text-2xl font-bold text-white tracking-tight">{stat.v}</div>
                     <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{stat.l}</div>
                   </div>
                </motion.div>
              ))}
            </div>

            {/* Chart Section */}
            <div className="bg-dark-card/60 border border-white/10 rounded-xl p-6 h-64 relative overflow-hidden">
               <div className="flex justify-between mb-6 relative z-10">
                  <div>
                    <h3 className="font-bold text-white text-sm">Activity Trends</h3>
                    <p className="text-xs text-gray-500">Last 6 Months</p>
                  </div>
               </div>
               
               <div className="absolute inset-x-6 bottom-6 h-32 flex items-end justify-between gap-3">
                  {[bar1Height, bar2Height, bar3Height, bar4Height, bar5Height, bar6Height, bar7Height, bar8Height].map((height, i) => (
                    <div key={i} className="w-full bg-white/5 rounded-t-sm relative h-full flex items-end">
                       {/* 
                          FIX: Render Glow FIRST so it sits BEHIND the solid bar. 
                          This prevents the "blurred upper part" issue.
                       */}
                       <motion.div 
                          className="absolute inset-x-0 bottom-0 bg-primary blur-md rounded-t-sm"
                          style={{ height, opacity: chartGlowOpacity }}
                       />
                       <motion.div 
                         className="w-full rounded-t-sm bg-gradient-to-t from-primary/60 to-primary relative z-10"
                         style={{ height }}
                       />
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Modal Overlay (Scene 1) */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[340px] bg-dark-card/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6"
          style={{ 
            opacity: modalOpacity, 
            y: modalY, 
            x: "-50%",
            filter: useTransform(modalBlur, (v: string) => `blur(${v})`),
            pointerEvents: modalPointerEvents
          }}
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
        </motion.div>

        {/* Document Overlay (Scene 3) */}
        <motion.div 
           className="absolute inset-0 flex items-center justify-center"
           style={{ 
             y: docY, 
             rotateX: isDesktop ? docRotateX : 0, 
             opacity: docOpacity 
           }}
        >
           <div className="w-[320px] bg-white text-black rounded-sm shadow-2xl p-8 relative overflow-hidden origin-bottom">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-yellow-50 to-white transform rotate-45 opacity-50"></div>

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

              <div className="flex justify-between items-end relative z-10">
                 <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-1 border border-white/40 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                    <i className="fas fa-check text-white text-2xl drop-shadow-sm relative z-10"></i>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent"
                      style={{ x: useTransform(smoothProgress, [0.8, 1.0], ["-100%", "100%"]) }}
                    />
                 </div>
                 <div className="text-right">
                    <div className="text-[8px] text-gray-400 mb-1">AUTHORIZED SIGNATURE</div>
                    <div className="h-6 w-24 bg-contain bg-no-repeat bg-right" style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMjAiPjxwYXRoIGQ9Ik0xMCwxMCBDMjAsMCA0MCwyMCA1MCwxMCBDNjAsMCA4MCwyMCA5MCwxMCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+")' }}></div> 
                 </div>
              </div>
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DashboardMockup;
