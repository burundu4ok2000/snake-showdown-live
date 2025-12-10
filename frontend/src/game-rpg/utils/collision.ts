// Collision detection utilities

import { Position } from '../types/entities';
import { LevelMap, Tile } from '../types/level';

export class CollisionUtils {
    // Check point collision (circle vs circle)
    static checkPointCollision(
        pos1: Position,
        pos2: Position,
        radius1: number = 0.5,
        radius2: number = 0.5
    ): boolean {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (radius1 + radius2);
    }

    // Check rectangle collision (AABB)
    static checkRectCollision(
        x1: number, y1: number, w1: number, h1: number,
        x2: number, y2: number, w2: number, h2: number
    ): boolean {
        return (
            x1 < x2 + w2 &&
            x1 + w1 > x2 &&
            y1 < y2 + h2 &&
            y1 + h1 > y2
        );
    }

    // Get tile at position
    static getTileAt(map: LevelMap, position: Position): Tile | null {
        const tileX = Math.floor(position.x);
        const tileY = Math.floor(position.y);

        if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height) {
            return null;
        }

        return map.tiles[tileY]?.[tileX] || null;
    }

    // Check if position is walkable
    static isWalkable(map: LevelMap, position: Position): boolean {
        const tile = this.getTileAt(map, position);
        return tile?.walkable ?? false;
    }

    // Check if position is within map bounds
    static isInBounds(map: LevelMap, position: Position): boolean {
        return (
            position.x >= 0 &&
            position.y >= 0 &&
            position.x < map.width &&
            position.y < map.height
        );
    }

    // Get distance between two points
    static getDistance(pos1: Position, pos2: Position): number {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get angle between two points (in radians)
    static getAngle(from: Position, to: Position): number {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        return Math.atan2(dy, dx);
    }

    // Check line of sight between two points
    static hasLineOfSight(map: LevelMap, from: Position, to: Position): boolean {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(distance);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const checkPos = {
                x: from.x + dx * t,
                y: from.y + dy * t,
            };

            if (!this.isWalkable(map, checkPos)) {
                return false;
            }
        }

        return true;
    }
}
