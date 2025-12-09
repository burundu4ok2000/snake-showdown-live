/**
 * Simple particle system for game effects
 */

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

export class ParticleSystem {
    private particles: Particle[] = [];

    /**
     * Create food eat particles
     */
    spawnFoodParticles(x: number, y: number, cellSize: number) {
        const colors = ['#f59e0b', '#eab308', '#84cc16', '#22c55e'];
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 2;

            this.particles.push({
                x: x * cellSize + cellSize / 2,
                y: y * cellSize + cellSize / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 3 + Math.random() * 3,
            });
        }
    }

    /**
     * Create game over explosion
     */
    spawnExplosion(x: number, y: number, cellSize: number) {
        const colors = ['#ef4444', '#dc2626', '#f97316', '#fb923c'];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 4;

            this.particles.push({
                x: x * cellSize + cellSize / 2,
                y: y * cellSize + cellSize / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 4,
            });
        }
    }

    /**
     * Update all particles
     */
    update(deltaTime: number = 0.016) {
        this.particles = this.particles.filter(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Apply gravity
            p.vy += 0.2;

            // Reduce life
            p.life -= deltaTime;

            return p.life > 0;
        });
    }

    /**
     * Render all particles
     */
    render(ctx: CanvasRenderingContext2D) {
        this.particles.forEach(p => {
            const alpha = p.life / p.maxLife;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }

    /**
     * Get particle count
     */
    getCount(): number {
        return this.particles.length;
    }
}
