import { useState, useEffect, useRef } from 'react';

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
          className={`bg-dark-card/70 backdrop-blur-xl w-full max-w-3xl rounded-2xl border border-white/20 flex flex-col transition-all duration-300 ease-out max-h-[80vh] overflow-y-auto ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <div className="w-full bg-gray-500/20 flex-shrink-0">
            <img src="/invite.png" alt="TutorDeck Introductory Meeting Invitation" className="w-full h-auto object-cover" />
          </div>
          <div className="p-8 text-left">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-white/10 rounded-full px-4 py-1 text-sm font-semibold">Sep 12: Prosper High</div>
              <div className="bg-white/10 rounded-full px-4 py-1 text-sm font-semibold">Sep 19: Richland High</div>
              <div className="bg-white/10 rounded-full px-4 py-1 text-sm font-semibold">4:30 - 5:15 PM</div>
              <div className="bg-white/10 rounded-full px-4 py-1 text-sm font-semibold">Location: TBA</div>
            </div>
            <p className="text-lg text-dark-text leading-relaxed mb-6">
              <strong className="text-dark-heading">Made for the tutors.</strong> We've redesigned everything to provide an unparalleled tutoring experience. Maximize your impact, earn significant <strong className="text-red-400 font-semibold">volunteer hours</strong>, and build <strong className="text-red-400 font-semibold">leadership</strong> skills while earning leadership months—no formal role required. This experience looks great on volunteering apps, and you're invited to join our all-new platform.
            </p>
            <div className="bg-black/20 border border-white/20 rounded-lg p-4">
              <h3 className="font-bold text-dark-heading mb-2">New Programs Being Announced:</h3>
              <ul className="list-disc list-inside text-dark-text space-y-1">
                <li>Tutor Your Friend</li>
                <li>Mentorship for leadership credit</li>
                <li>Achievements from Last Year</li>
                <li>Fundraising Opportunities</li>
                <li>Awards and Tier System</li>
                <li>...and much more!</li>
              </ul>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors z-10">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-full ml-6 flex-col gap-3 transition-opacity duration-300 ${show ? 'flex' : 'hidden'}`}>
          <button onClick={() => handleScroll('up')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors"><i className="fas fa-arrow-up"></i></button>
          <button onClick={() => handleScroll('down')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors"><i className="fas fa-arrow-down"></i></button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
