// Particle System for visual effects

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

    // Create explosion particles
    createExplosion(x: number, y: number, color: string, count: number = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 2 + Math.random() * 3;

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                color,
                size: 3 + Math.random() * 3,
            });
        }
    }

    // Create sparkle particles
    createSparkle(x: number, y: number, color: string, count: number = 6) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.8,
                maxLife: 0.8,
                color,
                size: 2 + Math.random() * 2,
            });
        }
    }

    // Update all particles
    update(deltaTime: number) {
        this.particles = this.particles.filter(p => {
            p.life -= deltaTime;
            if (p.life <= 0) return false;

            p.x += p.vx * deltaTime * 20;
            p.y += p.vy * deltaTime * 20;
            p.vy += 5 * deltaTime; // Gravity

            return true;
        });
    }

    // Render all particles
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

    // Get particle count
    getCount(): number {
        return this.particles.length;
    }
}
