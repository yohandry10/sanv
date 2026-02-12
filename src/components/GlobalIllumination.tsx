import React, { useEffect, useRef } from 'react';

const GlobalIllumination = ({ children }: { children: React.ReactNode }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const elements = containerRef.current.querySelectorAll('.dynamic-shadow');
            elements.forEach((el) => {
                const htmlTarget = el as HTMLElement;
                const rect = htmlTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = (centerX - e.clientX) / 20;
                const dy = (centerY - e.clientY) / 20;

                htmlTarget.style.setProperty('--shadow-x', `${dx}px`);
                htmlTarget.style.setProperty('--shadow-y', `${dy}px`);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="contents">
            {children}
        </div>
    );
};

export default GlobalIllumination;
