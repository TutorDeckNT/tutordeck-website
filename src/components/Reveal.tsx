import { useEffect, useRef, ReactNode, ElementType } from 'react';

// Define the props for the component
interface RevealProps {
  children: ReactNode;
  className?: string;
  // FIX: Add the 'as' prop. It can be any valid HTML element type.
  // We use React's ElementType for strong typing.
  as?: ElementType;
}

const Reveal = ({ children, className = '', as: Component = 'div' }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup function to disconnect the observer
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // FIX: Use the 'Component' variable (which defaults to 'div') to render the element.
  // This makes the component flexible.
  return (
    <Component ref={ref} className={`reveal ${className}`}>
      {children}
    </Component>
  );
};

export default Reveal;
