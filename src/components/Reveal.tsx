import { useEffect, useRef, ReactNode, ElementType, HTMLAttributes } from 'react';

// Define the props for the component
// We use a generic type 'C' that defaults to 'div'
interface RevealProps<C extends ElementType = 'div'> {
  children: ReactNode;
  className?: string;
  // The 'as' prop allows us to change the rendered HTML tag (e.g., from 'div' to 'section')
  as?: C;
}

// Use a more advanced type that combines our props with all valid HTML attributes
// for the given component type. This is what allows 'id', 'style', etc. to be passed.
type Props<C extends ElementType> = RevealProps<C> &
  Omit<HTMLAttributes<C>, keyof RevealProps<C>>;

const Reveal = <C extends ElementType = 'div'>({
  children,
  className = '',
  as,
}: Props<C>) => {
  // The component to render, defaulting to 'div' if 'as' is not provided
  const Component = as || 'div';
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

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup function to disconnect the observer
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Pass down the className and any other props (...) to the rendered component
  return (
    <Component ref={ref} className={`reveal ${className}`}>
      {children}
    </Component>
  );
};

export default Reveal;
