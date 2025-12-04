// src/components/Footer.tsx

import { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import LegalModal from './LegalModal';
import { termsOfServiceContent, privacyPolicyContent } from '../lib/legal';

// --- Types ---
type ModalContentType = {
    title: string;
    content: React.ReactNode;
}

// --- Helper Components ---

const FooterHeader = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 select-none">
        {children}
    </h4>
);

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
    return (
        <Link to={to} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 w-fit">
            <motion.span 
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="text-primary text-xs"
            >
                <i className="fas fa-arrow-right"></i>
            </motion.span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
                {children}
            </span>
        </Link>
    );
};

const SocialButton = ({ href, icon, label }: { href: string, icon: string, label: string }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -3, scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group relative"
        aria-label={label}
    >
        <i className={`fab ${icon}`}></i>
        {/* Tooltip */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {label}
        </span>
    </motion.a>
);

// --- Main Component ---

const Footer = () => {
    const [modalContent, setModalContent] = useState<ModalContentType | null>(null);
    const [email, setEmail] = useState('');
    
    // Spotlight Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const openModal = (type: 'terms' | 'privacy') => {
        if (type === 'terms') {
            setModalContent({ title: 'Terms of Service', content: termsOfServiceContent });
        } else {
            setModalContent({ title: 'Privacy Policy', content: privacyPolicyContent });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <LegalModal 
                isOpen={!!modalContent} 
                onClose={() => setModalContent(null)} 
                title={modalContent?.title || ''}
            >
                {modalContent?.content}
            </LegalModal>

            {/* --- 1. THE BRIDGE (Pre-Footer CTA) --- */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark-bg to-secondary/20 opacity-50"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight"
                    >
                        Don't just watch. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Lead.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link 
                            to="/get-involved" 
                            className="inline-flex items-center gap-3 bg-white text-black font-bold text-lg px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
                        >
                            Start a Chapter <i className="fas fa-arrow-right"></i>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* --- 2. THE TERMINAL (Main Footer) --- */}
            <footer 
                className="relative bg-black text-white overflow-hidden group"
                onMouseMove={handleMouseMove}
            >
                {/* Spotlight Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.1),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {/* Grain Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

                <div className="container mx-auto px-6 pt-20 pb-12 relative z-10">
                    
                    {/* Asymmetric Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/10 pb-16">
                        
                        {/* Column 1: Brand & Legacy (Span 4) */}
                        <div className="lg:col-span-4 space-y-8">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-black font-bold text-xl">
                                    T
                                </div>
                                <span className="text-2xl font-bold tracking-tight">TutorDeck</span>
                            </Link>
                            
                            <p className="text-gray-400 leading-relaxed max-w-sm">
                                A student-led non-profit redefining peer education. We build the tools, you build the legacy.
                            </p>

                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Recruiting Chapters</span>
                            </div>
                        </div>

                        {/* Column 2: Explore (Span 2) */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <FooterHeader>Explore</FooterHeader>
                            <FooterLink to="/">Home</FooterLink>
                            <FooterLink to="/about">Our Story</FooterLink>
                            <FooterLink to="/chapters">Chapters</FooterLink>
                            <FooterLink to="/dashboard">Dashboard</FooterLink>
                        </div>

                        {/* Column 3: Resources (Span 2) */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <FooterHeader>Resources</FooterHeader>
                            <FooterLink to="/get-involved">Start a Club</FooterLink>
                            <FooterLink to="/login">Volunteer Login</FooterLink>
                            <a href="#" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 w-fit">
                                <span className="group-hover:translate-x-1 transition-transform duration-300">Verify Docs</span>
                            </a>
                            <a href="mailto:join@tutordeck.org" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 w-fit">
                                <span className="group-hover:translate-x-1 transition-transform duration-300">Contact Support</span>
                            </a>
                        </div>

                        {/* Column 4: The Loop (Span 4) */}
                        <div className="lg:col-span-4">
                            <FooterHeader>Stay in the Loop</FooterHeader>
                            
                            {/* Newsletter Input */}
                            <div className="relative mb-8">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors pr-10"
                                />
                                <AnimatePresence>
                                    {email.length > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="absolute right-0 top-3 text-primary hover:text-white transition-colors"
                                        >
                                            <i className="fas fa-arrow-right"></i>
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-4">
                                <SocialButton href="#" icon="fa-twitter" label="Twitter" />
                                <SocialButton href="https://www.instagram.com/tutordeck___/" icon="fa-instagram" label="Instagram" />
                                <SocialButton href="#" icon="fa-linkedin" label="LinkedIn" />
                                <SocialButton href="#" icon="fa-discord" label="Discord" />
                            </div>
                        </div>
                    </div>

                    {/* --- 3. SUB-FOOTER (Utility Bar) --- */}
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        
                        {/* Copyright */}
                        <div className="text-xs text-gray-600 font-mono">
                            &copy; {new Date().getFullYear()} TutorDeck Initiative. <span className="hidden sm:inline">Made with <i className="fas fa-heart text-red-900"></i> in Texas.</span>
                        </div>

                        {/* Legal Links */}
                        <div className="flex gap-6 text-xs text-gray-500 font-medium">
                            <button onClick={() => openModal('terms')} className="hover:text-white transition-colors">Terms</button>
                            <button onClick={() => openModal('privacy')} className="hover:text-white transition-colors">Privacy</button>
                            <span className="opacity-20">|</span>
                            <span className="hover:text-white transition-colors cursor-pointer">Sitemap</span>
                        </div>

                        {/* Back to Top */}
                        <button 
                            onClick={scrollToTop}
                            className="group flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
                        >
                            Back to Top
                            <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
                                <i className="fas fa-arrow-up transform group-hover:-translate-y-0.5 transition-transform"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
