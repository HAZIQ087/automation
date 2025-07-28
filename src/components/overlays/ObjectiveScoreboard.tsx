import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Crown, Zap, Building2, Skull, Timer, TrendingUp, TrendingDown } from "lucide-react";

interface TeamStats {
  name: string;
  color: 'blue' | 'red';
  kills: number;
  towers: number;
  dragons: number;
  barons: number;
  gold: number;
  score: number;
}

interface ObjectiveEvent {
  type: 'dragon' | 'baron' | 'tower' | 'kill';
  team: 'blue' | 'red';
  timestamp: string;
  description: string;
  icon: string;
}

interface ObjectiveScoreboardProps {
  blueTeam: TeamStats;
  redTeam: TeamStats;
  gameTime: string;
  currentDragon?: string;
  dragonSoul?: string;
  recentEvents?: ObjectiveEvent[];
  isVisible?: boolean;
  position?: 'top' | 'bottom';
}

export const ObjectiveScoreboard = ({
  blueTeam,
  redTeam,
  gameTime,
  currentDragon = "mountain",
  dragonSoul,
  recentEvents = [],
  isVisible = true,
  position = 'top'
}: ObjectiveScoreboardProps) => {
  const [animationState, setAnimationState] = useState<'enter' | 'visible' | 'highlight'>('enter');
  const [goldDifference, setGoldDifference] = useState(0);

  useEffect(() => {
    setGoldDifference(blueTeam.gold - redTeam.gold);
    
    // Animation sequence
    setTimeout(() => setAnimationState('visible'), 300);
  }, [blueTeam.gold, redTeam.gold]);

  useEffect(() => {
    // Highlight effect when new events occur
    if (recentEvents.length > 0) {
      setAnimationState('highlight');
      setTimeout(() => setAnimationState('visible'), 1000);
    }
  }, [recentEvents]);

  if (!isVisible) return null;

  const getDragonIcon = (dragon: string) => {
    const dragons = {
      mountain: "🐉",
      cloud: "💨", 
      infernal: "🔥",
      ocean: "🌊",
      elder: "👑"
    };
    return dragons[dragon as keyof typeof dragons] || "🐉";
  };

  const getTeamColor = (team: 'blue' | 'red') => {
    return team === 'blue' ? 'text-blue-rift border-blue-rift bg-blue-rift/10' : 'text-red-baron border-red-baron bg-red-baron/10';
  };

  const formatGold = (gold: number) => {
    if (gold >= 1000) {
      return `${(gold / 1000).toFixed(1)}k`;
    }
    return gold.toString();
  };

  const formatGoldDifference = (diff: number) => {
    const abs = Math.abs(diff);
    const prefix = diff > 0 ? '+' : diff < 0 ? '-' : '';
    return `${prefix}${formatGold(abs)}`;
  };

  return (
    <div className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-40`}>
      <Card 
        className={`
          gaming-card border-gold/30 bg-background/95 backdrop-blur-md transition-all duration-500
          ${animationState === 'enter' ? 'opacity-0 -translate-y-4' : ''}
          ${animationState === 'visible' ? 'opacity-100 translate-y-0' : ''}
          ${animationState === 'highlight' ? 'opacity-100 translate-y-0 scale-105 border-gold' : ''}
        `}
      >
        <div className="px-6 py-3">
          
          {/* Main Scoreboard */}
          <div className="flex items-center gap-8">
            
            {/* Blue Team */}
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-lg border ${getTeamColor('blue')}`}>
                <span className="font-bold text-lg">{blueTeam.name}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Skull className="w-4 h-4 text-red-baron" />
                  <span className="font-bold text-card-foreground">{blueTeam.kills}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span className="font-bold text-card-foreground">{blueTeam.towers}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-lg">{getDragonIcon(currentDragon)}</span>
                  <span className="font-bold text-card-foreground">{blueTeam.dragons}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-purple-void" />
                  <span className="font-bold text-card-foreground">{blueTeam.barons}</span>
                </div>
              </div>
            </div>

            {/* Center - Game Time & Score */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gold" />
                <span className="font-mono text-lg font-bold text-card-foreground">{gameTime}</span>
              </div>
              
              <div className="text-2xl font-bold text-card-foreground">
                {blueTeam.score} - {redTeam.score}
              </div>
              
              {/* Gold Difference */}
              <div className="flex items-center gap-1">
                {goldDifference > 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : goldDifference < 0 ? (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                ) : null}
                <span className={`text-sm font-medium ${
                  goldDifference > 0 ? 'text-success' : 
                  goldDifference < 0 ? 'text-destructive' : 
                  'text-muted-foreground'
                }`}>
                  {formatGoldDifference(goldDifference)}
                </span>
              </div>
            </div>

            {/* Red Team */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-purple-void" />
                  <span className="font-bold text-card-foreground">{redTeam.barons}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-lg">{getDragonIcon(currentDragon)}</span>
                  <span className="font-bold text-card-foreground">{redTeam.dragons}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span className="font-bold text-card-foreground">{redTeam.towers}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Skull className="w-4 h-4 text-red-baron" />
                  <span className="font-bold text-card-foreground">{redTeam.kills}</span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-lg border ${getTeamColor('red')}`}>
                <span className="font-bold text-lg">{redTeam.name}</span>
              </div>
            </div>
          </div>

          {/* Dragon Soul Indicator */}
          {dragonSoul && (
            <>
              <Separator className="my-2" />
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{getDragonIcon(dragonSoul)}</span>
                <span className="text-sm font-medium text-gold">
                  {dragonSoul.charAt(0).toUpperCase() + dragonSoul.slice(1)} Soul Available
                </span>
              </div>
            </>
          )}

          {/* Recent Events */}
          {recentEvents.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="flex items-center justify-center gap-4">
                {recentEvents.slice(-3).map((event, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm">{event.icon}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTeamColor(event.team)}`}
                    >
                      {event.description}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {event.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};