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
    useClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false));

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const toggleDropdown = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Stop the parent Link from navigating
        e.stopPropagation(); // Stop the event from bubbling up
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
            {/* ================================== */}
            {/* HEADER COMPONENT START             */}
            {/* ================================== */}
            <header className="fixed top-0 left-0 right-0 z-40 p-4">
                {/* --- Desktop Header (hidden on small screens) --- */}
                <div className="hidden lg:flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-10 w-10 rounded-full object-cover border-2 border-white/30" />
                        <span className="text-2xl font-bold text-white">TutorDeck</span>
                    </Link>
                    <div className="relative" ref={dropdownRef}>
                        {user ? (
                            <Link to="/dashboard" className="group flex items-center gap-3 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl p-1.5 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                                <div className="flex items-center gap-2 text-sm font-medium text-dark-text group-hover:text-white transition-colors pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                                    <span>Dashboard</span>
                                </div>
                                <button onClick={toggleDropdown} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/50 block relative z-10">
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

                {/* --- Mobile Header (visible on small screens) --- */}
                <div className="flex lg:hidden justify-between items-center w-full">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-10 w-10 rounded-full object-cover border-2 border-white/30" />
                        <span className="text-2xl font-bold text-white">TutorDeck</span>
                    </Link>
                    <button onClick={toggleMobileMenu} className="p-2 text-white" aria-label="Open menu">
                        <i className="fas fa-bars text-2xl"></i>
                    </button>
                </div>
            </header>

            {/* --- Center Desktop Navigation --- */}
            <div className="hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                <nav className="flex items-center gap-1 p-1.5">
                    <NavLink to="/about" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}><i className="fas fa-info-circle"></i><span>About</span></NavLink>
                    <NavLink to="/chapters" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}><i className="fas fa-building"></i><span>Chapters</span></NavLink>
                    <NavLink to="/get-involved" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}><i className="fas fa-user-plus"></i><span>Get Involved</span></NavLink>
                </nav>
            </div>

            {/* --- Mobile Menu Overlay --- */}
            <div ref={mobileMenuRef} className={`fixed inset-0 bg-dark-bg/80 backdrop-blur-lg z-30 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="p-8 pt-24 text-center">
                    <nav className="flex flex-col items-center gap-6">
                        <NavLink to="/about" onClick={closeMobileMenu} className="flex flex-col items-center gap-2 text-dark-text text-lg"><i className="fas fa-info-circle text-2xl"></i><span>About</span></NavLink>
                        <NavLink to="/chapters" onClick={closeMobileMenu} className="flex flex-col items-center gap-2 text-dark-text text-lg"><i className="fas fa-building text-2xl"></i><span>Chapters</span></NavLink>
                        <NavLink to="/get-involved" onClick={closeMobileMenu} className="flex flex-col items-center gap-2 text-dark-text text-lg"><i className="fas fa-user-plus text-2xl"></i><span>Get Involved</span></NavLink>
                        <div className="w-3/4 h-px bg-white/20 my-4"></div>
                        {user ? (
                            <NavLink to="/dashboard" onClick={closeMobileMenu} className="flex flex-col items-center gap-2 text-dark-text text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                                <span>Dashboard</span>
                            </NavLink>
                        ) : (
                            <Link to="/login" onClick={closeMobileMenu} className="flex flex-col items-center gap-2 text-dark-text text-lg"><i className="fas fa-sign-in-alt text-2xl"></i><span>Sign In</span></Link>
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Header;
