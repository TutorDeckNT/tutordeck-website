import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useClickOutside } from '../../hooks/useClickOutside';

const MobileDock = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useClickOutside(dockRef, () => setIsMenuOpen(false));

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Animation variants for the dock container
  const dockVariants = {
    closed: { 
      height: '4rem', // h-16
      width: '90%',
      borderRadius: '9999px',
      transition: { type: 'spring', bounce: 0.3, duration: 0.5 }
    },
    open: { 
      height: 'auto', 
      width: '90%',
      borderRadius: '24px',
      transition: { type: 'spring', bounce: 0.2, duration: 0.5 }
    }
  };

  return (
    <>
      {/* Top Left Logo for Mobile Context */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <NavLink to="/" className="flex items-center gap-2 bg-dark-card/60 backdrop-blur-lg border border-white/10 rounded-full p-2 pr-4 shadow-lg">
          <img src="/mascot.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-white text-sm">TutorDeck</span>
        </NavLink>
      </div>

      {/* The Dynamic Dock */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center lg:hidden pointer-events-none">
        <motion.nav
          ref={dockRef}
          initial="closed"
          animate={isMenuOpen ? 'open' : 'closed'}
          variants={dockVariants}
          className="bg-dark-card/80 backdrop-blur-2xl border border-white/10 shadow-2xl pointer-events-auto overflow-hidden flex flex-col justify-end"
        >
          {/* Expanded Menu Content (Only visible when open) */}
          <AnimatePresence>
            {isMenuOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 pb-2 w-full"
              >
                <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                  <img src={user.photoURL || '/mascot.svg'} alt="User" className="w-10 h-10 rounded-full border border-white/10" />
                  <div className="overflow-hidden">
                    <p className="text-white font-bold truncate">{user.displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                    className="bg-primary/20 text-primary hover:bg-primary/30 py-3 rounded-xl font-semibold flex flex-col items-center gap-1 transition-colors"
                  >
                    <i className="fas fa-columns"></i>
                    <span className="text-xs">Dashboard</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 py-3 rounded-xl font-semibold flex flex-col items-center gap-1 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="text-xs">Sign Out</span>
                  </button>
                </div>
                <div className="w-full h-px bg-white/10 my-4"></div>
              </motion.div>
            )}
            
            {isMenuOpen && !user && (
               <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="p-6 w-full text-center"
             >
               <p className="text-white font-bold mb-4">Welcome to TutorDeck</p>
               <button 
                 onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                 className="w-full bg-white text-black font-bold py-3 rounded-xl"
               >
                 Sign In
               </button>
               <div className="w-full h-px bg-white/10 my-4"></div>
             </motion.div>
            )}
          </AnimatePresence>

          {/* Dock Icons Row */}
          <div className="flex items-center justify-between px-6 h-16 w-full">
            <DockIcon to="/" icon="fa-home" label="Home" />
            <DockIcon to="/about" icon="fa-info-circle" label="About" />
            <DockIcon to="/chapters" icon="fa-building" label="Chapters" />
            <DockIcon to="/get-involved" icon="fa-hand-holding-heart" label="Join" />
            
            {/* Profile Trigger */}
            <div className="w-px h-8 bg-white/10 mx-1"></div>
            <button 
              onClick={toggleMenu}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
              aria-label="User Menu"
            >
              {user ? (
                <img src={user.photoURL || '/mascot.svg'} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <i className="fas fa-user text-gray-400"></i>
              )}
              {/* Active Indicator Dot */}
              {user && !isMenuOpen && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-card rounded-full"></span>
              )}
            </button>
          </div>
        </motion.nav>
      </div>
    </>
  );
};

const DockIcon = ({ to, icon, label }: { to: string, icon: string, label: string }) => (
  <NavLink 
    to={to} 
    aria-label={label}
    className={({ isActive }) => `flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isActive ? 'text-primary -translate-y-1' : 'text-gray-400 hover:text-gray-200'}`}
  >
    {({ isActive }) => (
      <>
        <i className={`fas ${icon} text-xl mb-0.5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : ''}`}></i>
        {isActive && <span className="w-1 h-1 bg-primary rounded-full absolute -bottom-1"></span>}
      </>
    )}
  </NavLink>
);

export default MobileDock;
