import { VideoOverlayManager } from "@/components/overlays/VideoOverlayManager";

const mockMatchData = {
  gameId: "KR_123456789",
  participants: [
    {
      puuid: "faker-puuid",
      summonerName: "Hide on bush",
      championName: "Azir",
      championId: 268,
      teamId: 100,
      position: "MIDDLE",
      kills: 12,
      deaths: 2,
      assists: 8,
      level: 18,
      totalGold: 18750,
      items: [3040, 3020, 3157, 3135, 3089, 3916],
      runes: {
        primaryStyle: 8100,
        subStyle: 8300,
        perk0: 8112,
        perk1: 8143,
        perk2: 8138,
        perk3: 8135,
        perk4: 8345,
        perk5: 8347,
        perkPrimaryStyle: 8100,
        perkSubStyle: 8300,
        statPerk0: 5005,
        statPerk1: 5008,
        statPerk2: 5002
      },
      summoners: {
        spell1Id: 4,
        spell2Id: 12
      },
      rank: "Challenger",
      lp: 1247
    }
  ],
  gameDuration: 1965,
  teams: [
    {
      teamId: 100,
      win: true,
      kills: 34,
      towers: 8,
      dragons: 3,
      barons: 1,
      heralds: 2
    },
    {
      teamId: 200,
      win: false,
      kills: 21,
      towers: 3,
      dragons: 1,
      barons: 0,
      heralds: 0
    }
  ]
};

export default function Overlays() {
  return (
    <div className="min-h-screen bg-background">
      <VideoOverlayManager matchData={mockMatchData} />
    </div>
  );
}