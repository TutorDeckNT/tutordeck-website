import { useEffect, useRef, useState } from 'react';

type AnimatedStatProps = {
  to: number | string;
};

const AnimatedStat = ({ to }: AnimatedStatProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  const numericValue =
    typeof to === 'number'
      ? to
      : Number(to.replace(/,/g, ''));

  const isNumeric = Number.isFinite(numericValue);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !isNumeric) return;

        const end = numericValue;
        const duration = 1500;
        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
          if (startTimestamp === null) {
            startTimestamp = timestamp;
          }

          const progress = Math.min(
            (timestamp - startTimestamp) / duration,
            1
          );

          setCount(Math.floor(progress * end));

          if (progress < 1) {
            animationFrameId = window.requestAnimationFrame(step);
          }
        };

        animationFrameId = window.requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    const element = ref.current;

    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isNumeric, numericValue]);

  return (
    <p ref={ref} className="text-5xl font-bold text-secondary mb-2">
      {isNumeric ? count.toLocaleString() : String(to)}
      {isNumeric ? '+' : ''}
    </p>
  );
};

export default AnimatedStat;
