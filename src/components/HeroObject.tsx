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
        edition: {
            x: '35vw',
            y: '-35vh',
            scale: 0.5,
            opacity: 0.6,
            rotate: 15,
            backgroundColor: 'hsl(var(--gold))',
            borderRadius: '20%',
            width: '40px',
            height: '40px',
        },
        reasons: {
            x: '-40vw',
            y: '30vh',
            scale: 0.4,
            opacity: 0.4,
            rotate: -10,
            backgroundColor: 'hsl(var(--secondary))',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
        },
        question: {
            x: '0vw',
            y: '-20vh',
            scale: 0.8,
            opacity: 0.8,
            rotate: 360,
            backgroundColor: 'hsl(var(--primary))',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
        },
        confirmed: {
            x: '0vw',
            y: '-5vh',
            scale: 0.1,
            opacity: 0,
            rotate: 0,
            backgroundColor: 'transparent',
            borderRadius: '50%',
            width: '0px',
            height: '0px',
        }
    };

    return (
        <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none flex items-center justify-center shadow-xl border-2 border-white/20"
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
