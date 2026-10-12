import Icon from './Icon';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';

import { useStaticPage } from '../seo/StaticPageContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ isOpen, onClose }: EventModalProps) => {
  const staticPage = useStaticPage();
  const showScrollControls = useMediaQuery('(min-width: 1024px)');
  const [show, setShow] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || staticPage) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close referral program"]')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, staticPage]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (staticPage) return;
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    if (event.key !== 'Tab') return;
    const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]') || []);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  if (!staticPage && !isOpen) return null;

  const handleScroll = (direction: 'up' | 'down') => {
    const amount = 200;
    scrollRef.current?.scrollBy({
      top: direction === 'up' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  const scrollbarHideCss: React.CSSProperties = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  };

  return (
    <div
      data-static-event={staticPage || undefined}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div ref={dialogRef} role={staticPage ? undefined : 'dialog'} aria-modal={staticPage ? undefined : true} aria-labelledby="referral-program-title" onKeyDown={handleKeyDown} className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div
          ref={scrollRef}
          style={scrollbarHideCss}
          className={`bg-dark-card/90 backdrop-blur-xl w-full max-w-3xl rounded-2xl border border-white/20 flex flex-col transition-all duration-300 ease-out max-h-[80vh] overflow-y-auto ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          {/* Header Graphic - Replaces Image with Gradient */}
          <div className="w-full h-48 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>
             <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
             
             {/* Floating Icons Animation */}
             <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-[0_0_30px_rgba(167,139,250,0.3)]">
                    <Icon className="fas fa-gift text-4xl text-purple-300" />
                </div>
                <h2 id="referral-program-title" className="text-3xl font-bold text-white tracking-tight">Refer & Earn</h2>
             </div>
          </div>

          <div className="p-8 text-left">
            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-full px-4 py-1 text-sm font-semibold">
                <Icon className="fas fa-clock mr-2" />Bonus Hours
              </div>
              <div className="bg-blue-500/20 text-blue-200 border border-blue-500/30 rounded-full px-4 py-1 text-sm font-semibold">
                <Icon className="fas fa-users mr-2" />Community Growth
              </div>
              <div className="bg-green-500/20 text-green-200 border border-green-500/30 rounded-full px-4 py-1 text-sm font-semibold">
                Active Now
              </div>
            </div>

            {/* Main Text */}
            <p className="text-lg text-dark-text leading-relaxed mb-8">
              <strong className="text-dark-heading text-xl block mb-2">Grow the movement. Multiply your impact.</strong> 
              We are excited to launch the TutorDeck Referral Program. We believe the best way to reach students who need help is through students who are already helping. Invite your friends to join as tutors, and you'll both get a head start on your volunteer goals.
            </p>

            {/* How It Works Box */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Icon className="fas fa-bullhorn text-9xl text-white" />
              </div>
              
              <h3 className="font-bold text-dark-heading text-lg mb-4 relative z-10">How it Works:</h3>
              <div className="space-y-4 relative z-10">
                
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm mt-1 flex-shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-white">Copy Your Unique Link</h4>
                        <p className="text-sm text-gray-400">Go to your Dashboard. You'll find a "Refer & Earn" card with your personal referral link.</p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm mt-1 flex-shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-white">Friend Joins & Logs Activity</h4>
                        <p className="text-sm text-gray-400">Send the link to a friend. They must sign up and log their first volunteer session.</p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm mt-1 flex-shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-white">You Both Earn!</h4>
                        <p className="text-sm text-gray-400">
                            Once verified, <strong className="text-green-400">you get +1 Hour</strong> and <strong className="text-green-400">they get +30 Mins</strong> added to your transcripts automatically.
                        </p>
                    </div>
                </div>

              </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Link to="/dashboard" onClick={onClose} className="bg-primary text-dark-bg font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                    Go to Dashboard
                </Link>
            </div>

          </div>
          {!staticPage && <button aria-label="Close referral program" onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors z-10">
            <Icon className="fas fa-times" />
          </button>}
        </div>
        
        {/* Scroll Controls (Only visible if content overflows significantly on small screens) */}
        {!staticPage && showScrollControls && <div className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 right-0 translate-x-full ml-6 flex-col gap-3 transition-opacity duration-300 ${show ? 'flex' : 'hidden'}`}>
          <button aria-label="Scroll referral program up" onClick={() => handleScroll('up')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors"><Icon className="fas fa-arrow-up" /></button>
          <button aria-label="Scroll referral program down" onClick={() => handleScroll('down')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors"><Icon className="fas fa-arrow-down" /></button>
        </div>}
      </div>
    </div>
  );
};

export default EventModal;
