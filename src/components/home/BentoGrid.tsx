import Reveal from '../Reveal';
import AnimatedStat from '../AnimatedStat';

const BentoGrid = () => {
  return (
    <section className="py-24 bg-dark-bg relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-dark-heading mb-4">The Ecosystem</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">More than just a club. A complete platform for student success.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Large Cell: Live Impact */}
          <Reveal variant="zoom-in" className="md:col-span-2 bg-dark-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <i className="fas fa-users text-9xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-mono text-red-400 uppercase tracking-widest">Live Impact</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Students Helped</h3>
            </div>
            <div className="mt-8">
              <AnimatedStat to="500" />
              <p className="text-gray-400 mt-2">Across all active chapters, our tutors are making a daily difference in academic performance.</p>
            </div>
          </Reveal>

          {/* Medium Cell: Map Visualization */}
          <Reveal variant="fade-up" delay={0.2} className="bg-dark-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-4 z-10 relative">Active Chapters</h3>
            <div className="flex-1 relative min-h-[200px] bg-gray-900/50 rounded-xl border border-white/5">
              {/* Stylized Map Dots */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {/* Prosper */}
                <div className="absolute top-[40%] left-[45%] group cursor-pointer">
                  <div className="w-3 h-3 bg-primary rounded-full animate-radar"></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Prosper High</div>
                </div>
                {/* Richland */}
                <div className="absolute top-[45%] left-[55%] group cursor-pointer">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-radar" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Richland High</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Medium Cell: Testimonial */}
          <Reveal variant="fade-up" delay={0.3} className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 flex flex-col justify-center relative">
            <i className="fas fa-quote-left text-4xl text-primary/20 absolute top-6 left-6"></i>
            <p className="text-lg text-gray-300 italic relative z-10 pt-6">
              "TutorDeck didn't just improve my grades, it gave me the confidence to ask questions. I realized I wasn't alone."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">RB</div>
              <div>
                <p className="font-bold text-white text-sm">Ricky B.</p>
                <p className="text-xs text-gray-500">11th Grade Student</p>
              </div>
            </div>
          </Reveal>

          {/* Wide Cell: Call to Action */}
          <Reveal variant="slide-left" delay={0.4} className="md:col-span-3 bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Start Your Own Chapter</h3>
              <p className="text-gray-300">We provide the platform, the resources, and the mentorship. You provide the leadership.</p>
            </div>
            <a href="#/get-involved" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Launch Now
            </a>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
