import { useEffect, useRef } from 'react';

interface AtmosphereProps {
  scene?: string;
}

const Atmosphere = ({ scene }: AtmosphereProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Flow Field Config
    const particles: { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number }[] = [];
    const maxParticles = 120; // Increased for magnetism density
    const step = 0.005;

    const mouse = { x: 0, y: 0, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', handleMouseMove);

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

    const render = () => {
      // Semi-transparent clear for trails
      ctx.fillStyle = 'rgba(255, 245, 245, 0.03)'; // Longer trails
      ctx.fillRect(0, 0, width, height);

      time += step;

      particles.forEach((p, i) => {
        p.px = p.x;
        p.py = p.y;

        // Base Flow
        const angle = (Math.sin(p.x * 0.005 + time) + Math.cos(p.y * 0.005 + time)) * Math.PI;
        p.vx = Math.cos(angle) * 1.2;
        p.vy = Math.sin(angle) * 1.2;

        // HEART MAGNETISM (Phase 7 Exclusive)
        if (scene === 'confirmed') {
          const centerX = width / 2;
          const centerY = height / 2 - 30; // Adjust for heart offset
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Vortex effect
          const pull = 0.3;
          p.vx += (dx / dist) * pull + (dy / dist) * 0.5; // Radial pull + tangent rotation
          p.vy += (dy / dist) * pull - (dx / dist) * 0.5;
        }

        // Mouse avoidance
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            p.vx -= (dx / dist) * 1.8;
            p.vy -= (dy / dist) * 1.8;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw trail
        ctx.beginPath();
        const alpha = scene === 'confirmed' ? 0.3 : 0.15;
        ctx.strokeStyle = `rgba(220, 20, 60, ${p.life * alpha})`;
        ctx.lineWidth = 1.2;
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

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scene]); // Re-run effect on scene change

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden glass-noise">
      {/* God Rays */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-radial from-white/20 to-transparent animate-slow-spin origin-center" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)]" />
      </div>

      {/* Generative Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply" />
    </div>
  );
};

export default Atmosphere;
