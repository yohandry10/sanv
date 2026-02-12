import { motion, type MotionValue, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MagneticTextProps {
    text: string;
    className?: string;
}

interface MagneticCharacterProps {
    char: string;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

const MagneticCharacter = ({ char, mouseX, mouseY }: MagneticCharacterProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const x = useSpring(0, { stiffness: 170, damping: 20 });
    const y = useSpring(0, { stiffness: 170, damping: 20 });

    useEffect(() => {
        const updatePosition = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = mouseX.get() - centerX;
            const distanceY = mouseY.get() - centerY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            const radius = 90;
            if (distance < radius) {
                const force = (radius - distance) / radius;
                x.set(distanceX * force * 0.35);
                y.set(distanceY * force * 0.35);
            } else {
                x.set(0);
                y.set(0);
            }
        };

        const unsubscribeX = mouseX.on("change", updatePosition);
        const unsubscribeY = mouseY.on("change", updatePosition);

        return () => {
            unsubscribeX();
            unsubscribeY();
        };
    }, [mouseX, mouseY, x, y]);

    return (
        <motion.span
            ref={ref}
            style={{ x, y }}
            className="inline-block whitespace-pre pointer-events-none"
        >
            {char}
        </motion.span>
    );
};

const MagneticText = ({ text, className = '' }: MagneticTextProps) => {
    const isMobile = useIsMobile();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const hasWindow = typeof window !== 'undefined';
    const canHover = hasWindow && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = hasWindow && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interactive = !isMobile && canHover && !prefersReducedMotion;

    useEffect(() => {
        if (!interactive) return;

        let rafId = 0;
        const handleMouseMove = (e: MouseEvent) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [interactive, mouseX, mouseY]);

    if (!interactive) {
        return <div className={className}>{text}</div>;
    }

    return (
        <div className={className}>
            {text.split('').map((char, i) => (
                <MagneticCharacter
                    key={i}
                    char={char}
                    mouseX={mouseX}
                    mouseY={mouseY}
                />
            ))}
        </div>
    );
};

export default MagneticText;
