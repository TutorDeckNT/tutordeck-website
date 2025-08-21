import { useState } from 'react';
import Reveal from './Reveal';

// Define the structure for a volunteer
interface Volunteer {
  name: string;
  award: string;
  quote: string;
  icon: string;
}

// Define the props for the component
interface VolunteerCarouselProps {
  volunteers: Volunteer[];
}

const VolunteerCarousel = ({ volunteers }: VolunteerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? volunteers.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === volunteers.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <Reveal as="section" id="awards" className="py-24 bg-dark-bg">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-dark-heading mb-4">Celebrating Our Volunteers</h2>
        <p className="max-w-2xl mx-auto mb-12 text-dark-text">Our initiative is powered by the passion of our student leaders. Here are a few of our award recipients.</p>
        
        <div className="relative max-w-3xl mx-auto">
          <div className="carousel-container relative h-72 md:h-64">
            <div className="carousel-track h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {volunteers.map((volunteer, index) => (
                <div key={index} className="carousel-slide w-full h-full p-2">
                  <div className="bg-dark-card h-full rounded-lg border border-gray-700 p-8 flex flex-col justify-center items-center text-center">
                    {/* The quote with more emphasis */}
                    <p className="text-xl lg:text-2xl italic text-dark-heading mb-6 font-light">"{volunteer.quote}"</p>
                    
                    {/* Volunteer details */}
                    <div className="mt-auto">
                      <i className={`fas ${volunteer.icon} text-2xl mb-2`}></i>
                      <h3 className="text-xl font-bold text-dark-heading">{volunteer.name}</h3>
                      <p className="text-primary font-semibold">{volunteer.award} Award</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow */}
          <button onClick={prevSlide} aria-label="Previous slide" className="absolute top-1/2 -left-4 md:-left-16 transform -translate-y-1/2 bg-gray-700/50 hover:bg-gray-600/80 rounded-full w-12 h-12 flex items-center justify-center transition-colors z-10">
            <i className="fas fa-chevron-left text-white"></i>
          </button>
          {/* Right Arrow */}
          <button onClick={nextSlide} aria-label="Next slide" className="absolute top-1/2 -right-4 md:-right-16 transform -translate-y-1/2 bg-gray-700/50 hover:bg-gray-600/80 rounded-full w-12 h-12 flex items-center justify-center transition-colors z-10">
            <i className="fas fa-chevron-right text-white"></i>
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center space-x-3 mt-8">
            {volunteers.map((_, slideIndex) => (
              <button 
                key={slideIndex} 
                onClick={() => goToSlide(slideIndex)} 
                className={`h-3 w-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-primary w-6' : 'bg-gray-600 hover:bg-gray-500'}`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default VolunteerCarousel;
