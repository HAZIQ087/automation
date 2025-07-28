import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Trophy, Sword } from "lucide-react";

interface MatchInfo {
  championName: string;
  playerName: string;
  rank: string;
  tier: string;
  lp: number;
  gameMode: string;
  gameDuration: string;
  kda: {
    kills: number;
    deaths: number;
    assists: number;
  };
  championIcon: string;
  rankIcon: string;
}

interface IntroScreenProps {
  matchInfo: MatchInfo;
  thumbnailUrl: string;
  duration?: number;
  onComplete?: () => void;
}

export const IntroScreen = ({ 
  matchInfo, 
  thumbnailUrl, 
  duration = 5000,
  onComplete 
}: IntroScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 500); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const getRankColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'challenger': return 'text-gold';
      case 'grandmaster': return 'text-red-baron';
      case 'master': return 'text-purple-void';
      case 'diamond': return 'text-blue-rift';
      default: return 'text-muted-foreground';
    }
  };

  const getRankIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'challenger': return Crown;
      case 'grandmaster': return Trophy;
      case 'master': return Star;
      default: return Sword;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 animate-fade-out">
        {/* Fade out animation */}
      </div>
    );
  }

  const RankIcon = getRankIcon(matchInfo.tier);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 animate-fade-in">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      />
      
      <div className="relative h-full flex items-center justify-center p-8">
        <Card className="gaming-card border-gold/30 bg-background/90 backdrop-blur-md max-w-4xl w-full">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Champion Image */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-4 border-gold/50 overflow-hidden bg-gradient-to-br from-gold/20 to-transparent">
                    <img 
                      src={matchInfo.championIcon} 
                      alt={matchInfo.championName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="px-4 py-1 text-lg font-bold bg-gold text-black">
                      {matchInfo.championName}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Match Information */}
              <div className="space-y-6 text-center lg:text-left">
                <div>
                  <h1 className="text-4xl font-bold text-card-foreground mb-2">
                    {matchInfo.playerName}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <RankIcon className={`w-6 h-6 ${getRankColor(matchInfo.tier)}`} />
                    <span className={`text-xl font-semibold ${getRankColor(matchInfo.tier)}`}>
                      {matchInfo.tier} {matchInfo.rank}
                    </span>
                    <Badge variant="outline" className="text-sm">
                      {matchInfo.lp} LP
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      {matchInfo.gameMode}
                    </Badge>
                    <span className="text-muted-foreground">
                      {matchInfo.gameDuration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-lg">
                    <span className="text-success font-bold">{matchInfo.kda.kills}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-destructive font-bold">{matchInfo.kda.deaths}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-warning font-bold">{matchInfo.kda.assists}</span>
                    <span className="text-muted-foreground ml-2">KDA</span>
                  </div>
                </div>
              </div>

              {/* Rank Icon */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <img 
                    src={matchInfo.rankIcon} 
                    alt={`${matchInfo.tier} ${matchInfo.rank}`}
                    className="w-32 h-32 object-contain opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent rounded-full" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-yellow-500"
                  style={{ 
                    width: '0%',
                    animation: `progress-bar ${duration}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

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