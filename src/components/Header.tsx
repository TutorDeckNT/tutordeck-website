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
        <header className="fixed top-0 left-0 right-0 z-30 bg-dark-bg/70 backdrop-blur-lg border-b border-gray-700/50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <NavLink to="/" className="flex items-center space-x-3">
                    <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-10 w-10 rounded-full object-cover" />
                    <span className="text-2xl font-bold text-dark-heading">TutorDeck</span>
                </NavLink>
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink to="/about" className={({isActive}) => `transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`}>About</NavLink>
                    <NavLink to="/chapters" className={({isActive}) => `transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`}>Chapters</NavLink>
                    {/* AI Helper NavLink has been removed */}
                </nav>
                
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600" aria-expanded={isDropdownOpen}>
                                <span className="sr-only">Open user menu</span>
                                <img className="w-10 h-10 rounded-full" src={user.photoURL || '/tutordeck-website/mascot.avif'} alt="user photo" />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 z-50 w-56 text-base list-none bg-dark-card divide-y divide-gray-600 rounded-lg shadow-lg">
                                    <div className="px-4 py-3">
                                        <span className="block text-sm text-dark-heading">{user.displayName}</span>
                                        <span className="block text-sm text-gray-400 truncate">{user.email}</span>
                                    </div>
                                    <ul className="py-2" aria-labelledby="user-menu-button">
                                        <li>
                                            <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-dark-text hover:bg-gray-600 hover:text-white">Dashboard</Link>
                                        </li>
                                        <li>
                                            <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-dark-text hover:bg-gray-600 hover:text-white">Sign out</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="cta-button bg-gradient-to-r from-primary to-secondary-light text-dark-bg font-semibold px-5 py-2 rounded-lg hover:opacity-90">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
