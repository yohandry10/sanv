import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion';
import { getValentineData } from '@/data';

interface EnvelopeSceneProps {
  onComplete: () => void;
  playSound: (s: 'paperRustle' | 'click' | 'stamp') => void;
}

const data = getValentineData();

const EnvelopeScene = ({ onComplete, playSound }: EnvelopeSceneProps) => {
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isLetterOut, setIsLetterOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for dynamic lighting
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Letter drag logic
  const dragY = useMotionValue(0);
  const dragOpacity = useTransform(dragY, [0, -200], [1, 0]);
  const dragScale = useTransform(dragY, [0, -200], [1, 0.9]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = window.innerWidth < 640 ? -50 : -100;
    if (info.offset.y < threshold) {
      setIsLetterOut(true);
      playSound('paperRustle');
      setTimeout(onComplete, 500);
    }
  };

  const openFlap = () => {
    if (isFlapOpen) return;
    playSound('paperRustle');
    setIsFlapOpen(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center justify-center min-h-screen w-full relative perspective-[1000px] overflow-hidden select-none"
    >
      {/* Dynamic Light Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-soft-light"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(circle 300px at ${x}px ${y}px, rgba(255,255,255,0.4), transparent)`
          ),
        }}
      />

      {/* Floating petals (Background) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10 text-4xl pointer-events-none select-none blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ❀
        </motion.div>
      ))}

      {/* Envelope Container */}
      <div className="relative z-10 group cursor-pointer" onClick={!isFlapOpen ? openFlap : undefined}>

        {/* Envelope Body */}
        <motion.div
          className="relative w-[320px] h-[220px] sm:w-[400px] sm:h-[280px] shadow-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: 'spring' }}
        >
          {/* Back of Envelope */}
          <div className="absolute inset-0 bg-[#e0c4c4] rounded-lg shadow-inner" />

          {/* Letter (Draggable) */}
          <motion.div
            className="absolute left-4 right-4 bg-[#fdfbf7] shadow-md rounded-sm p-6 flex flex-col items-center text-center space-y-4"
            style={{
              top: '10px',
              height: '90%',
              y: dragY,
              opacity: dragOpacity,
              scale: dragScale,
              cursor: isFlapOpen ? 'grab' : 'default',
              touchAction: 'none'
            }}
            drag={isFlapOpen ? 'y' : false}
            dragConstraints={{ top: window.innerWidth < 640 ? -400 : -300, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="w-full h-full border border-double border-[#d4af37]/30 p-4 flex flex-col items-center justify-center">
              <p className="font-typewriter text-xs text-muted-foreground tracking-widest uppercase mb-2">
                Una nota para
              </p>
              <h2 className="font-script text-3xl sm:text-4xl text-crimson mb-4">
                {data.to}
              </h2>
              <div className="w-8 h-[1px] bg-crimson/20 my-2" />
              <p className="font-body-serif text-sm text-foreground/70 italic">
                "Desliza hacia arriba para leer..."
              </p>
            </div>
          </motion.div>

          {/* Envelope Front (Bottom Packet) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: 'polygon(0 100%, 50% 50%, 100% 100%, 0 100%, 0 0, 100% 0, 100% 100%)', // This clip path is tricky, let's use CSS borders for standard envelope look or layers
            }}
          >
            {/* Creating standard envelope folds using absolute divs to avoid clip-path complexity issues with z-index */}
          </div>

          {/* Left Fold */}
          <div
            className="absolute top-0 bottom-0 left-0 w-full rounded-bl-lg"
            style={{
              clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
              background: 'linear-gradient(90deg, hsl(var(--envelope-pink)), hsl(var(--envelope-flap)))',
              zIndex: 20
            }}
          />
          {/* Right Fold */}
          <div
            className="absolute top-0 bottom-0 right-0 w-full rounded-br-lg"
            style={{
              clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
              background: 'linear-gradient(-90deg, hsl(var(--envelope-pink)), hsl(var(--envelope-flap)))',
              zIndex: 20
            }}
          />
          {/* Bottom Fold */}
          <div
            className="absolute bottom-0 left-0 right-0 h-full rounded-b-lg"
            style={{
              clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
              background: 'linear-gradient(0deg, hsl(var(--envelope-pink)), hsl(var(--envelope-flap)))',
              zIndex: 21,
              filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.05))'
            }}
          />

          {/* Top Flap (Animated) */}
          <motion.div
            className="absolute top-0 inset-x-0 h-1/2 origin-top z-30"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isFlapOpen ? 180 : 0, zIndex: isFlapOpen ? 1 : 30 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            <div
              className="absolute inset-0 w-full h-full rounded-t-lg"
              style={{
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                background: 'linear-gradient(180deg, hsl(var(--envelope-flap)), hsl(var(--envelope-pink)))',
                backfaceVisibility: 'hidden',
              }}
            />
            {/* Inner side of flap (visible when open) */}
            <div
              className="absolute inset-0 w-full h-full rounded-t-lg"
              style={{
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                background: '#eacaca',
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />
          </motion.div>

          {/* Wax Seal (Placeholder for HeroObject) */}
          <motion.div
            className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer opacity-0"
            onClick={(e) => {
              e.stopPropagation();
              openFlap();
            }}
          >
            <div className="w-16 h-16 rounded-full bg-crimson shadow-lg flex items-center justify-center border-4 border-l-red-900/20 border-t-red-800/20">
              <span className="font-blackletter text-2xl text-[#d4af37] drop-shadow-md">
                {data.initials}
              </span>
            </div>
          </motion.div>

        </motion.div>

        {/* Instruction Text */}
        <motion.p
          className="absolute -bottom-10 sm:-bottom-16 left-0 right-0 text-center font-typewriter text-muted-foreground text-[10px] sm:text-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {!isFlapOpen ? "Toca el sello para abrir" : "Desliza la carta hacia arriba"}
        </motion.p>
      </div>

    </div>
  );
};

export default EnvelopeScene;
