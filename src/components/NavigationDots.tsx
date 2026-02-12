import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export type Scene = 'intro' | 'edition' | 'reasons' | 'question' | 'confirmed';

const SCENES: Scene[] = ['intro', 'edition', 'reasons', 'question', 'confirmed'];

interface NavigationDotsProps {
  current: Scene;
  onNavigate: (scene: Scene) => void;
}

const NavigationDots = ({ current, onNavigate }: NavigationDotsProps) => {
  const isMobile = useIsMobile();
  const currentIndex = SCENES.indexOf(current);

  return (
    <div
      className={`fixed z-50 flex ${isMobile ? 'right-3 top-1/2 -translate-y-1/2 flex-col gap-2' : 'bottom-6 left-1/2 -translate-x-1/2 gap-2.5'}`}
      style={isMobile ? { paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' } : undefined}
      role="navigation"
      aria-label="Navegación de escenas"
    >
      {SCENES.map((scene, i) => (
        <button
          key={scene}
          onClick={() => i <= currentIndex && onNavigate(scene)}
          disabled={i > currentIndex}
          className={`relative group ${isMobile ? 'p-1.5' : 'p-1'}`}
          aria-label={`Escena ${i + 1}`}
          aria-current={scene === current ? 'step' : undefined}
        >
          <motion.div
            className={`${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full transition-colors duration-300 ${
              scene === current
                ? 'bg-primary'
                : i < currentIndex
                ? 'bg-primary/40'
                : 'bg-muted-foreground/20'
            }`}
            animate={scene === current ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
        </button>
      ))}
    </div>
  );
};

export default NavigationDots;
