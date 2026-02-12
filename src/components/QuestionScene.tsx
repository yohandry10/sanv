import { motion } from 'framer-motion';
import MagneticText from './MagneticText';

interface QuestionSceneProps {
  onAnswer: () => void;
  playSound: (s: 'click' | 'success') => void;
}

const QuestionScene = ({ onAnswer, playSound }: QuestionSceneProps) => {
  const handleClick = () => {
    playSound('success');
    onAnswer();
  };

  return (
    <div
      className="min-h-screen paper-bg flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-foreground mb-2">
            ¿Quieres ser mi
          </h2>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 80, damping: 12 }}
          >
            <MagneticText
              text="San Valentín?"
              className="font-script text-5xl sm:text-8xl text-primary mb-12 chromatic-text"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleClick}
            className="font-typewriter text-sm border-2 border-primary text-primary rounded-full px-6 py-3
                       hover:bg-primary hover:text-primary-foreground transition-colors duration-300
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-ring prismatic-card"
            whileHover={{ scale: 1.06, x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            OBVIO, LO ESTABA ESPERANDO
          </motion.button>
          <motion.button
            onClick={handleClick}
            className="font-typewriter text-sm border-2 border-primary text-primary rounded-full px-6 py-3
                       hover:bg-primary hover:text-primary-foreground transition-colors duration-300
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-ring prismatic-card"
            whileHover={{ scale: 1.06, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            SÍ! POR SUPUESTOOO
          </motion.button>
        </motion.div>

        {/* Decorative hearts */}
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-primary/10 text-4xl pointer-events-none select-none"
            style={{
              left: `${20 + i * 30}%`,
              bottom: `${15 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          >
            ♥
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default QuestionScene;
