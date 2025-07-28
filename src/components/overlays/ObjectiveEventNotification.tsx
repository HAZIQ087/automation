import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Building2, Zap, Trophy, Target } from "lucide-react";

interface ObjectiveEvent {
  id: string;
  type: 'dragon' | 'baron' | 'tower' | 'kill' | 'ace' | 'elder';
  team: 'blue' | 'red';
  player?: string;
  location?: string;
  timestamp: string;
  description: string;
  icon: string;
  value?: number; // gold value, etc.
}

interface ObjectiveEventNotificationProps {
  event: ObjectiveEvent;
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
  position?: 'top-center' | 'center' | 'bottom-center';
}

export const ObjectiveEventNotification = ({
  event,
  isVisible,
  onComplete,
  duration = 4000,
  position = 'center'
}: ObjectiveEventNotificationProps) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');

  useEffect(() => {
    if (!isVisible) return;

    // Animation sequence
    const enterTimer = setTimeout(() => {
      setAnimationPhase('display');
    }, 300);

    const exitTimer = setTimeout(() => {
      setAnimationPhase('exit');
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'dragon': return '🐉';
      case 'baron': return '👑';
      case 'elder': return '🔮';
      case 'tower': return '🏗️';
      case 'kill': return '⚔️';
      case 'ace': return '💀';
      default: return '⭐';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'dragon': return 'border-orange-500 bg-orange-500/20 text-orange-400';
      case 'baron': return 'border-purple-void bg-purple-void/20 text-purple-400';
      case 'elder': return 'border-gold bg-gold/20 text-gold';
      case 'tower': return 'border-blue-rift bg-blue-rift/20 text-blue-400';
      case 'kill': return 'border-red-baron bg-red-baron/20 text-red-400';
      case 'ace': return 'border-destructive bg-destructive/20 text-destructive';
      default: return 'border-muted bg-muted/20 text-muted-foreground';
    }
  };

  const getTeamColor = (team: 'blue' | 'red') => {
    return team === 'blue' ? 'text-blue-rift' : 'text-red-baron';
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-center':
        return 'top-20 left-1/2 transform -translate-x-1/2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'bottom-center':
        return 'bottom-20 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  const getEventTitle = (type: string) => {
    switch (type) {
      case 'dragon': return 'DRAGON SLAIN';
      case 'baron': return 'BARON SLAIN';
      case 'elder': return 'ELDER DRAGON SLAIN';
      case 'tower': return 'TOWER DESTROYED';
      case 'kill': return 'CHAMPION ELIMINATED';
      case 'ace': return 'ACE!';
      default: return 'OBJECTIVE COMPLETED';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <Card 
        className={`
          gaming-card border-2 transition-all duration-700 ease-out min-w-96
          ${getEventColor(event.type)}
          ${animationPhase === 'enter' ? 'scale-0 opacity-0 rotate-12' : ''}
          ${animationPhase === 'display' ? 'scale-100 opacity-100 rotate-0' : ''}
          ${animationPhase === 'exit' ? 'scale-95 opacity-0 -rotate-6' : ''}
        `}
      >
        <div className="p-6 text-center">
          
          {/* Event Icon */}
          <div className="mb-4">
            <div className="relative inline-block">
              <div className="text-6xl mb-2 animate-pulse">
                {getEventIcon(event.type)}
              </div>
              {event.type === 'ace' && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-destructive rounded-full animate-ping" />
                </div>
              )}
            </div>
          </div>

          {/* Event Title */}
          <h2 className="text-3xl font-bold text-card-foreground mb-2 tracking-wider">
            {getEventTitle(event.type)}
          </h2>

          {/* Team Badge */}
          <div className="mb-4">
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-1 font-bold ${getTeamColor(event.team)} border-current`}
            >
              {event.team.toUpperCase()} TEAM
            </Badge>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {event.player && (
              <p className="text-lg text-card-foreground">
                <span className="text-muted-foreground">by</span>{" "}
                <span className="font-bold">{event.player}</span>
              </p>
            )}
            
            {event.location && (
              <p className="text-sm text-muted-foreground">
                {event.location}
              </p>
            )}
            
            <p className="text-sm font-medium text-card-foreground">
              {event.description}
            </p>
          </div>

          {/* Value Display */}
          {event.value && (
            <div className="mb-4">
              <Badge variant="secondary" className="text-gold border-gold/50 bg-gold/10">
                +{event.value}g team gold
              </Badge>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground">
            {event.timestamp}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-current opacity-60"
                style={{ 
                  width: '0%',
                  animation: `progress-bar ${duration}ms linear forwards`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress-bar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `
      }} />
    </div>
  );
};

// Queue system for multiple objective events
export const ObjectiveEventQueue = () => {
  const [events, setEvents] = useState<ObjectiveEvent[]>([]);

  const addEvent = (event: ObjectiveEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Only show one major event at a time
  const currentEvent = events[0];

  return (
    <>
      {currentEvent && (
        <ObjectiveEventNotification
          event={currentEvent}
          isVisible={true}
          onComplete={() => removeEvent(currentEvent.id)}
          position="center"
        />
      )}
    </>
  );
};