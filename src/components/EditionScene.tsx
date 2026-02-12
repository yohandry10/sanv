import { motion } from 'framer-motion';
import { getValentineData } from '@/data';
import MagneticText from './MagneticText';

interface EditionSceneProps {
  onNext: () => void;
}

const data = getValentineData();

const EditionScene = ({ onNext }: EditionSceneProps) => {
  return (
    <div
      className="min-h-screen paper-bg flex items-center justify-center px-4 py-8 overflow-auto"
    >
      <div className="max-w-lg w-full">
        {/* Microtexto header */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-typewriter text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
            Edición Especial · {data.date} · Vol. ∞ · N.° 1
          </p>
        </motion.div>

        <div className="editorial-line mb-1" />
        <div className="editorial-line mb-4" style={{ height: '2px' }} />

        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
        >
          <MagneticText
            text="Valentine Edition"
            className="font-blackletter text-4xl sm:text-5xl text-primary text-center mb-1 chromatic-text"
          />
        </motion.div>

        <div className="editorial-line my-3" />

        {/* Headline */}
        <motion.div
          className="text-center my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {data.headline}
          </h2>
          <h2 className="font-script text-5xl sm:text-6xl text-primary mt-1">
            {data.subtitle}
          </h2>
        </motion.div>

        <div className="editorial-line my-4" />

        {/* Grid: editorial text + photo */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Left column - editorial text */}
          <div className="space-y-3">
            <p className="font-body-serif text-sm text-foreground/80 leading-relaxed first-letter:text-3xl first-letter:font-editorial first-letter:text-primary first-letter:float-left first-letter:mr-1 first-letter:mt-0.5">
              Querido/a {data.to}, esta edición está dedicada enteramente a ti.
              Cada palabra, cada detalle, ha sido cuidadosamente pensado para
              recordarte lo especial que eres.
            </p>
            <p className="font-body-serif text-sm text-foreground/60 leading-relaxed">
              En las siguientes páginas descubrirás las razones por las que
              eres la persona más increíble del universo. Prepárate.
            </p>
            <p className="font-typewriter text-xs text-muted-foreground italic">
              — Con todo el amor, {data.from}
            </p>
          </div>

          {/* Right column - polaroid */}
          <motion.div
            className="group relative mx-auto"
            whileHover={{ rotate: -2, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-warm-white p-3 pb-12 shadow-lg rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <div className="w-full aspect-square bg-blush flex items-center justify-center overflow-hidden">
                <div className="text-center p-4">
                  <span className="font-script text-4xl text-primary/40 block mb-2">
                    {data.initials}
                  </span>
                  <p className="font-typewriter text-xs text-muted-foreground">
                    tu foto aquí
                  </p>
                </div>
              </div>
              {/* Polaroid caption on hover */}
              <motion.p
                className="absolute bottom-3 left-0 right-0 text-center font-script text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Mi persona favorita ♡
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        <div className="editorial-line mb-4" />

        {/* Coupons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {[data.coupon1, data.coupon2].map((coupon, i) => (
            <motion.div
              key={i}
              className="perforated bg-primary text-primary-foreground p-4 text-center cursor-default prismatic-card dynamic-shadow border-none"
              whileHover={{ scale: 1.03, rotate: i === 0 ? 1 : -1 }}
            >
              <p className="font-typewriter text-[10px] uppercase tracking-widest opacity-70 mb-1 relative z-10">
                Cupón válido por
              </p>
              <p className="font-editorial text-sm font-bold relative z-10">{coupon}</p>
              <p className="font-typewriter text-[9px] mt-2 opacity-50 relative z-10">
                Sin fecha de expiración
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            onClick={onNext}
            className="font-typewriter text-sm text-primary border border-primary rounded-full px-8 py-3
                       hover:bg-primary hover:text-primary-foreground transition-colors duration-300
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Continuar leyendo →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default EditionScene;
