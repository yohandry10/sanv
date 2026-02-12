import { motion } from 'framer-motion';

interface CalligraphyTextProps {
    text: string;
    className?: string;
    delay?: number;
}

const CalligraphyText = ({ text, className = '', delay = 0 }: CalligraphyTextProps) => {
    // Variations for "organic" feel
    const letters = text.split('');

    return (
        <div className={`${className} flex flex-wrap justify-center`}>
            {letters.map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block relative"
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0
                    }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.05,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}

                    {/* Ink Bleed Shadow (Subtle) */}
                    <motion.span
                        className="absolute inset-0 blur-[2px] opacity-30 select-none z-[-1]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: delay + i * 0.05 + 0.2 }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                </motion.span>
            ))}

            {/* Procedural Ink Drip */}
            {Math.random() > 0.7 && (
                <motion.div
                    className="w-1 h-3 bg-primary rounded-full blur-[1px] absolute"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], y: [0, 20] }}
                    transition={{ duration: 2, delay: delay + 1 }}
                    style={{ left: `${Math.random() * 100}%`, top: '100%' }}
                />
            )}
        </div>
    );
};

export default CalligraphyText;
