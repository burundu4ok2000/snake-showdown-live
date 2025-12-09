import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/soundManager';
import { cn } from '@/lib/utils';

interface SoundToggleProps {
    className?: string;
}

export function SoundToggle({ className }: SoundToggleProps) {
    const [isMuted, setIsMuted] = useState(soundManager.getMuteState());

    useEffect(() => {
        // Sync with soundManager state on mount
        setIsMuted(soundManager.getMuteState());
    }, []);

    const handleToggle = () => {
        const newMutedState = soundManager.toggleMute();
        setIsMuted(newMutedState);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className={cn("h-10 w-10", className)}
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
            {isMuted ? (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
            ) : (
                <Volume2 className="h-5 w-5 text-foreground" />
            )}
        </Button>
    );
}
