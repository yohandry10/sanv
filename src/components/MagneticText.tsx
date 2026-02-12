import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface MagneticTextProps {
    text: string;
    className?: string;
}

const MagneticCharacter = ({ char, mouseX, mouseY }: { char: string; mouseX: any; mouseY: any }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const x = useSpring(0, { stiffness: 150, damping: 15 });
    const y = useSpring(0, { stiffness: 150, damping: 15 });

    useEffect(() => {
        const updatePosition = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = mouseX.get() - centerX;
            const distanceY = mouseY.get() - centerY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            const radius = 100;
            if (distance < radius) {
                const force = (radius - distance) / radius;
                x.set(distanceX * force * 0.5);
                y.set(distanceY * force * 0.5);
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
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

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
