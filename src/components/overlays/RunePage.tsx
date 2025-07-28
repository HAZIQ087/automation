import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Rune {
  id: number;
  name: string;
  description: string;
  icon: string;
  slot: string;
}

interface RuneTree {
  id: number;
  name: string;
  icon: string;
  slots: Rune[][];
}

interface StatShard {
  id: number;
  name: string;
  value: string;
  icon: string;
}

interface SummonerSpell {
  id: number;
  name: string;
  description: string;
  icon: string;
  cooldown: number;
}

interface RunePageProps {
  primaryTree: RuneTree;
  secondaryTree: RuneTree;
  selectedRunes: number[];
  statShards: StatShard[];
  summonerSpells: SummonerSpell[];
  duration?: number;
  onComplete?: () => void;
}

export const RunePage = ({
  primaryTree,
  secondaryTree,
  selectedRunes,
  statShards,
  summonerSpells,
  duration = 4000,
  onComplete
}: RunePageProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Animate in steps
    const steps = [0, 1, 2, 3, 4]; // Different animation phases
    let currentStep = 0;

    const stepInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setAnimationStep(currentStep);
      } else {
        clearInterval(stepInterval);
      }
    }, 200);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 500);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, [duration, onComplete]);

  const isRuneSelected = (runeId: number) => selectedRunes.includes(runeId);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 animate-fade-out">
        {/* Fade out animation */}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 animate-fade-in">
      <div className="relative h-full flex items-center justify-center p-8">
        <Card className="gaming-card border-purple-void/30 bg-background/90 backdrop-blur-md max-w-6xl w-full">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-card-foreground mb-2">Rune Setup</h1>
              <p className="text-muted-foreground">Player's rune configuration for this match</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Primary Rune Tree */}
              <div className={`space-y-6 ${animationStep >= 1 ? 'animate-scale-in' : 'opacity-0'}`}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img 
                      src={primaryTree.icon} 
                      alt={primaryTree.name}
                      className="w-12 h-12 object-contain"
                    />
                    <h2 className="text-2xl font-bold text-card-foreground">{primaryTree.name}</h2>
                  </div>
                  <Badge variant="default" className="bg-purple-void text-white">Primary</Badge>
                </div>

                <div className="space-y-4">
                  {primaryTree.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex justify-center gap-2">
                      {slot.map((rune) => (
                        <div
                          key={rune.id}
                          className={`relative p-2 rounded-lg border-2 transition-all duration-300 ${
                            isRuneSelected(rune.id)
                              ? 'border-gold bg-gold/20 scale-110'
                              : 'border-border/50 bg-muted/30 opacity-60'
                          }`}
                        >
                          <img 
                            src={rune.icon} 
                            alt={rune.name}
                            className="w-12 h-12 object-contain"
                          />
                          {isRuneSelected(rune.id) && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-background" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Rune Tree */}
              <div className={`space-y-6 ${animationStep >= 2 ? 'animate-scale-in' : 'opacity-0'}`}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img 
                      src={secondaryTree.icon} 
                      alt={secondaryTree.name}
                      className="w-12 h-12 object-contain"
                    />
                    <h2 className="text-2xl font-bold text-card-foreground">{secondaryTree.name}</h2>
                  </div>
                  <Badge variant="outline">Secondary</Badge>
                </div>

                <div className="space-y-4">
                  {secondaryTree.slots.slice(1, 3).map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex justify-center gap-2">
                      {slot.map((rune) => (
                        <div
                          key={rune.id}
                          className={`relative p-2 rounded-lg border-2 transition-all duration-300 ${
                            isRuneSelected(rune.id)
                              ? 'border-teal-nexus bg-teal-nexus/20 scale-110'
                              : 'border-border/50 bg-muted/30 opacity-60'
                          }`}
                        >
                          <img 
                            src={rune.icon} 
                            alt={rune.name}
                            className="w-12 h-12 object-contain"
                          />
                          {isRuneSelected(rune.id) && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-nexus rounded-full border-2 border-background" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summoner Spells & Stat Shards */}
              <div className="space-y-8">
                
                {/* Summoner Spells */}
                <div className={`${animationStep >= 3 ? 'animate-scale-in' : 'opacity-0'}`}>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-card-foreground">Summoner Spells</h3>
                  </div>
                  <div className="flex justify-center gap-4">
                    {summonerSpells.map((spell) => (
                      <div
                        key={spell.id}
                        className="relative p-3 rounded-lg border-2 border-blue-rift bg-blue-rift/20"
                      >
                        <img 
                          src={spell.icon} 
                          alt={spell.name}
                          className="w-16 h-16 object-contain"
                        />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <Badge variant="default" className="text-xs bg-blue-rift text-white">
                            {spell.cooldown}s
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Stat Shards */}
                <div className={`${animationStep >= 4 ? 'animate-scale-in' : 'opacity-0'}`}>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-card-foreground">Stat Shards</h3>
                  </div>
                  <div className="space-y-3">
                    {statShards.map((shard, index) => (
                      <div key={shard.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                        <div className="flex items-center gap-3">
                          <img 
                            src={shard.icon} 
                            alt={shard.name}
                            className="w-8 h-8 object-contain"
                          />
                          <span className="text-sm font-medium text-card-foreground">{shard.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {shard.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-void to-teal-nexus"
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