import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { name: 'Home', path: '/', icon: 'fa-home' },
  { name: 'About', path: '/about', icon: 'fa-info-circle' },
  { name: 'Chapters', path: '/chapters', icon: 'fa-building' },
  { name: 'Get Involved', path: '/get-involved', icon: 'fa-hand-holding-heart' },
];

const DesktopNavbar = () => {
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- Scroll Physics ---
  // Shrink width from 100% (max-w-3xl) to smaller (max-w-2xl)
  const width = useTransform(scrollY, [0, 100], ['48rem', '42rem']);
  // Increase blur and opacity on scroll
  const bgOpacity = useTransform(scrollY, [0, 100], [0.6, 0.8]);
  const backdropBlur = useTransform(scrollY, [0, 100], ['12px', '20px']);
  // Collapse logo text
  const logoTextOpacity = useTransform(scrollY, [0, 50], [1, 0]);
  const logoTextWidth = useTransform(scrollY, [0, 50], ['auto', 0]);
  const logoGap = useTransform(scrollY, [0, 50], ['12px', '0px']);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        style={{ 
          width, 
          backgroundColor: useTransform(bgOpacity, o => `rgba(31, 41, 55, ${o})`),
          backdropFilter: useTransform(backdropBlur, b => `blur(${b})`),
        }}
        className="pointer-events-auto h-16 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-between px-2 pl-4 relative overflow-visible"
      >
        {/* --- 1. Logo Section --- */}
        <Link to="/" className="flex items-center relative z-10 group mr-4">
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark rounded-full shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <img src="/mascot.svg" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <motion.div 
            style={{ opacity: logoTextOpacity, width: logoTextWidth, marginLeft: logoGap }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="text-lg font-bold text-white tracking-tight ml-1">TutorDeck</span>
          </motion.div>
        </Link>

        {/* --- 2. Navigation Links --- */}
        <div className="flex items-center gap-1 relative z-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredTab(link.path)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                {hoveredTab === link.path && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {/* Only show icon on hover or active to keep it clean, or always? Let's do text only for clean look, icon on hover maybe? Plan said Icon + Text. */}
                  <i className={`fas ${link.icon} text-xs opacity-70`}></i>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* --- 3. Auth Action --- */}
        <div className="ml-4 relative z-10">
          {user ? (
            <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
              <button 
                className="flex items-center gap-2 bg-black/20 hover:bg-black/40 border border-white/5 rounded-full pl-1 pr-3 py-1 transition-all"
              >
                <img 
                  src={user.photoURL || '/mascot.svg'} 
                  alt="User" 
                  className="w-8 h-8 rounded-full border border-white/10" 
                />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-dark-card/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                      <i className="fas fa-columns w-5"></i> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <i className="fas fa-sign-out-alt w-5"></i> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
            >
              <span>Sign In</span>
              <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          )}
        </div>
      </motion.nav>
    </div>
  );
};

export default DesktopNavbar;
