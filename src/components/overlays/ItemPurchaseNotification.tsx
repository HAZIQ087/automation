import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TrendingUp, Zap, Shield } from "lucide-react";

interface ItemStats {
  name: string;
  value: string | number;
  type: 'damage' | 'defense' | 'utility' | 'stats';
}

interface Item {
  id: number;
  name: string;
  description: string;
  icon: string;
  cost: number;
  category: string;
  stats: ItemStats[];
  buildPath?: string[];
}

interface ItemPurchaseNotificationProps {
  item: Item;
  playerName: string;
  gameTime: string;
  gold: number;
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

export const ItemPurchaseNotification = ({
  item,
  playerName,
  gameTime,
  gold,
  isVisible,
  onComplete,
  duration = 3000
}: ItemPurchaseNotificationProps) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');

  useEffect(() => {
    if (!isVisible) return;

    // Animation phases
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'damage': return TrendingUp;
      case 'defense': return Shield;
      case 'utility': return Zap;
      default: return ShoppingCart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'damage': return 'text-red-baron border-red-baron/50 bg-red-baron/10';
      case 'defense': return 'text-blue-rift border-blue-rift/50 bg-blue-rift/10';
      case 'utility': return 'text-teal-nexus border-teal-nexus/50 bg-teal-nexus/10';
      default: return 'text-gold border-gold/50 bg-gold/10';
    }
  };

  const getStatTypeIcon = (type: string) => {
    switch (type) {
      case 'damage': return '⚔️';
      case 'defense': return '🛡️';
      case 'utility': return '⚡';
      default: return '📊';
    }
  };

  const CategoryIcon = getCategoryIcon(item.category);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card 
        className={`
          gaming-card border-2 max-w-sm transition-all duration-500 ease-out
          ${getCategoryColor(item.category)}
          ${animationPhase === 'enter' ? 'animate-slide-in-right opacity-0' : ''}
          ${animationPhase === 'display' ? 'animate-fade-in' : ''}
          ${animationPhase === 'exit' ? 'animate-slide-out-right' : ''}
        `}
      >
        <div className="p-4">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-muted-foreground">Item Purchase</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {gameTime}
            </Badge>
          </div>

          {/* Item Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-lg border-2 border-gold/50 bg-gradient-to-br from-gold/20 to-transparent overflow-hidden">
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1">
                <CategoryIcon className="w-5 h-5 text-gold bg-background rounded-full p-1" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-card-foreground text-lg leading-tight mb-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
                <span className="text-sm text-gold font-bold">
                  {item.cost}g
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {playerName}
              </p>
            </div>
          </div>

          {/* Item Stats */}
          {item.stats.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Stats
              </div>
              <div className="grid grid-cols-2 gap-2">
                {item.stats.slice(0, 4).map((stat, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <span className="text-xs">{getStatTypeIcon(stat.type)}</span>
                    <span className="text-card-foreground font-medium truncate">
                      {stat.name}:
                    </span>
                    <span className="text-gold font-bold">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gold Remaining */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">Gold Remaining</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gold">{gold}</span>
              <span className="text-xs text-muted-foreground">g</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-0.5 bg-border rounded-full overflow-hidden">
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

// Queue system for multiple notifications
export const ItemPurchaseQueue = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    item: Item;
    playerName: string;
    gameTime: string;
    gold: number;
  }>>([]);

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            transform: `translateY(${index * 8}px)`,
            zIndex: 50 - index 
          }}
        >
          <ItemPurchaseNotification
            item={notification.item}
            playerName={notification.playerName}
            gameTime={notification.gameTime}
            gold={notification.gold}
            isVisible={true}
            onComplete={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};