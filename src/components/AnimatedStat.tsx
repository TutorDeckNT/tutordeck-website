import { useState, useEffect, useRef } from 'react';

const AnimatedStat = ({ to }: { to: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLParagraphElement>(null);
    const isNumeric = !isNaN(parseInt(to));

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (!isNumeric) { setCount(Number(to)); return; }
                let start = 0; const end = parseInt(to); if (start === end) return;
                let duration = 1500; let startTimestamp: number | null = null;
                const step = (timestamp: number) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    setCount(Math.floor(progress * end));
                    if (progress < 1) window.requestAnimationFrame(step);
                };
                window.requestAnimationFrame(step);
                if (ref.current) observer.unobserve(ref.current);
            }
        }, { threshold: 0.5 });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [to, isNumeric]);

    return <p ref={ref} className="text-5xl font-bold text-secondary mb-2">{count}{isNumeric ? '+' : ''}</p>;
};

export default AnimatedStat;
