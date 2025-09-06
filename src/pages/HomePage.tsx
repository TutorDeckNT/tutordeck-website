import { useState } from 'react';
import AnimatedStat from '../components/AnimatedStat';
import Reveal from '../components/Reveal';
import VolunteerCarousel from '../components/VolunteerCarousel';
import { Link } from 'react-router-dom';
import EventModal from '../components/EventModal';

const volunteerData = [
  { name: 'John Doe', award: 'Gold', quote: 'Leading the charge in peer-to-peer mentorship at Prosper High.', icon: 'fa-award text-yellow-400' },
  { name: 'Jane Smith', award: 'Silver', quote: 'Instrumental in launching our Middle School Mentorship program.', icon: 'fa-award text-gray-300' },
  { name: 'Sam Wilson', award: 'Bronze', quote: 'A consistent and reliable tutor, always ready to help with STEM subjects.', icon: 'fa-award text-yellow-600' },
  { name: 'Emily White', award: 'Rising Star', quote: 'Showed incredible initiative by co-founding the Richland High chapter.', icon: 'fa-star text-blue-400' },
];

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <main>
        <section id="hero" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
          <video autoPlay loop muted playsInline className="hero-video-bg"><source src="https://assets.mixkit.co/videos/preview/mixkit-students-in-a-classroom-2322-large.mp4" type="video/mp4" /></video>
          <div className="absolute inset-0 bg-dark-bg opacity-80"></div>
          <Reveal className="container mx-auto px-6 relative z-10">

            {/* ANNOUNCEMENT BANNER */}
            <div className="max-w-3xl mx-auto mb-16 flex items-center gap-2 group">
              <div className="flex-grow bg-[#e6fffa] rounded-l-full p-2 overflow-hidden relative h-12 flex items-center shadow-[0_0_15px_rgba(167,243,208,0.5)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(167,243,208,0.7)]">
                <div className="flex animate-marquee">
                  <span className="whitespace-nowrap uppercase font-bold tracking-wider text-black text-sm px-6">TutorDeck 2025-2026 Introductory Event is Upcoming. Check event dates now.</span>
                  <span className="whitespace-nowrap uppercase font-bold tracking-wider text-black text-sm px-6">TutorDeck 2025-2026 Introductory Event is Upcoming. Check event dates now.</span>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex-shrink-0 bg-[#e6fffa] rounded-r-full p-2 h-12 flex items-center text-sm text-black font-semibold hover:bg-opacity-80 transition-all duration-300 px-5 shadow-[0_0_15px_rgba(167,243,208,0.5)] group-hover:shadow-[0_0_25px_rgba(167,243,208,0.7)]">
                Learn More
              </button>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary mb-4 py-2">
              Empowering Students, Together.
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-dark-text mb-8">A student-led initiative dedicated to providing free, accessible, and high-quality tutoring for all.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-involved" className="cta-button bg-primary text-dark-bg font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto">Get Involved</Link>
            </div>
          </Reveal>
        </section>

        <section id="about-summary" className="py-24 bg-dark-card alternating-layout">
          <Reveal className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="alternating-layout-content">
              <h2 className="text-4xl font-bold text-dark-heading mb-4">A Movement by Students, for Students.</h2>
              <p className="mb-6 text-dark-text">TutorDeck began with a simple idea: to make quality educational support accessible to everyone by empowering students to teach and lead. We are a growing nonprofit initiative building a global community of learners and mentors.</p>
              <Link to="/about" className="font-semibold text-primary hover:text-primary-dark transition-colors">Discover Our Story <i className="fas fa-arrow-right ml-2"></i></Link>
            </div>
            <div><img src="https://images.unsplash.com/photo-1543269865-cbf4_27effbad?q=80&w=2070&auto.format&fit=crop" alt="Students collaborating" className="rounded-lg shadow-2xl" /></div>
          </Reveal>
        </section>

        <section id="impact" className="py-24 bg-dark-bg bg-dot-pattern">
          <Reveal className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-dark-heading mb-12">Our Impact in Numbers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-dark-card p-8 rounded-lg"><AnimatedStat to="2" /><p className="text-lg font-semibold uppercase tracking-wider text-dark-text">Chapters</p></div>
              <div className="bg-dark-card p-8 rounded-lg"><AnimatedStat to="50" /><p className="text-lg font-semibold uppercase tracking-wider text-dark-text">Tutors</p></div>
              <div className="bg-dark-card p-8 rounded-lg"><AnimatedStat to="100" /><p className="text-lg font-semibold uppercase tracking-wider text-dark-text">Students Helped</p></div>
            </div>
          </Reveal>
        </section>

        <section id="testimonial" className="py-24 bg-dark-card">
          <Reveal className="container mx-auto px-6">
            <div className="testimonial-card max-w-3xl mx-auto p-8 rounded-lg shadow-2xl">
              <i className="fas fa-quote-left text-5xl text-primary/50 absolute -top-4 -left-4"></i>
              <p className="text-2xl italic text-dark-heading mb-6">"Getting help from a peer tutor through TutorDeck didn't just improve my grades in calculus, it gave me the confidence to ask questions. It made me realize I wasn't alone."</p>
              <p className="font-bold text-right text-primary">— Sarah L., 11th Grade Student</p>
            </div>
          </Reveal>
        </section>

        <VolunteerCarousel volunteers={volunteerData} />
      </main>
    </>
  );
};

export default HomePage;
