import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '@/types/game';
import { cn } from '@/lib/utils';

interface MobileControlsProps {
    onMove: (direction: Direction) => void;
    className?: string;
}

export function MobileControls({ onMove, className }: MobileControlsProps) {
    // Use pointer down for instant reaction (better than click)
    const handlePress = (e: React.PointerEvent, dir: Direction) => {
        e.preventDefault();
        onMove(dir);
    };

    return (
        <div className={cn("grid grid-cols-3 gap-2 w-fit mx-auto select-none touch-none", className)}>
            {/* Row 1 */}
            <div />
            <Button
                variant="secondary"
                size="icon"
                className="h-14 w-14 rounded-full active:scale-95 transition-transform bg-primary/20 hover:bg-primary/30 border-2 border-primary/50"
                onPointerDown={(e) => handlePress(e, 'UP')}
                aria-label="Up"
            >
                <ChevronUp className="h-8 w-8 text-primary" />
            </Button>
            <div />

            {/* Row 2 */}
            <Button
                variant="secondary"
                size="icon"
                className="h-14 w-14 rounded-full active:scale-95 transition-transform bg-primary/20 hover:bg-primary/30 border-2 border-primary/50"
                onPointerDown={(e) => handlePress(e, 'LEFT')}
                aria-label="Left"
            >
                <ChevronLeft className="h-8 w-8 text-primary" />
            </Button>
            <Button
                variant="secondary"
                size="icon"
                className="h-14 w-14 rounded-full active:scale-95 transition-transform bg-primary/20 hover:bg-primary/30 border-2 border-primary/50"
                onPointerDown={(e) => handlePress(e, 'DOWN')}
                aria-label="Down"
            >
                <ChevronDown className="h-8 w-8 text-primary" />
            </Button>
            <Button
                variant="secondary"
                size="icon"
                className="h-14 w-14 rounded-full active:scale-95 transition-transform bg-primary/20 hover:bg-primary/30 border-2 border-primary/50"
                onPointerDown={(e) => handlePress(e, 'RIGHT')}
                aria-label="Right"
            >
                <ChevronRight className="h-8 w-8 text-primary" />
            </Button>
        </div>
    );
}
