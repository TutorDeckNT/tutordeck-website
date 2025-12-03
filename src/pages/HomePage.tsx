import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import EventModal from '../components/EventModal';
import DashboardMockup from '../components/home/DashboardMockup';
import BentoGrid from '../components/home/BentoGrid';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the text transitions on the left
  const [activeFeatureStep, setActiveFeatureStep] = useState(0);
  
  // Refs for the text steps
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Ref for the scroll container
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to toggle text focus
  useEffect(() => {
    const options = { 
      root: null, 
      threshold: 0.5, // Trigger when 50% of the item is visible
      rootMargin: "0px" 
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === step1Ref.current) setActiveFeatureStep(0);
          if (entry.target === step2Ref.current) setActiveFeatureStep(1);
          if (entry.target === step3Ref.current) setActiveFeatureStep(2);
        }
      });
    }, options);

    if (step1Ref.current) observer.observe(step1Ref.current);
    if (step2Ref.current) observer.observe(step2Ref.current);
    if (step3Ref.current) observer.observe(step3Ref.current);

    return () => observer.disconnect();
  }, []);

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
              <span className="text-xs font-bold text-white uppercase tracking-wider">Upcoming: 2025 Intro Event</span>
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

        {/* --- 3. STICKY SCROLL EXPERIENCE --- */}
        {/* IMPORTANT: Do NOT add overflow-hidden here, it breaks sticky positioning */}
        <section className="relative bg-dark-bg">
          <div className="container mx-auto px-6">
            
            {/* 
               The Ref goes here on the wrapper. 
               'items-stretch' (default) ensures the Right Column is as tall as the Left Column.
            */}
            <div ref={scrollSectionRef} className="flex flex-col lg:flex-row items-stretch">
              
              {/* LEFT COLUMN: Scrolling Text Steps */}
              <div className="lg:w-1/2 relative z-10 pb-32">
                
                {/* Step 1 */}
                <div ref={step1Ref} className="min-h-screen flex items-center p-6 border-l border-gray-800/50 pl-10">
                  <div className={`transition-all duration-700 ease-out ${activeFeatureStep === 0 ? 'opacity-100 translate-x-0 blur-0' : 'opacity-20 -translate-x-8 blur-sm'}`}>
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary font-mono text-xs border border-primary/20">01. LOG</div>
                    <h3 className="text-5xl font-bold text-white mb-6">Log with Ease.</h3>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-md">
                      Forget lost paper forms. Upload audio proof directly from your phone, select your activity, and log hours in seconds.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div ref={step2Ref} className="min-h-screen flex items-center p-6 border-l border-gray-800/50 pl-10">
                  <div className={`transition-all duration-700 ease-out ${activeFeatureStep === 1 ? 'opacity-100 translate-x-0 blur-0' : 'opacity-20 -translate-x-8 blur-sm'}`}>
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary/10 text-secondary font-mono text-xs border border-secondary/20">02. TRACK</div>
                    <h3 className="text-5xl font-bold text-white mb-6">Gamified Impact.</h3>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-md">
                      Watch your hours grow. Our automated tier system unlocks Bronze, Silver, and Gold awards as you hit milestones.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div ref={step3Ref} className="min-h-screen flex items-center p-6 border-l border-gray-800/50 pl-10">
                  <div className={`transition-all duration-700 ease-out ${activeFeatureStep === 2 ? 'opacity-100 translate-x-0 blur-0' : 'opacity-20 -translate-x-8 blur-sm'}`}>
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-green-500/10 text-green-400 font-mono text-xs border border-green-500/20">03. VERIFY</div>
                    <h3 className="text-5xl font-bold text-white mb-6">Official Transcripts.</h3>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-md">
                      University-ready documentation at the click of a button. Generate verifiable PDF transcripts with unique QR codes.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sticky 3D Mockup */}
              {/* This column stretches to match the left column's height (approx 300vh) */}
              <div className="hidden lg:block lg:w-1/2 relative">
                {/* 
                   Sticky Container:
                   - sticky: Enables sticking
                   - top-0: Sticks to the top of the viewport
                   - h-screen: Occupies full viewport height
                   - flex/items-center: Centers the mockup vertically
                */}
                <div className="sticky top-0 h-screen flex items-center justify-center">
                   <DashboardMockup scrollContainerRef={scrollSectionRef} />
                </div>
              </div>

            </div>
          </div>
        </section>

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
