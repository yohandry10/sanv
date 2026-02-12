import { motion } from 'framer-motion';

interface BlurRevealProps {
    children: string;
    delay?: number;
    className?: string;
    duration?: number;
}

const BlurReveal = ({ children, delay = 0, className = '', duration = 1.2 }: BlurRevealProps) => {
    const words = children.split(' ');

    return (
        <p className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{
                        duration: duration,
                        delay: delay + i * 0.1,
                        ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="inline-block mr-1"
                >
                    {word}
                </motion.span>
            ))}
        </p>
    );
};

export default BlurReveal;
