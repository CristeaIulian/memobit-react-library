import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

import './Confetti.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ConfettiVariant = 'confetti' | 'burst' | 'fireworks';
export type ConfettiScope = 'fullscreen' | 'container';

export interface ConfettiHandle {
    trigger: () => void;
}

interface ConfettiProps {
    colors?: string[];
    duration?: number; // ms — how long the animation runs (default: 3000)
    scope?: ConfettiScope; // fullscreen | container (default: fullscreen)
    variant?: ConfettiVariant;
    particleCount?: number; // override default particle count per variant
}

// ─── Particle types ───────────────────────────────────────────────────────────

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;
    spin: number;
    size: number;
    color: string;
    opacity: number;
    shape: 'rect' | 'circle' | 'star';
    // fireworks only
    trail?: { x: number; y: number }[];
    exploded?: boolean;
    children?: Particle[];
}

// ─── Theme color fallback ─────────────────────────────────────────────────────

const DEFAULT_COLORS = [
    '#0891b2', // --body-accent-color
    '#06b6d4',
    '#16a34a', // --button-success-background-color
    '#f59e0b', // --button-warning-background-color
    '#dc2626', // --body-danger-color
    '#8b5cf6',
    '#ec4899',
    '#f97316',
];

const resolveColors = (colors?: string[]): string[] => {
    if (colors && colors.length > 0) return colors;
    // Try to read from CSS vars at runtime
    const style = getComputedStyle(document.documentElement);
    const fromVars = [
        style.getPropertyValue('--body-accent-color').trim(),
        style.getPropertyValue('--button-success-background-color').trim(),
        style.getPropertyValue('--button-warning-background-color').trim(),
        style.getPropertyValue('--body-danger-color').trim(),
    ].filter(Boolean);
    return fromVars.length >= 2 ? [...fromVars, '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'] : DEFAULT_COLORS;
};

// ─── Particle factories ────────────────────────────────────────────────────────

const randomShape = (): Particle['shape'] => {
    const r = Math.random();
    return r < 0.5 ? 'rect' : r < 0.8 ? 'circle' : 'star';
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const makeConfettiParticle = (w: number, _h: number, colors: string[]): Particle => ({
    x: Math.random() * w,
    y: -10 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 2,
    vy: 2 + Math.random() * 4,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.2,
    size: 5 + Math.random() * 8,
    color: pick(colors),
    opacity: 1,
    shape: randomShape(),
});

const makeBurstParticle = (cx: number, cy: number, colors: string[]): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 10;
    return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        size: 4 + Math.random() * 8,
        color: pick(colors),
        opacity: 1,
        shape: randomShape(),
    };
};

const makeRocket = (w: number, h: number, colors: string[]): Particle => ({
    x: w * 0.2 + Math.random() * w * 0.6,
    y: h + 20, // starts just below the visible canvas
    vx: (Math.random() - 0.5) * 1.5,
    vy: -(12 + Math.random() * 6),
    angle: 0,
    spin: 0,
    size: 3,
    color: pick(colors),
    opacity: 1,
    shape: 'circle',
    trail: [],
    exploded: false,
    children: [],
});

const makeExplosionParticle = (x: number, y: number, colors: string[]): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 5;
    return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        size: 2 + Math.random() * 5,
        color: pick(colors),
        opacity: 1,
        shape: randomShape(),
    };
};

// ─── Draw helpers ─────────────────────────────────────────────────────────────

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    const spikes = 5;
    const inner = r * 0.4;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? r : inner;
        const a = (i * Math.PI) / spikes - Math.PI / 2;
        i === 0 ? ctx.moveTo(x + radius * Math.cos(a), y + radius * Math.sin(a)) : ctx.lineTo(x + radius * Math.cos(a), y + radius * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
};

const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    switch (p.shape) {
        case 'rect':
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            break;
        case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'star':
            drawStar(ctx, 0, 0, p.size / 2);
            break;
    }
    ctx.restore();
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Confetti = forwardRef<ConfettiHandle, ConfettiProps>(
    ({ colors, duration = 3000, scope = 'fullscreen', variant = 'confetti', particleCount }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const rafRef = useRef<number>(0);
        const startTimeRef = useRef<number>(0);
        const activeRef = useRef(false);

        const defaultCounts: Record<ConfettiVariant, number> = {
            confetti: 150,
            burst: 200,
            fireworks: 8,
        };

        const stop = useCallback(() => {
            activeRef.current = false;
            cancelAnimationFrame(rafRef.current);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
        }, []);

        const trigger = useCallback(() => {
            const canvas = canvasRef.current;
            if (!canvas || activeRef.current) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Size canvas to its rendered size
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const w = canvas.width;
            const h = canvas.height;
            const resolvedColors = resolveColors(colors);
            const count = particleCount ?? defaultCounts[variant];

            activeRef.current = true;
            startTimeRef.current = performance.now();

            // ── Build initial particles ─────────────────────────────────────────
            let particles: Particle[] = [];

            if (variant === 'confetti') {
                particles = Array.from({ length: count }, () => makeConfettiParticle(w, h, resolvedColors));
            } else if (variant === 'burst') {
                const cx = w / 2;
                const cy = h / 2;
                particles = Array.from({ length: count }, () => makeBurstParticle(cx, cy, resolvedColors));
            } else if (variant === 'fireworks') {
                particles = Array.from({ length: count }, () => makeRocket(w, h, resolvedColors));
            }

            // ── Animation loop ──────────────────────────────────────────────────
            const animate = (now: number) => {
                if (!activeRef.current) return;

                const elapsed = now - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);

                ctx.clearRect(0, 0, w, h);

                if (variant === 'confetti') {
                    // Spawn more confetti in first 60% of duration
                    if (progress < 0.6 && Math.random() < 0.3) {
                        particles.push(makeConfettiParticle(w, h, resolvedColors));
                    }

                    particles = particles.filter(p => p.opacity > 0 && p.y < h + 20);
                    particles.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.08; // gravity
                        p.vx += (Math.random() - 0.5) * 0.1; // drift
                        p.angle += p.spin;
                        // fade out in last 40%
                        if (progress > 0.6) p.opacity -= 0.015;
                        drawParticle(ctx, p);
                    });
                } else if (variant === 'burst') {
                    particles = particles.filter(p => p.opacity > 0);
                    particles.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.15; // gravity
                        p.vx *= 0.98; // drag
                        p.angle += p.spin;
                        p.opacity -= 0.012;
                        drawParticle(ctx, p);
                    });
                } else if (variant === 'fireworks') {
                    // Spawn new rockets periodically
                    if (progress < 0.85 && Math.random() < 0.04) {
                        particles.push(makeRocket(w, h, resolvedColors));
                    }

                    particles = particles.filter(p => {
                        if (p.exploded) {
                            return p.children?.some(c => c.opacity > 0) ?? false;
                        }
                        return p.y > -h * 0.1;
                    });

                    particles.forEach(p => {
                        if (!p.exploded) {
                            // Rocket ascending
                            p.trail?.push({ x: p.x, y: p.y });
                            if ((p.trail?.length ?? 0) > 12) p.trail?.shift();

                            // Draw trail
                            p.trail?.forEach((pt, i) => {
                                const a = ((i + 1) / (p.trail?.length ?? 1)) * 0.6;
                                ctx.save();
                                ctx.globalAlpha = a;
                                ctx.fillStyle = p.color;
                                ctx.beginPath();
                                ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.restore();
                            });

                            // Draw rocket head
                            ctx.save();
                            ctx.globalAlpha = 1;
                            ctx.fillStyle = p.color;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.restore();

                            p.x += p.vx;
                            p.y += p.vy;
                            p.vy += 0.18; // decelerate

                            // Explode when velocity reverses (peak)
                            if (p.vy >= 0) {
                                p.exploded = true;
                                const explosionCount = 60 + Math.floor(Math.random() * 40);
                                p.children = Array.from({ length: explosionCount }, () => makeExplosionParticle(p.x, p.y, resolvedColors));

                                // Flash
                                ctx.save();
                                ctx.globalAlpha = 0.8;
                                ctx.fillStyle = '#ffffff';
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.restore();
                            }
                        } else {
                            // Explosion particles
                            p.children?.forEach(c => {
                                c.x += c.vx;
                                c.y += c.vy;
                                c.vy += 0.06;
                                c.vx *= 0.97;
                                c.angle += c.spin;
                                c.opacity -= 0.014;
                                drawParticle(ctx, c);
                            });
                        }
                    });
                }

                if (progress >= 1 || particles.length === 0) {
                    stop();
                    return;
                }

                rafRef.current = requestAnimationFrame(animate);
            };

            rafRef.current = requestAnimationFrame(animate);
        }, [colors, duration, variant, particleCount, stop]);

        // Expose trigger() via ref
        useImperativeHandle(ref, () => ({ trigger }), [trigger]);

        // Cleanup on unmount
        useEffect(
            () => () => {
                cancelAnimationFrame(rafRef.current);
            },
            []
        );

        return <canvas ref={canvasRef} className={`confetti-canvas confetti-canvas--${scope}`} aria-hidden="true" />;
    }
);
