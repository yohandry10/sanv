import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AtmosphereProps {
  scene?: string;
}

const Atmosphere = ({ scene }: AtmosphereProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const hasWindow = typeof window !== 'undefined';
  const prefersReducedMotion = hasWindow && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = hasWindow && window.matchMedia('(pointer: coarse)').matches;
  const lightweightMode = isMobile || coarsePointer || prefersReducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dprCap = lightweightMode ? 1.2 : 1.8;
    const targetFps = lightweightMode ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    let hidden = document.visibilityState === 'hidden';

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    // Flow Field Config
    const particles: { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number }[] = [];
    const maxParticles = prefersReducedMotion ? 18 : lightweightMode ? 42 : 90;
    const step = 0.005;
    const baseSpeed = lightweightMode ? 0.9 : 1.2;

    const mouse = { x: 0, y: 0, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    if (!lightweightMode) window.addEventListener('mousemove', handleMouseMove);

    const handleVisibility = () => {
      hidden = document.visibilityState === 'hidden';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      px: 0, py: 0,
      vx: 0, vy: 0,
      life: Math.random() * 0.5 + 0.5
    });

    for (let i = 0; i < maxParticles; i++) particles.push(createParticle());

    let time = 0;
    let animationFrameId: number;
    let lastFrame = 0;

    const render = (now: number = 0) => {
      if (hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (now - lastFrame < frameInterval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const deltaMultiplier = lastFrame === 0 ? 1 : Math.min((now - lastFrame) / 16.67, 2);
      lastFrame = now;

      // Semi-transparent clear for trails
      ctx.fillStyle = lightweightMode ? 'rgba(255, 245, 245, 0.05)' : 'rgba(255, 245, 245, 0.03)';
      ctx.fillRect(0, 0, width, height);

      time += step * deltaMultiplier;

      particles.forEach((p) => {
        p.px = p.x;
        p.py = p.y;

        // Base Flow
        const angle = (Math.sin(p.x * 0.005 + time) + Math.cos(p.y * 0.005 + time)) * Math.PI;
        p.vx = Math.cos(angle) * baseSpeed;
        p.vy = Math.sin(angle) * baseSpeed;

        // HEART MAGNETISM (Phase 7 Exclusive)
        if (scene === 'confirmed') {
          const centerX = width / 2;
          const centerY = height / 2 - 30; // Adjust for heart offset
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.hypot(dx, dy) || 1;

          // Vortex effect
          const pull = lightweightMode ? 0.2 : 0.3;
          p.vx += (dx / dist) * pull + (dy / dist) * 0.5; // Radial pull + tangent rotation
          p.vy += (dy / dist) * pull - (dx / dist) * 0.5;
        }

        // Mouse avoidance
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 150) {
            p.vx -= (dx / dist) * 1.8;
            p.vy -= (dy / dist) * 1.8;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw trail
        ctx.beginPath();
        const alpha = scene === 'confirmed'
          ? (lightweightMode ? 0.2 : 0.3)
          : (lightweightMode ? 0.1 : 0.15);
        ctx.strokeStyle = `rgba(220, 20, 60, ${p.life * alpha})`;
        ctx.lineWidth = lightweightMode ? 1 : 1.2;
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Boundary check
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          Object.assign(p, createParticle());
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (!lightweightMode) window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [scene, lightweightMode, prefersReducedMotion]); // Re-run effect on scene change and quality changes

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden glass-noise">
      {/* God Rays */}
      <div className="absolute inset-0" style={{ opacity: lightweightMode ? 0.2 : 0.3 }}>
        {!lightweightMode && (
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_70%)] animate-slow-spin origin-center" />
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0)_70%)]" />
      </div>

      {/* Generative Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: lightweightMode ? 0.24 : 0.4,
          mixBlendMode: lightweightMode ? 'normal' : 'multiply',
        }}
      />
    </div>
  );
};

export default Atmosphere;
