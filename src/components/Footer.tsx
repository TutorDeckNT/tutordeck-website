// src/components/Footer.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LegalModal from './LegalModal';
import { termsOfServiceContent, privacyPolicyContent } from '../lib/legal';

// --- UTILITY COMPONENTS ---

/**
 * ScrambleText: Decodes text on hover for a "cyber" effect.
 */
const ScrambleText = ({ text, className = "" }: { text: string, className?: string }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    
    const scramble = () => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(() => 
                text.split("").map((_, index) => {
                    if (index < iteration) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    };

    return (
        <span onMouseEnter={scramble} className={`inline-block cursor-default ${className}`}>
            {display}
        </span>
    );
};

/**
 * SpotlightCard: A container that illuminates based on mouse position.
 */
const SpotlightCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div 
            className={`relative group border border-white/10 bg-dark-card/30 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onClick={onClick}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(52, 211, 153, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};

// --- MAIN FOOTER COMPONENT ---

type ModalContentType = { title: string; content: React.ReactNode; };

const Footer = () => {
    const { user } = useAuth();
    const [modalContent, setModalContent] = useState<ModalContentType | null>(null);

    const openModal = (type: 'terms' | 'privacy') => {
        setModalContent({
            title: type === 'terms' ? 'Terms of Service' : 'Privacy Policy',
            content: type === 'terms' ? termsOfServiceContent : privacyPolicyContent
        });
    };

    return (
        <>
            <LegalModal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
                {modalContent?.content}
            </LegalModal>

            <footer className="relative bg-[#020617] text-white pt-20 pb-10 overflow-hidden">
                
                {/* 1. THE LIGHT HORIZON (Top Separator) */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-primary/5 blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    
                    {/* 2. THE BENTO GRID (Main Modules) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
                        
                        {/* MODULE A: BRAND IDENTITY (Left - 5 Cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                            <div>
                                <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
                                    <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl group-hover:border-primary/50 transition-colors">
                                        <img src="/mascot.svg" alt="Mascot" className="w-8 h-8 opacity-90 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors">TUTORDECK</span>
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Est. 2022 • Texas</span>
                                    </div>
                                </Link>
                                <p className="text-gray-400 max-w-sm leading-relaxed text-lg">
                                    Redefining peer education through a student-led, tech-forward initiative. <span className="text-gray-500">We build leaders, not just scholars.</span>
                                </p>
                            </div>
                            
                            {/* Mission Pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-mono text-gray-300">System Status: Operational</span>
                            </div>
                        </div>

                        {/* MODULE B: NAVIGATION STACK (Center - 4 Cols) */}
                        <div className="lg:col-span-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <i className="fas fa-layer-group"></i> Navigation
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: 'Home', path: '/' },
                                    { name: 'About Mission', path: '/about' },
                                    { name: 'Find Chapters', path: '/chapters' },
                                    { name: 'Get Involved', path: '/get-involved' },
                                    user ? { name: 'Dashboard', path: '/dashboard', highlight: true } : { name: 'Login Portal', path: '/login' }
                                ].map((link) => (
                                    <Link key={link.path} to={link.path}>
                                        <SpotlightCard className={`rounded-lg px-5 py-3 transition-transform active:scale-95 ${link.highlight ? 'bg-primary/10 border-primary/30' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-semibold ${link.highlight ? 'text-primary' : 'text-gray-300'}`}>
                                                    <ScrambleText text={link.name} />
                                                </span>
                                                {link.highlight && <i className="fas fa-arrow-right text-xs text-primary -rotate-45"></i>}
                                            </div>
                                        </SpotlightCard>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* MODULE C: ACTION SECTOR (Right - 3 Cols) */}
                        <div className="lg:col-span-3 flex flex-col gap-4">
                            {/* Magnetic CTA Card */}
                            <Link to="/get-involved" className="block h-full">
                                <SpotlightCard className="rounded-2xl p-6 h-full flex flex-col justify-between min-h-[180px] bg-gradient-to-b from-white/5 to-transparent hover:border-primary/50 transition-colors">
                                    <div>
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                                            <i className="fas fa-rocket"></i>
                                        </div>
                                        <h3 className="text-xl font-bold text-white leading-tight mb-1">Start a Chapter</h3>
                                        <p className="text-xs text-gray-400">Launch TutorDeck at your school.</p>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                            <i className="fas fa-chevron-right text-xs"></i>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </Link>
                            
                            {/* Social Magnetic Strip */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { icon: 'twitter', url: '#' },
                                    { icon: 'instagram', url: 'https://www.instagram.com/tutordeck___/' },
                                    { icon: 'linkedin', url: '#' }
                                ].map((social, idx) => (
                                    <a 
                                        key={idx} 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white/5 border border-white/10 rounded-lg h-12 flex items-center justify-center hover:bg-white/10 hover:text-primary transition-all duration-300"
                                    >
                                        <i className={`fab fa-${social.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. THE SYSTEM BAR (Bottom) */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
                        
                        <div className="flex items-center gap-2">
                            <span>© 2025 TutorDeck Initiative.</span>
                            <span className="hidden md:inline text-gray-700">|</span>
                            <span className="hidden md:inline">Built by Students, for Students.</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <button onClick={() => openModal('terms')} className="hover:text-primary transition-colors uppercase tracking-wider">Terms</button>
                            <button onClick={() => openModal('privacy')} className="hover:text-primary transition-colors uppercase tracking-wider">Privacy</button>
                            <a href="mailto:join@tutordeck.org" className="hover:text-primary transition-colors uppercase tracking-wider">Contact</a>
                        </div>

                    </div>
                </div>

                {/* Background Noise Texture */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </footer>
        </>
    );
};

export default Footer;
