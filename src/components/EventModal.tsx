import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ isOpen, onClose }: EventModalProps) => {
  const [show, setShow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div
          ref={scrollRef}
          style={scrollbarHideCss}
          className={`bg-dark-card/90 backdrop-blur-xl w-full max-w-3xl rounded-2xl border border-white/20 flex flex-col transition-all duration-300 ease-out max-h-[80vh] overflow-y-auto ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          {/* Header Graphic - Replaces Image with Gradient */}
          <div className="w-full h-48 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
             
             {/* Floating Icons Animation */}
             <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-[0_0_30px_rgba(167,139,250,0.3)]">
                    <i className="fas fa-gift text-4xl text-purple-300"></i>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Refer & Earn</h2>
             </div>
          </div>

          <div className="p-8 text-left">
            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-full px-4 py-1 text-sm font-semibold">
                <i className="fas fa-clock mr-2"></i>Bonus Hours
              </div>
              <div className="bg-blue-500/20 text-blue-200 border border-blue-500/30 rounded-full px-4 py-1 text-sm font-semibold">
                <i className="fas fa-users mr-2"></i>Community Growth
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
                <i className="fas fa-bullhorn text-9xl text-white"></i>
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
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors z-10">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Scroll Controls (Only visible if content overflows significantly on small screens) */}
        <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-full ml-6 flex-col gap-3 transition-opacity duration-300 ${show ? 'flex' : 'hidden'}`}>
          <button onClick={() => handleScroll('up')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors"><i className="fas fa-arrow-up"></i></button>
          <button onClick={() => handleScroll('down')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors"><i className="fas fa-arrow-down"></i></button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
