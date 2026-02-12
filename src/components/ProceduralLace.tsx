import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const ProceduralLace = () => {
    const isMobile = useIsMobile();

    return (
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="lacePattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        {isMobile ? (
                            <path
                                d="M 5 0 Q 7.5 2.5 5 5 Q 2.5 7.5 5 10 M 0 5 Q 2.5 7.5 5 5 Q 7.5 2.5 10 5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.2"
                            />
                        ) : (
                            <motion.path
                                d="M 5 0 Q 7.5 2.5 5 5 Q 2.5 7.5 5 10 M 0 5 Q 2.5 7.5 5 5 Q 7.5 2.5 10 5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                        <circle cx="5" cy="5" r="0.5" fill="currentColor" opacity="0.5" />
                    </pattern>
                </defs>

                {/* Borders */}
                <rect x="0" y="0" width="100" height="2" fill="url(#lacePattern)" />
                <rect x="0" y="98" width="100" height="2" fill="url(#lacePattern)" />
                <rect x="0" y="0" width="2" height="100" fill="url(#lacePattern)" />
                <rect x="98" y="0" width="2" height="100" fill="url(#lacePattern)" />
            </svg>
        </div>
    );
};

export default ProceduralLace;
