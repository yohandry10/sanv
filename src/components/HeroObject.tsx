import { motion } from 'framer-motion';

interface HeroObjectProps {
    scene: string;
    initials: string;
}

const HeroObject = ({ scene, initials }: HeroObjectProps) => {
    // Define positions and styles for each scene
    const variants = {
        intro: {
            x: '0vw',
            y: '0vh',
            scale: 1,
            opacity: 1,
            rotate: 0,
            backgroundColor: 'hsl(var(--crimson))',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
        },
        edition: { opacity: 0, scale: 0 },
        reasons: { opacity: 0, scale: 0 },
        question: { opacity: 0, scale: 0 },
        confirmed: { opacity: 0, scale: 0 }
    };

    return (
        <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none flex items-center justify-center border-2 border-white/20"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
            variants={variants}
            animate={scene}
            transition={{
                type: 'spring',
                stiffness: 60,
                damping: 12,
                mass: 1
            }}
        >
            <motion.span
                className="font-blackletter text-white drop-shadow-md"
                animate={{
                    fontSize: scene === 'confirmed' ? '12px' : '20px',
                    opacity: scene === 'intro' || scene === 'confirmed' ? 1 : 0
                }}
            >
                {initials}
            </motion.span>

            {/* Decorative pulse for the hero */}
            <motion.div
                className="absolute inset-0 rounded-[inherit] border border-white/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </motion.div>
    );
};

export default HeroObject;
