import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
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

    const ButtonBase = ({ dir, icon: Icon, label }: { dir: Direction, icon: LucideIcon, label: string }) => (
        <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-2xl active:scale-90 transition-all duration-100 bg-primary/20 backdrop-blur-md border border-white/10 hover:bg-primary/30 text-primary shadow-lg"
            onPointerDown={(e) => handlePress(e, dir)}
            aria-label={label}
        >
            <Icon className="h-8 w-8" strokeWidth={3} />
        </Button>
    );

    return (
        <div className={cn("flex flex-col items-center gap-2 select-none touch-none pb-4", className)}>
            {/* Up Button */}
            <div className="flex justify-center">
                <ButtonBase dir="UP" icon={ChevronUp} label="Up" />
            </div>

            {/* Left, Down, Right Buttons */}
            <div className="flex gap-2 justify-center">
                <ButtonBase dir="LEFT" icon={ChevronLeft} label="Left" />
                <ButtonBase dir="DOWN" icon={ChevronDown} label="Down" />
                <ButtonBase dir="RIGHT" icon={ChevronRight} label="Right" />
            </div>
        </div>
    );
}

