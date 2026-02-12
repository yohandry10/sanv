import { ReactNode, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';

type FlipDirection = 'forward' | 'backward';

interface PageFlipProps {
  children: ReactNode;
  motionKey: string;
  direction?: FlipDirection;
}

const pageVariants: Record<FlipDirection, Variants> = {
  forward: {
    initial: {
      rotateY: 16,
      opacity: 0,
      scale: 0.985,
      transformOrigin: 'left center',
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: 'left center',
    },
    exit: {
      rotateY: -16,
      opacity: 0,
      scale: 0.985,
      transformOrigin: 'right center',
    },
  },
  backward: {
    initial: {
      rotateY: -16,
      opacity: 0,
      scale: 0.985,
      transformOrigin: 'right center',
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: 'right center',
    },
    exit: {
      rotateY: 16,
      opacity: 0,
      scale: 0.985,
      transformOrigin: 'left center',
    },
  },
};

const transition = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 24,
  mass: 0.75,
};

const PageFlip = ({ children, motionKey, direction = 'forward' }: PageFlipProps) => {
  const variants = pageVariants[direction];

  return (
    <motion.div
      key={motionKey}
      className="page-flip-container"
      style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {/* Paper shadow layer that follows the flip */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0.24 }}
        transition={{ duration: 0.18 }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Page fold crease highlight */}
      <motion.div
        className="absolute inset-y-0 pointer-events-none z-10"
        style={{ width: '3px', left: '0' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <div className="h-full" style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--gold) / 0.3), transparent)' }} />
      </motion.div>

      {children}
    </motion.div>
  );
};

export default PageFlip;
