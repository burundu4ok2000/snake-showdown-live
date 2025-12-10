// A* Pathfinding for enemy AI

import { Position } from '../types/entities';
import { LevelMap } from '../types/level';
import { CollisionUtils } from './collision';

interface PathNode {
    position: Position;
    g: number; // Cost from start
    h: number; // Heuristic cost to goal
    f: number; // Total cost (g + h)
    parent: PathNode | null;
}

export class Pathfinding {
    // Find path from start to goal using A*
    static findPath(
        map: LevelMap,
        start: Position,
        goal: Position,
        maxIterations: number = 100
    ): Position[] {
        // Use Manhattan distance heuristic
        const heuristic = (pos: Position): number => {
            return Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y);
        };

        const openSet: PathNode[] = [];
        const closedSet: Set<string> = new Set();

        // Start node
        const startNode: PathNode = {
            position: start,
            g: 0,
            h: heuristic(start),
            f: heuristic(start),
            parent: null,
        };

        openSet.push(startNode);

        let iterations = 0;

        while (openSet.length > 0 && iterations < maxIterations) {
            iterations++;

            // Get node with lowest f score
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift()!;

            const key = `${Math.floor(current.position.x)}_${Math.floor(current.position.y)}`;

            // Check if we reached the goal
            if (CollisionUtils.getDistance(current.position, goal) < 1.0) {
                return this.reconstructPath(current);
            }

            closedSet.add(key);

            // Check neighbors
            const neighbors = this.getNeighbors(map, current.position);

            for (const neighborPos of neighbors) {
                const neighborKey = `${Math.floor(neighborPos.x)}_${Math.floor(neighborPos.y)}`;

                if (closedSet.has(neighborKey)) {
                    continue;
                }

                const g = current.g + 1;
                const h = heuristic(neighborPos);
                const f = g + h;

                // Check if neighbor is already in open set
                const existingNode = openSet.find(node => {
                    const nodeKey = `${Math.floor(node.position.x)}_${Math.floor(node.position.y)}`;
                    return nodeKey === neighborKey;
                });

                if (existingNode) {
                    if (g < existingNode.g) {
                        existingNode.g = g;
                        existingNode.f = f;
                        existingNode.parent = current;
                    }
                } else {
                    openSet.push({
                        position: neighborPos,
                        g,
                        h,
                        f,
                        parent: current,
                    });
                }
            }
        }

        // No path found, return empty array
        return [];
    }

    // Get walkable neighbors
    private static getNeighbors(map: LevelMap, position: Position): Position[] {
        const neighbors: Position[] = [];
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 },  // Right
        ];

        for (const dir of directions) {
            const newPos = {
                x: Math.floor(position.x) + dir.x + 0.5,
                y: Math.floor(position.y) + dir.y + 0.5,
            };

            if (CollisionUtils.isWalkable(map, newPos)) {
                neighbors.push(newPos);
            }
        }

        return neighbors;
    }

    // Reconstruct path from goal to start
    private static reconstructPath(node: PathNode): Position[] {
        const path: Position[] = [];
        let current: PathNode | null = node;

        while (current !== null) {
            path.unshift(current.position);
            current = current.parent;
        }

        return path;
    }

    // Simplified path following - just returns next direction
    static getNextDirection(
        currentPos: Position,
        targetPos: Position
    ): { x: number; y: number } {
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.1) {
            return { x: 0, y: 0 };
        }

        return {
            x: dx / distance,
            y: dy / distance,
        };
    }
}
