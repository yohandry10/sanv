import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getValentineData } from '@/data';
import MagneticText from './MagneticText';

interface ConfirmedSceneProps {
  playSound: (s: 'success') => void;
}

const data = getValentineData();

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const ConfirmedScene = ({ playSound }: ConfirmedSceneProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  const confetti = useMemo<ConfettiPiece[]>(() => {
    const colors = [
      'hsl(var(--crimson))',
      'hsl(var(--gold))',
      'hsl(var(--blush))',
      'hsl(var(--primary-foreground))',
    ];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 720,
    }));
  }, []);

  useEffect(() => {
    playSound('success');
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [playSound]);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('to', data.to);
    url.searchParams.set('from', data.from);
    url.searchParams.set('initials', data.initials);
    navigator.clipboard.writeText(url.toString()).then(() => {
      alert('¡Link copiado al portapapeles! 💌');
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-6 pb-24 sm:pb-8 relative overflow-hidden glass-noise"
      style={{ backgroundColor: 'hsl(var(--crimson))' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Confetti */}
      {showConfetti && confetti.map(piece => (
        <motion.div
          key={piece.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.size > 7 ? '50%' : '1px',
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            opacity: [1, 1, 0],
            rotate: piece.rotation,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
        />
      ))}

      <div className="text-center relative z-10 max-w-md">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <MagneticText
            text="Confirmado oficialmente:"
            className="font-typewriter text-xs tracking-[0.3em] uppercase mb-4 chromatic-text"
          />
        </motion.div>

        {/* Lace heart */}
        <motion.div
          className="relative mx-auto mb-8 dynamic-shadow"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, type: 'spring', stiffness: 120, damping: 16 }}
        >
          <svg
            viewBox="0 0 200 180"
            className="w-48 h-44 sm:w-56 sm:h-52 mx-auto"
            fill="none"
          >
            {/* Heart shape */}
            <path
              d="M100 170 C 20 100, 0 60, 30 30 C 50 10, 80 20, 100 50 C 120 20, 150 10, 170 30 C 200 60, 180 100, 100 170Z"
              fill="none"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Inner decorative */}
            <path
              d="M100 155 C 35 95, 20 65, 40 40 C 55 25, 78 30, 100 55 C 122 30, 145 25, 160 40 C 180 65, 165 95, 100 155Z"
              fill="hsl(var(--primary-foreground) / 0.1)"
              stroke="hsl(var(--primary-foreground) / 0.3)"
              strokeWidth="1"
            />
            {/* Text inside heart */}
            <text
              x="100"
              y="85"
              textAnchor="middle"
              className="font-script"
              fill="hsl(var(--primary-foreground))"
              fontSize="16"
            >
              Eres mi
            </text>
            <text
              x="100"
              y="115"
              textAnchor="middle"
              className="font-script"
              fill="hsl(var(--primary-foreground))"
              fontSize="22"
            >
              San Valentín
            </text>
          </svg>
        </motion.div>

        {/* Initials charms */}
        <motion.div
          className="flex justify-center gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {data.initials.split('').filter(c => c !== ' ').slice(0, 2).map((initial, i) => (
            <motion.div
              key={i}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: 'hsl(var(--gold))',
                color: 'hsl(var(--gold))',
                backgroundColor: 'hsl(var(--gold) / 0.1)',
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            >
              <span className="font-editorial text-sm font-bold">{initial}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Names */}
        <motion.p
          className="font-script text-3xl mb-8 text-white drop-shadow-sm"
          data-text={`${data.from} ${data.to}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
        >
          {data.from} {data.to}
        </motion.p>

        {/* Share CTA */}
        <motion.button
          onClick={handleShare}
          className="font-typewriter text-xs border rounded-full px-6 py-2.5 transition-all duration-300
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            borderColor: 'hsl(var(--primary-foreground) / 0.4)',
            color: 'hsl(var(--primary-foreground) / 0.8)',
          }}
          whileHover={{
            scale: 1.05,
            borderColor: 'hsl(var(--primary-foreground))',
            color: 'hsl(var(--primary-foreground))',
          }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Compartir 💌
        </motion.button>
      </div>
    </div>
  );
};

export default ConfirmedScene;
