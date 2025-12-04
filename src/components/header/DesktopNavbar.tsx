import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useMotionTemplate, 
  useMotionValue, 
  useSpring 
} from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { name: 'Home', path: '/', icon: 'fa-home' },
  { name: 'About', path: '/about', icon: 'fa-info-circle' },
  { name: 'Chapters', path: '/chapters', icon: 'fa-building' },
  { name: 'Get Involved', path: '/get-involved', icon: 'fa-hand-holding-heart' },
];

const DesktopNavbar = () => {
  const { user, logout } = useAuth();
  const { scrollY, scrollYProgress } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- State ---
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Physics & Motion Values ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth progress bar for the bottom of the capsule
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Dynamic Dimensions based on Scroll
  const width = useTransform(scrollY, [0, 100], ['52rem', '46rem']);
  const bgOpacity = useTransform(scrollY, [0, 100], [0.5, 0.75]);
  const backdropBlur = useTransform(scrollY, [0, 100], ['12px', '24px']);
  
  // Logo Collapse Physics
  const logoTextOpacity = useTransform(scrollY, [0, 50], [1, 0]);
  const logoTextWidth = useTransform(scrollY, [0, 50], ['auto', 0]);
  const logoGap = useTransform(scrollY, [0, 50], ['12px', '0px']);

  // --- Contextual Accent Colors (The "Chameleon") ---
  // Simulating section detection based on scroll position ranges
  const accentColor = useTransform(
    scrollY,
    [0, 800, 1600, 2400], 
    ['#ffffff', '#34d399', '#3b82f6', '#fbbf24'] // White -> Primary -> Secondary -> Gold
  );

  // --- Handlers ---
  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  };

  const handleQuickLog = () => {
    // In a real app, this would open the global modal context
    navigate('/dashboard?action=log');
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none perspective-1000">
      <motion.nav
        onMouseMove={handleMouseMove}
        style={{ 
          width: isSearchOpen ? '40rem' : width, // Morph width when searching
          backgroundColor: useTransform(bgOpacity, o => `rgba(17, 24, 39, ${o})`),
          backdropFilter: useTransform(backdropBlur, b => `blur(${b})`),
        }}
        layout
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        className="pointer-events-auto h-16 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-between px-2 pl-4 relative overflow-hidden group/nav"
      >
        {/* --- 1. The "Prism" Spotlight Effect --- */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.06),
                transparent 40%
              )
            `,
          }}
        />
        
        {/* --- 2. Noise Texture Overlay --- */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* --- 3. Scroll Progress Bar --- */}
        <motion.div 
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ width: useTransform(smoothProgress, (v) => `${v * 100}%`) }}
        />

        {/* ================= CONTENT LAYER ================= */}
        
        {/* LEFT: Logo (Collapsible) */}
        <Link to="/" className="flex items-center relative z-10 group mr-4 flex-shrink-0">
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

        {/* CENTER: Morphing Area (Links <-> Search) */}
        <div className="flex-1 flex items-center justify-center relative z-10 h-full">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="search-bar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md flex items-center"
              >
                <i className="fas fa-search text-gray-400 mr-3"></i>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapters, awards, or help..."
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full h-full font-medium"
                  onKeyDown={(e) => e.key === 'Escape' && toggleSearch()}
                />
                <div className="flex gap-2 ml-2">
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 border border-white/5">ESC</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="nav-links"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
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
                          className="absolute inset-0 bg-white/5 rounded-full border border-white/5"
                          style={{ borderColor: accentColor }} // The Chameleon Effect
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Actions (Search Trigger + Auth HUD) */}
        <div className="ml-4 relative z-10 flex items-center gap-3">
          
          {/* Search Trigger */}
          <button 
            onClick={toggleSearch}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isSearchOpen ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            aria-label="Search"
          >
            <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
          </button>

          {/* Auth HUD */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              
              {/* Volunteer HUD: Ticker */}
              <div className="hidden xl:flex flex-col items-end mr-1 group cursor-default">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold group-hover:text-primary transition-colors">Hours Logged</span>
                <span className="text-sm font-mono font-bold text-white leading-none">124.5</span>
              </div>

              {/* Quick Log Action */}
              <button 
                onClick={handleQuickLog}
                className="w-8 h-8 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-dark-bg flex items-center justify-center transition-all duration-300 border border-primary/30"
                title="Quick Log Activity"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
                <button className="relative block">
                  <img 
                    src={user.photoURL || '/mascot.svg'} 
                    alt="User" 
                    className="w-9 h-9 rounded-full border border-white/10 hover:border-primary/50 transition-colors" 
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-card rounded-full"></span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-dark-card/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1"
                    >
                      <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                        <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                          <i className="fas fa-columns w-4 text-center"></i> Dashboard
                        </Link>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                          <i className="fas fa-cog w-4 text-center"></i> Settings
                        </button>
                      </div>
                      <div className="border-t border-white/5 p-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                          <i className="fas fa-sign-out-alt w-4 text-center"></i> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
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
