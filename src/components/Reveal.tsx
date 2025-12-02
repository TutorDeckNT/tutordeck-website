import { useEffect, useRef, ReactNode, ElementType, HTMLAttributes } from 'react';

type RevealVariant = 'fade-up' | 'fade-in' | 'slide-left' | 'zoom-in' | 'blur-in';

interface RevealProps<C extends ElementType = 'div'> {
  children: ReactNode;
  className?: string;
  as?: C;
  variant?: RevealVariant;
  delay?: number; // Delay in seconds
  threshold?: number;
}

type Props<C extends ElementType> = RevealProps<C> &
  Omit<HTMLAttributes<C>, keyof RevealProps<C>>;

const Reveal = <C extends ElementType = 'div'>({
  children,
  className = '',
  as,
  variant = 'fade-up',
  delay = 0,
  threshold = 0.1,
  style,
  ...props
}: Props<C>) => {
  const Component = as || 'div';
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a small timeout for the delay if specified
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
      {...props}
    >
      {children}
    </Component>
  );
};

export default Reveal;
