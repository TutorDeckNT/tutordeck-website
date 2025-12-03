import { useEffect, useRef, ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';

type RevealVariant = 'fade-up' | 'fade-in' | 'slide-left' | 'zoom-in' | 'blur-in';

// Define props specific to Reveal
type RevealOwnProps<C extends ElementType> = {
  as?: C;
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number; // Delay in seconds
  threshold?: number;
};

// Combine with the props of the component C, omitting duplicates
type RevealProps<C extends ElementType> = RevealOwnProps<C> & 
  Omit<ComponentPropsWithoutRef<C>, keyof RevealOwnProps<C>>;

const Reveal = <C extends ElementType = 'div'>({
  children,
  className = '',
  as,
  variant = 'fade-up',
  delay = 0,
  threshold = 0.1,
  style,
  ...props
}: RevealProps<C>) => {
  const Component = as || 'div';
  
  // Use 'any' for ref to avoid complex polymorphic type conflicts with IntersectionObserver
  const ref = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay * 1000);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, threshold]);

  return (
    <Component 
      ref={ref} 
      className={`reveal ${variant} ${className}`} 
      style={style}
      {...props as any}
    >
      {children}
    </Component>
  );
};

export default Reveal;
