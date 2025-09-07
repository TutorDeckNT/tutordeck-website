import { useState, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4">
                
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-10 w-10 rounded-full object-cover border-2 border-white/30" />
                    <span className="text-2xl font-bold text-white">TutorDeck</span>
                </Link>

                {/* Right: Action Pane */}
                <div className="relative" ref={dropdownRef}>
                    {user ? (
                        // --- Logged In View ---
                        <div className="flex items-center gap-3 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl p-1.5 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-dark-text hover:text-white transition-colors pl-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                            <div className="relative">
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/50 block">
                                    <img src={user.photoURL || '/mascot.avif'} alt="User Profile" className="w-full h-full object-cover" />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-64 bg-dark-card/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                                        <div className="p-4 border-b border-white/10">
                                            <p className="font-bold text-dark-heading">{user.displayName}</p>
                                            <p className="text-sm text-dark-text truncate">{user.email}</p>
                                        </div>
                                        <ul className="p-2">
                                            <li><a href="#" onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 text-dark-text"><i className="fas fa-sign-out-alt w-5"></i><span>Sign Out</span></a></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // --- Logged Out View ---
                        <div className="bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                            <Link to="/login" className="flex items-center gap-2 text-dark-heading font-semibold px-5 py-2.5">
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Sign In</span>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Center: Navigation Pane (Positioned Absolutely for true centering) */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-dark-card/60 backdrop-blur-lg border border-white/20 rounded-full shadow-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-shadow duration-300">
                <nav className="flex items-center gap-1 p-1.5">
                    <NavLink to="/" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}>
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/about" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}>
                        <i className="fas fa-info-circle"></i>
                        <span>About</span>
                    </NavLink>
                    <NavLink to="/chapters" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}>
                        <i className="fas fa-building"></i>
                        <span>Chapters</span>
                    </NavLink>
                    <NavLink to="/get-involved" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-text hover:bg-white/10 hover:text-white transition-colors ${isActive && 'bg-white/10 !text-white'}`}>
                        <i className="fas fa-user-plus"></i>
                        <span>Get Involved</span>
                    </NavLink>
                </nav>
            </div>
        </>
    );
};

export default Header;
