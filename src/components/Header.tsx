// TypeScript (Header.tsx)
import { useState, useRef, MouseEvent } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));
    useClickOutside(mobileMenuRef, () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    });

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const toggleDropdown = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropdownOpen(prev => !prev);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Fading Blur Effect for the top of the page */}
            <div className="fixed top-0 left-0 right-0 h-24 z-30 pointer-events-none backdrop-blur-md [mask-image:linear-gradient(to_bottom,white_80%,transparent_100%)]"></div>

            {/* ================================== */}
            {/* DESKTOP HEADER & NAVIGATION      */}
            {/* ================================== */}
            <header className="fixed top-0 left-0 right-0 z-40 p-4">
                <div className="hidden lg:flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-14 w-14 rounded-lg object-cover border-2 border-white/30" />
                        <span className="text-2xl font-bold text-white">TutorDeck</span>
                    </Link>
                    <div className="relative" ref={dropdownRef}>
                        {user ? (
                            <Link to="/dashboard" className="group flex items-center gap-3 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl p-1.5 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                                <div className="flex items-center gap-2 text-sm font-medium text-dark-text group-hover:text-white transition-colors pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                                    <span>Dashboard</span>
                                </div>
                                <button onClick={toggleDropdown} className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/50 block relative z-10">
                                    <img src={user.photoURL || '/mascot.avif'} alt="User Profile" className="w-full h-full object-cover" />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-64 bg-dark-card/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                                        <div className="p-4 border-b border-white/10"><p className="font-bold text-dark-heading">{user.displayName}</p><p className="text-sm text-dark-text truncate">{user.email}</p></div>
                                        <ul className="p-2"><li><a href="#" onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 text-dark-text"><i className="fas fa-sign-out-alt w-5"></i><span>Sign Out</span></a></li></ul>
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <div className="bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                                <Link to="/login" className="flex items-center gap-2 text-dark-heading font-semibold px-5 py-2.5">
                                    <i className="fas fa-sign-in-alt"></i><span>Sign In</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                <nav className="flex items-center gap-1 p-1.5">
                    <NavLink to="/" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}><i className="fas fa-home"></i><span>Home</span></NavLink>
                    <NavLink to="/about" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}><i className="fas fa-info-circle"></i><span>About</span></NavLink>
                    <NavLink to="/chapters" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}><i className="fas fa-building"></i><span>Chapters</span></NavLink>
                    <NavLink to="/get-involved" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}><i className="fas fa-user-plus"></i><span>Get Involved</span></NavLink>
                </nav>
            </div>

            {/* ================================== */}
            {/* NEW MOBILE NAVIGATION SYSTEM       */}
            {/* ================================== */}
            <div className="lg:hidden">
                {/* --- Mobile: Top Left Floating Logo --- */}
                <div className="fixed top-4 left-4 z-40">
                    <Link to="/" className="flex items-center gap-2 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl p-2 pr-4">
                        <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-12 w-12 rounded-lg object-cover" />
                        <span className="font-bold text-white text-lg">TutorDeck</span>
                    </Link>
                </div>

                {/* --- Mobile: Bottom Floating Nav Bar --- */}
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
                    <nav className="flex items-center justify-between p-1.5 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl">
                        <NavLink to="/" className={({isActive}) => `flex-1 h-12 flex items-center justify-center rounded-full text-xl text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-primary/20 !text-primary'}`}><i className="fas fa-home"></i></NavLink>
                        <NavLink to="/about" className={({isActive}) => `flex-1 h-12 flex items-center justify-center rounded-full text-xl text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-primary/20 !text-primary'}`}><i className="fas fa-info-circle"></i></NavLink>
                        <NavLink to="/chapters" className={({isActive}) => `flex-1 h-12 flex items-center justify-center rounded-full text-xl text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-primary/20 !text-primary'}`}><i className="fas fa-building"></i></NavLink>
                        <NavLink to="/get-involved" className={({isActive}) => `flex-1 h-12 flex items-center justify-center rounded-full text-xl text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-primary/20 !text-primary'}`}><i className="fas fa-user-plus"></i></NavLink>
                        <div className="w-px h-6 bg-white/20 mx-1"></div>
                        <button onClick={toggleMobileMenu} className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            {user ? (
                                <img src={user.photoURL || '/mascot.avif'} alt="User Profile" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <i className="fas fa-user text-xl text-dark-text"></i>
                            )}
                        </button>
                    </nav>
                </div>

                {/* --- Mobile: Menu Panel Backdrop --- */}
                <div 
                    className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={closeMobileMenu}
                ></div>

                {/* --- Mobile: Menu Panel (Slide-up) --- */}
                <div 
                    ref={mobileMenuRef}
                    className={`fixed bottom-0 left-0 right-0 z-40 bg-dark-card/80 backdrop-blur-xl border-t border-white/20 rounded-t-3xl p-5 pb-8 transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
                >
                    <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-6"></div>
                    {user ? (
                        <div className="flex flex-col items-center text-center">
                            <img src={user.photoURL || '/mascot.avif'} alt="User Profile" className="w-16 h-16 rounded-full mb-3 border-2 border-primary" />
                            <p className="font-bold text-dark-heading text-lg">{user.displayName}</p>
                            <p className="text-sm text-dark-text truncate w-full max-w-xs mb-6">{user.email}</p>
                            <nav className="w-full flex flex-col gap-3">
                                <Link to="/dashboard" onClick={closeMobileMenu} className="w-full text-center py-3 px-4 bg-white/10 rounded-lg text-dark-heading font-semibold hover:bg-white/20 transition-colors">Dashboard</Link>
                                <button onClick={handleLogout} className="w-full text-center py-3 px-4 bg-red-500/20 rounded-lg text-red-300 font-semibold hover:bg-red-500/30 transition-colors">Sign Out</button>
                            </nav>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full mb-4 bg-white/10 flex items-center justify-center">
                                <i className="fas fa-user text-3xl text-white/50"></i>
                            </div>
                            <p className="text-dark-heading text-lg font-semibold mb-2">Welcome to TutorDeck</p>
                            <p className="text-dark-text mb-6">Sign in to access your dashboard.</p>
                            <Link to="/login" onClick={closeMobileMenu} className="w-full text-center py-3 px-4 bg-primary rounded-lg text-dark-bg font-bold hover:bg-primary-dark transition-colors">Sign In with Google</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
