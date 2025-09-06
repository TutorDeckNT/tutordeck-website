import { useState, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';

// Helper component for NavLink styling
const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ease-in-out ${
                isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`
        }
    >
        {children}
    </NavLink>
);

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
        <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
            <div className="w-auto max-w-fit bg-gray-900/40 backdrop-blur-xl rounded-full border border-white/20 shadow-xl transition-all duration-300">
                <div className="flex items-center justify-center gap-4 px-4 py-2">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center space-x-2 flex-shrink-0 pr-2">
                        <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-9 w-9 rounded-full object-cover border-2 border-white/30" />
                        <span className="text-xl font-bold text-white hidden sm:block">TutorDeck</span>
                    </NavLink>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        <NavItem to="/about">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                            <span>About</span>
                        </NavItem>
                        <NavItem to="/chapters">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                            <span>Chapters</span>
                        </NavItem>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center pl-2">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex text-sm bg-gray-800 rounded-full ring-2 ring-white/30 focus:ring-primary-light transition-all" aria-expanded={isDropdownOpen}>
                                    <span className="sr-only">Open user menu</span>
                                    <img className="w-9 h-9 rounded-full" src={user.photoURL || '/mascot.avif'} alt="user photo" />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-4 z-50 w-64 origin-top-right bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <span className="block text-sm text-white font-semibold">{user.displayName}</span>
                                            <span className="block text-sm text-gray-400 truncate">{user.email}</span>
                                        </div>
                                        <ul className="py-2" aria-labelledby="user-menu-button">
                                            <li>
                                                <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226l.043-.018a2.25 2.25 0 0 1 2.502 1.226l.043.018c.548.223 1.02.684 1.11 1.226l.043.018a2.25 2.25 0 0 1-1.226 2.502l-.018.043c-.223.547-.684 1.02-1.226 1.11l-.018.043a2.25 2.25 0 0 1-2.502-1.226l-.018-.043a2.25 2.25 0 0 1 1.226-2.502l.018-.043Zm-4.5 0a2.25 2.25 0 0 1 2.502 1.226l.043.018c.548.223 1.02.684 1.11 1.226l.043.018a2.25 2.25 0 0 1-1.226 2.502l-.018.043c-.223.547-.684 1.02-1.226 1.11l-.018.043a2.25 2.25 0 0 1-2.502-1.226l-.018-.043a2.25 2.25 0 0 1 1.226-2.502l.018-.043Zm11.25 0a2.25 2.25 0 0 1 2.502 1.226l.043.018c.548.223 1.02.684 1.11 1.226l.043.018a2.25 2.25 0 0 1-1.226 2.502l-.018.043c-.223.547-.684 1.02-1.226 1.11l-.018.043a2.25 2.25 0 0 1-2.502-1.226l-.018-.043a2.25 2.25 0 0 1 1.226-2.502l.018-.043ZM4.94 16.06a2.25 2.25 0 0 1 2.502 1.226l.043.018c.548.223 1.02.684 1.11 1.226l.043.018a2.25 2.25 0 0 1-1.226 2.502l-.018.043c-.223.547-.684 1.02-1.226 1.11l-.018.043a2.25 2.25 0 0 1-2.502-1.226l-.018-.043a2.25 2.25 0 0 1 1.226-2.502l.018-.043Zm11.25 0a2.25 2.25 0 0 1 2.502 1.226l.043.018c.548.223 1.02.684 1.11 1.226l.043.018a2.25 2.25 0 0 1-1.226 2.502l-.018.043c-.223.547-.684 1.02-1.226 1.11l-.018.043a2.25 2.25 0 0 1-2.502-1.226l-.018-.043a2.25 2.25 0 0 1 1.226-2.502l.018-.043ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" /></svg>
                                                    <span>Dashboard</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <a href="#" onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                                                    <span>Sign out</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary-light text-dark-bg font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity cta-button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                                <span>Sign In</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
