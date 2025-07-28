import { useState, useEffect } from "react";
import { IntroScreen } from "./IntroScreen";
import { RunePage } from "./RunePage";
import { ItemPurchaseNotification } from "./ItemPurchaseNotification";
import { ObjectiveScoreboard } from "./ObjectiveScoreboard";
import { ObjectiveEventNotification } from "./ObjectiveEventNotification";

interface VideoOverlayManagerProps {
  matchData: any;
  onOverlayComplete?: () => void;
}

export const VideoOverlayManager = ({ matchData, onOverlayComplete }: VideoOverlayManagerProps) => {
  const [currentOverlay, setCurrentOverlay] = useState<'intro' | 'runes' | 'gameplay' | null>('intro');
  const [itemPurchases, setItemPurchases] = useState<any[]>([]);
  const [objectiveEvents, setObjectiveEvents] = useState<any[]>([]);
  const [gameStats, setGameStats] = useState({
    blueTeam: { name: "Blue", color: 'blue' as const, kills: 0, towers: 0, dragons: 0, barons: 0, gold: 0, score: 0 },
    redTeam: { name: "Red", color: 'red' as const, kills: 0, towers: 0, dragons: 0, barons: 0, gold: 0, score: 0 },
    gameTime: "00:00"
  });

  useEffect(() => {
    // Simulate the overlay sequence
    const sequence = async () => {
      // Show intro for 5 seconds
      setTimeout(() => {
        setCurrentOverlay('runes');
      }, 5000);

      // Show runes for 4 seconds
      setTimeout(() => {
        setCurrentOverlay('gameplay');
        startItemPurchaseSimulation();
        startObjectiveSimulation();
        startGameStatsSimulation();
      }, 9000);
    };

    sequence();
  }, []);

  const startItemPurchaseSimulation = () => {
    // Simulate item purchases during gameplay
    const purchases = [
      { time: 2000, item: 'Doran\'s Blade', cost: 450 },
      { time: 5000, item: 'Berserker\'s Greaves', cost: 1100 },
      { time: 8000, item: 'Kraken Slayer', cost: 3400 },
    ];

    purchases.forEach(purchase => {
      setTimeout(() => {
        setItemPurchases(prev => [...prev, {
          id: Date.now(),
          ...purchase,
          timestamp: Date.now()
        }]);
      }, purchase.time);
    });
  };

  const startObjectiveSimulation = () => {
    // Simulate objective events during gameplay
    const objectives = [
      { time: 3000, type: 'dragon', team: 'blue', description: 'Mountain Dragon', value: 1000 },
      { time: 6000, type: 'tower', team: 'red', description: 'Bot Lane Tower', value: 650 },
      { time: 12000, type: 'baron', team: 'blue', description: 'Baron Nashor', value: 1500 },
    ];

    objectives.forEach(objective => {
      setTimeout(() => {
        setObjectiveEvents(prev => [...prev, {
          id: Date.now(),
          ...objective,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, objective.time);
    });
  };

  const startGameStatsSimulation = () => {
    // Simulate game stats updates
    let gameTime = 0;
    const interval = setInterval(() => {
      gameTime += 1;
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      
      setGameStats(prev => ({
        ...prev,
        gameTime: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        blueTeam: {
          ...prev.blueTeam,
          kills: prev.blueTeam.kills + Math.random() > 0.95 ? 1 : 0,
          gold: prev.blueTeam.gold + Math.floor(Math.random() * 50) + 20
        },
        redTeam: {
          ...prev.redTeam,
          kills: prev.redTeam.kills + Math.random() > 0.95 ? 1 : 0,
          gold: prev.redTeam.gold + Math.floor(Math.random() * 50) + 20
        }
      }));
    }, 1000);

    // Clean up interval after 5 minutes
    setTimeout(() => clearInterval(interval), 300000);
  };

  const handleOverlayComplete = () => {
    if (currentOverlay === 'intro') {
      setCurrentOverlay('runes');
    } else if (currentOverlay === 'runes') {
      setCurrentOverlay('gameplay');
      startItemPurchaseSimulation();
      startObjectiveSimulation();
      startGameStatsSimulation();
    }
  };

  return (
    <div className="video-overlay-container">
      {currentOverlay === 'intro' && matchData.introData && (
        <IntroScreen
          matchInfo={matchData.introData}
          thumbnailUrl={matchData.thumbnailUrl}
          onComplete={handleOverlayComplete}
        />
      )}

      {currentOverlay === 'runes' && matchData.runeData && (
        <RunePage
          primaryTree={matchData.runeData.primaryTree}
          secondaryTree={matchData.runeData.secondaryTree}
          selectedRunes={matchData.runeData.selectedRunes}
          statShards={matchData.runeData.statShards}
          summonerSpells={matchData.runeData.summonerSpells}
          onComplete={handleOverlayComplete}
        />
      )}

      {currentOverlay === 'gameplay' && (
        <div className="gameplay-overlays">
          {/* Objective Scoreboard - Always visible during gameplay */}
          <ObjectiveScoreboard
            blueTeam={gameStats.blueTeam}
            redTeam={gameStats.redTeam}
            gameTime={gameStats.gameTime}
            currentDragon="mountain"
            isVisible={true}
            position="top"
          />

          {/* Item Purchase Notifications */}
          {itemPurchases.map((purchase) => (
            <ItemPurchaseNotification
              key={purchase.id}
              item={purchase.item}
              playerName={matchData.playerName}
              gameTime={purchase.time}
              gold={matchData.currentGold || 0}
              isVisible={true}
              onComplete={() => {
                setItemPurchases(prev => prev.filter(p => p.id !== purchase.id));
              }}
            />
          ))}

          {/* Objective Event Notifications */}
          {objectiveEvents.map((event) => (
            <ObjectiveEventNotification
              key={event.id}
              event={event}
              isVisible={true}
              onComplete={() => {
                setObjectiveEvents(prev => prev.filter(e => e.id !== event.id));
              }}
              position="center"
            />
          ))}
        </div>
      )}
    </div>
  );
};