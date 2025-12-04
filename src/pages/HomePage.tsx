import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Reveal from '../components/Reveal';
import EventModal from '../components/EventModal';
import DashboardMockup from '../components/home/DashboardMockup';
import BentoGrid from '../components/home/BentoGrid';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- SCROLL ANIMATION LOGIC ---
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress for a weighty, "Apple-like" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- TEXT STACK TRANSFORMS ---
  // We map the scroll progress to Opacity, Y-position, and Blur for each text block.
  // Act 1: Log (0.00 - 0.33)
  const text1Opacity = useTransform(smoothProgress, [0, 0.1, 0.25, 0.33], [0, 1, 1, 0]);
  const text1Y = useTransform(smoothProgress, [0, 0.1, 0.25, 0.33], [20, 0, 0, -20]);
  const text1Blur = useTransform(smoothProgress, [0.25, 0.33], ["0px", "10px"]);

  // Act 2: Track (0.33 - 0.66)
  const text2Opacity = useTransform(smoothProgress, [0.33, 0.43, 0.58, 0.66], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.33, 0.43, 0.58, 0.66], [20, 0, 0, -20]);
  const text2Blur = useTransform(smoothProgress, [0.58, 0.66], ["0px", "10px"]);

  // Act 3: Verify (0.66 - 1.00)
  const text3Opacity = useTransform(smoothProgress, [0.66, 0.76, 0.9, 1.0], [0, 1, 1, 0]);
  const text3Y = useTransform(smoothProgress, [0.66, 0.76, 0.9, 1.0], [20, 0, 0, -20]);
  const text3Blur = useTransform(smoothProgress, [0.9, 1.0], ["0px", "10px"]);

  return (
    <>
      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <main className="bg-dark-bg">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-students-in-a-classroom-2322-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/50 to-dark-bg"></div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-dark-bg"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <Reveal variant="fade-up" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 cursor-pointer hover:bg-white/20 transition-colors" onClick={() => setIsModalOpen(true)}>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Upcoming: Student Outreach Program</span>
              <i className="fas fa-chevron-right text-xs text-gray-400"></i>
            </Reveal>

            <Reveal variant="blur-in" delay={0.2}>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                Your Academic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary">Legacy Starts Here.</span>
              </h1>
            </Reveal>

            <Reveal variant="fade-up" delay={0.5}>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
                Join the student-led movement redefining peer education. <br className="hidden md:block"/>
                No paper logs. No barriers. Just impact.
              </p>
            </Reveal>

            <Reveal variant="zoom-in" delay={0.8} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-involved" className="group relative px-8 py-4 bg-primary text-dark-bg font-bold rounded-full overflow-hidden">
                <span className="relative z-10 group-hover:text-white transition-colors">Join the Movement</span>
                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
              </Link>
              <button onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 text-white font-semibold hover:text-primary transition-colors">
                Learn More
              </button>
            </Reveal>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
            <i className="fas fa-chevron-down"></i>
          </div>
        </section>

        {/* --- 2. MISSION SECTION --- */}
        <section id="mission" className="py-32 bg-dark-bg relative">
          <div className="container mx-auto px-6">
            <Reveal variant="fade-up" className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight text-gray-700">
                We believe in the power of students <br />
                <span className="text-white transition-colors duration-700">to lift each other up.</span>
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-12 rounded-full"></div>
            </Reveal>
          </div>
        </section>

        {/* --- 3. SCROLL TUNNEL EXPERIENCE --- */}
        {/* 
            This container is 400vh tall to create the scroll track.
            The content inside is sticky.
        */}
        <div ref={scrollRef} className="relative h-[400vh] bg-dark-bg">
          <div className="sticky top-0 h-screen overflow-hidden flex flex-col lg:flex-row items-center justify-center container mx-auto px-6">
            
            {/* LEFT COLUMN: Text Stack */}
            <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start relative z-20 h-full pointer-events-none">
              <div className="relative w-full max-w-lg h-64">
                
                {/* Text Block 1: Log */}
                <motion.div 
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{ opacity: text1Opacity, y: text1Y, filter: useTransform(text1Blur, v => `blur(${v})`) }}
                >
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary font-mono text-xs border border-primary/20 w-fit">01. LOG</div>
                  <h3 className="text-5xl font-bold text-white mb-6">Log with Ease.</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Forget lost paper forms. Upload audio proof directly from your phone, select your activity, and log hours in seconds.
                  </p>
                </motion.div>

                {/* Text Block 2: Track */}
                <motion.div 
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{ opacity: text2Opacity, y: text2Y, filter: useTransform(text2Blur, v => `blur(${v})`) }}
                >
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary/10 text-secondary font-mono text-xs border border-secondary/20 w-fit">02. TRACK</div>
                  <h3 className="text-5xl font-bold text-white mb-6">Gamified Impact.</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Watch your hours grow. Our automated tier system unlocks Bronze, Silver, and Gold awards as you hit milestones.
                  </p>
                </motion.div>

                {/* Text Block 3: Verify */}
                <motion.div 
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{ opacity: text3Opacity, y: text3Y, filter: useTransform(text3Blur, v => `blur(${v})`) }}
                >
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-green-500/10 text-green-400 font-mono text-xs border border-green-500/20 w-fit">03. VERIFY</div>
                  <h3 className="text-5xl font-bold text-white mb-6">Official Transcripts.</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    University-ready documentation at the click of a button. Generate verifiable PDF transcripts with unique QR codes.
                  </p>
                </motion.div>

              </div>
            </div>

            {/* RIGHT COLUMN: Reactive Mockup */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative z-10">
               {/* We pass the smoothProgress down so the mockup can sync perfectly */}
               <DashboardMockup smoothProgress={smoothProgress} />
            </div>

          </div>
        </div>

        {/* --- 4. BENTO GRID --- */}
        <div className="relative overflow-hidden">
            <BentoGrid />
        </div>

        {/* --- 5. COMMUNITY SECTION --- */}
        <section className="py-24 bg-dark-card overflow-hidden">
          <div className="container mx-auto px-6 mb-12">
            <Reveal>
              <h2 className="text-4xl font-bold text-white">Our Leaders</h2>
            </Reveal>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-12 px-6 snap-x snap-mandatory no-scrollbar">
            {[
              { name: "Manav A.", role: "President of Internal Affairs", quote: "Building a legacy.", color: "bg-blue-500" },
              { name: "Shaurya J.", role: "President of External Affairs", quote: "Efficiency is key.", color: "bg-purple-500" },
              { name: "Aakanksh R.", role: "President of Student Academics", quote: "Connecting minds.", color: "bg-green-500" },
              { name: "Alwin John", role: "Richland Head", quote: "Expanding horizons.", color: "bg-orange-500" },
            ].map((leader, idx) => (
              <div key={idx} className="snap-center flex-shrink-0 w-80 h-96 bg-gray-800 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                <div className={`absolute inset-0 opacity-20 ${leader.color}`}></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <p className="text-gray-300 italic mb-2">"{leader.quote}"</p>
                  <h3 className="text-2xl font-bold text-white">{leader.name}</h3>
                  <p className={`text-sm font-bold uppercase tracking-wider ${leader.color.replace('bg-', 'text-')}`}>{leader.role}</p>
                </div>
              </div>
            ))}
            
            <div className="snap-center flex-shrink-0 w-80 h-96 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center p-6 hover:border-primary transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-black transition-colors">
                <i className="fas fa-plus text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white">You?</h3>
              <p className="text-gray-500 mt-2">Join our leadership team.</p>
            </div>
          </div>
        </section>

        {/* --- 6. FINALE --- */}
        <section className="py-32 bg-dark-bg text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
          <Reveal variant="zoom-in" className="relative z-10 container mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8">Ready to make a difference?</h2>
            <Link to="/get-involved" className="inline-block bg-white text-black text-xl font-bold py-5 px-12 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300">
              Get Started Now
            </Link>
          </Reveal>
        </section>

      </main>
    </>
  );
};

export default HomePage;
