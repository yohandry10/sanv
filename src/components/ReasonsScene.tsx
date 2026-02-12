import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getValentineData } from '@/data';
import BlurReveal from './BlurReveal';
import MagneticText from './MagneticText';

interface ReasonsSceneProps {
  onNext: () => void;
  playSound: (s: 'stamp' | 'click') => void;
}

const data = getValentineData();

const ReasonsScene = ({ onNext, playSound }: ReasonsSceneProps) => {
  const [revealed, setRevealed] = useState<boolean[]>(new Array(5).fill(false));

  const revealReason = (index: number) => {
    if (revealed[index]) return;
    playSound('stamp');
    setRevealed(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const allRevealed = revealed.every(Boolean);

  return (
    <div
      className="min-h-screen paper-bg flex items-center justify-center px-4 py-8 overflow-auto"
    >
      <div className="max-w-lg w-full">
        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-typewriter text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Exclusiva editorial
          </p>
          <MagneticText
            text="05 Razones por las que eres"
            className="font-editorial text-2xl sm:text-3xl font-bold text-foreground chromatic-text"
          />
          <MagneticText
            text="mi elección perfecta"
            className="font-script text-4xl sm:text-5xl text-primary mt-1 chromatic-text"
          />
          <div className="editorial-line mt-4" />
        </motion.div>

        {/* Reasons grid */}
        <div className="space-y-3 mb-8">
          {data.reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <button
                onClick={() => revealReason(i)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-500
                  ${revealed[i]
                    ? 'bg-secondary border-primary/20 prismatic-card dynamic-shadow'
                    : 'bg-cream border-border hover:border-primary/30 hover:shadow-sm cursor-pointer'
                  }`}
                aria-label={`Razón ${i + 1}: ${revealed[i] ? reason : 'Click para revelar'}`}
              >
                <div className="flex items-start gap-3">
                  {/* Number / heart icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <AnimatePresence mode="wait">
                      {revealed[i] ? (
                        <motion.span
                          key="heart"
                          className="text-primary text-xl animate-stamp inline-block"
                          initial={{ scale: 2, rotate: -15, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          ♥
                        </motion.span>
                      ) : (
                        <motion.span
                          key="number"
                          className="font-editorial text-lg font-bold text-muted-foreground/40"
                        >
                          0{i + 1}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {revealed[i] ? (
                      <BlurReveal
                        className="font-body-serif text-sm text-foreground leading-relaxed"
                        duration={0.8}
                      >
                        {reason}
                      </BlurReveal>
                    ) : (
                      <p className="font-typewriter text-xs text-muted-foreground">
                        Toca para revelar esta razón ✦
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* "Debes decir Sí" cards */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            >
              <div className="editorial-line mb-4" />
              <p className="font-editorial text-lg font-bold text-center mb-4 text-foreground">
                Por eso, debes decir <span className="text-primary font-script text-2xl">"Sí"</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
                {['Porque te lo mereces', 'Porque yo te elijo', 'Porque somos perfectos'].map((text, i) => (
                  <motion.div
                    key={i}
                    className="bg-primary text-primary-foreground p-3 rounded-lg text-center prismatic-card dynamic-shadow"
                    initial={{ opacity: 0, y: 20, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 120 }}
                  >
                    <p className="font-editorial text-xs sm:text-sm font-bold relative z-10">{text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <motion.button
                  onClick={onNext}
                  className="font-typewriter text-sm text-primary border border-primary rounded-full px-8 py-3
                             hover:bg-primary hover:text-primary-foreground transition-colors duration-300
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Siguiente →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!allRevealed && (
          <p className="text-center font-typewriter text-xs text-muted-foreground">
            Revela las 5 razones para continuar ♡
          </p>
        )}
      </div>
    </div>
  );
};

export default ReasonsScene;
