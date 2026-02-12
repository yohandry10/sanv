import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { getValentineData } from '@/data';

interface EnvelopeSceneProps {
  onComplete: () => void;
  onExtract?: () => void;
  playSound: (s: 'paperRustle' | 'click' | 'stamp') => void;
}

const data = getValentineData();

const EnvelopeScene = ({ onComplete, onExtract, playSound }: EnvelopeSceneProps) => {
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

  const extractLetter = () => {
    if (!isFlapOpen || isLetterOut) return;

    setIsLetterOut(true);
    onExtract?.();
    playSound('paperRustle');

    // Programmatic animation for the letter
    animate(dragY, -300, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setTimeout(onComplete, 300)
    });
  };

  const openFlap = () => {
    if (isFlapOpen) return;
    playSound('paperRustle');
    setIsFlapOpen(true);
    onExtract?.();
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
            ([x, y]) => `radial-gradient(circle 300px at ${x}px ${y}px, rgba(255,255,255,0.4), rgba(255,255,255,0))`
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
      <div
        className="relative z-10 group cursor-pointer"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        onClick={!isFlapOpen ? openFlap : undefined}
      >

        {/* Envelope Body */}
        <motion.div
          className="relative w-[320px] h-[220px] sm:w-[400px] sm:h-[280px]"
          style={{ boxShadow: '0 14px 30px rgba(95, 70, 75, 0.12), 0 6px 12px rgba(95, 70, 75, 0.08)' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: 'spring' }}
        >
          {/* Back of Envelope */}
          <div className="absolute inset-0 bg-[#e0c4c4] rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" />

          {/* Letter (Draggable) */}
          <motion.div
            className="absolute left-4 right-4 bg-[#fdfbf7] shadow-md rounded-sm p-6 flex flex-col items-center text-center space-y-4"
            style={{
              top: '20px',
              height: '95%',
              y: dragY,
              opacity: dragOpacity,
              scale: dragScale,
              cursor: isFlapOpen ? 'pointer' : 'default',
              touchAction: 'none',
              zIndex: isFlapOpen ? 25 : 1
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              extractLetter();
            }}
          >
            <motion.div
              className="w-full h-full border border-double border-[#d4af37]/30 p-4 flex flex-col items-center justify-center relative"
              animate={{ opacity: isFlapOpen ? 1 : 0 }}
            >
              <p className="font-typewriter text-[10px] text-muted-foreground tracking-widest uppercase mb-1">
                Una nota para
              </p>
              <h2 className="font-script text-3xl text-crimson mb-2">
                {data.to}
              </h2>

              <div className="w-8 h-[1px] bg-crimson/20 my-1" />
              <p className="font-body-serif text-xs text-foreground/70 italic min-h-[1.5rem]">
                "Toca la carta para leer..."
              </p>
            </motion.div>
          </motion.div>

          {/* Envelope Front (Bottom Packet) */}
          {/* ... folds ... */}
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
              zIndex: 21
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

        </motion.div>

        {/* Instruction Text */}
        <motion.p
          className="absolute -bottom-10 sm:-bottom-16 left-0 right-0 text-center font-typewriter text-muted-foreground text-[10px] sm:text-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {!isFlapOpen
            ? "Toca el sello para abrir"
            : "Toca la carta para leer"
          }
        </motion.p>
      </div>

    </div>
  );
};

export default EnvelopeScene;
