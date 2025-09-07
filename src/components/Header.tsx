import { useState, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';

// --- HELPER COMPONENTS ---

const NavItem = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void; }) => (
    <NavLink
        to={to}
        onClick={onClick}
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

const DashboardNavItem = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void; }) => (
     <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ease-in-out ${
                isActive
                    ? 'bg-secondary/20 text-secondary-light'
                    : 'text-secondary-light hover:bg-secondary/20'
            }`
        }
    >
        {children}
    </NavLink>
);

const VerticalDivider = () => <div className="h-6 w-px bg-white/20" />;

// --- MAIN HEADER COMPONENT ---

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
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* --- HEADER CONTAINER --- */}
            <header ref={mobileMenuRef} className="fixed top-0 left-0 z-50 w-full md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-auto">
                <div
                    className={`
                        w-full bg-gray-900/40 backdrop-blur-xl border-b border-white/10
                        md:max-w-none md:rounded-full md:border md:border-white/20 md:shadow-xl 
                        md:h-14
                        transition-[width] duration-300 ease-in-out
                        ${user ? 'md:w-[780px]' : 'md:w-[600px]'}
                    `}
                >
                    {/* --- DESKTOP VIEW (The "Single Frame") --- */}
                    <div className="hidden h-full md:flex items-center justify-between px-6">
                        
                        {/* Left Zone */}
                        <div className="flex items-center gap-4">
                            <NavLink to="/" className="flex items-center space-x-2 flex-shrink-0">
                                <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-9 w-9 rounded-full object-cover border-2 border-white/30" />
                                <span className="text-xl font-bold text-white">TutorDeck</span>
                            </NavLink>
                            <VerticalDivider />
                        </div>

                        {/* Center Zone */}
                        <nav className="flex items-center gap-2">
                            {user && (
                                <DashboardNavItem to="/dashboard">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                                    <span>Dashboard</span>
                                </DashboardNavItem>
                            )}
                            <NavItem to="/about">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                                <span>About</span>
                            </NavItem>
                            <NavItem to="/chapters">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                                <span>Chapters</span>
                            </NavItem>
                            <NavItem to="/get-involved">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
                                <span>Get Involved</span>
                            </NavItem>
                        </nav>

                        {/* Right Zone */}
                        <div className="flex items-center gap-4">
                            <VerticalDivider />
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex text-sm bg-gray-800 rounded-full ring-2 ring-white/30 focus:ring-primary-light transition-all" aria-expanded={isDropdownOpen}>
                                        <img className="w-9 h-9 rounded-full" src={user.photoURL || '/mascot.avif'} alt="user photo" />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-4 z-50 w-64 origin-top-right bg-gray-200/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                                            <div className="px-4 py-3 border-b border-white/10"><span className="block text-sm text-white font-semibold">{user.displayName}</span><span className="block text-sm text-gray-400 truncate">{user.email}</span></div>
                                            <ul className="py-2"><li><a href="#" onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg><span>Sign out</span></a></li></ul>
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

                    {/* --- MOBILE VIEW (Full-width Bar) --- */}
                    <div className="flex md:hidden items-center justify-between w-full px-4 py-2">
                        <NavLink to="/" className="flex items-center space-x-2 flex-shrink-0">
                            <img src="/mascot.avif" alt="TutorDeck Mascot" className="h-9 w-9 rounded-full object-cover border-2 border-white/30" />
                            <span className="text-xl font-bold text-white">TutorDeck</span>
                        </NavLink>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MOBILE MENU OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-dark-bg/80 backdrop-blur-lg z-40 pt-20">
                    <nav className="flex flex-col items-center gap-4 text-lg p-8">
                        {user && (
                            <DashboardNavItem to="/dashboard" onClick={closeMobileMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                                <span>Dashboard</span>
                            </DashboardNavItem>
                        )}
                        <NavItem to="/about" onClick={closeMobileMenu}><span>About</span></NavItem>
                        <NavItem to="/chapters" onClick={closeMobileMenu}><span>Chapters</span></NavItem>
                        <NavItem to="/get-involved" onClick={closeMobileMenu}><span>Get Involved</span></NavItem>
                        <div className="w-full h-px bg-white/20 my-4" />
                        {user ? (
                            <button onClick={handleLogout} className="text-gray-300">Sign Out</button>
                        ) : (
                            <Link to="/login" onClick={closeMobileMenu} className="w-full text-center bg-gradient-to-r from-primary to-secondary-light text-dark-bg font-semibold px-4 py-2 rounded-full">
                                Sign In
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
};

export default Header;
