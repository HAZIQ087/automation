import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trophy, 
  Clock, 
  Users,
  Sword,
  Shield,
  Star
} from "lucide-react";

interface ReplayFilter {
  server: string;
  tier: string;
  minDuration: number;
  kdaThreshold: number;
  onlyWinners: boolean;
  recordingMode: 'random-pro' | 'specific-pro' | 'single-tier' | 'all-tiers' | 'champion-tier' | 'continuous-auto';
  specificPlayer?: string;
  selectedTier?: string;
  specificChampion?: string;
  continuousRecording: boolean;
}

interface Replay {
  id: string;
  player: string;
  champion: string;
  rank: string;
  kda: string;
  duration: string;
  gameMode: string;
  patch: string;
  downloadUrl: string;
  teamId?: number;
  win?: boolean;
  fogOfWar?: string;
  server?: string;
  recordingSettings?: {
    fogOfWar: string;
    teamColor: string;
    autoRecord: boolean;
  };
}

export const ReplayDiscovery = () => {
  const { replays, setReplays, addReplayToQueue } = useApp();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<ReplayFilter>({
    server: "kr",
    tier: "challenger",
    minDuration: 25,
    kdaThreshold: 2.0,
    onlyWinners: true,
    recordingMode: 'random-pro',
    continuousRecording: false
  });

  const [isSearching, setIsSearching] = useState(false);

  const [randomSelectionEnabled, setRandomSelectionEnabled] = useState(true);
  const [serverTargeting, setServerTargeting] = useState({
    primary: "kr",
    secondary: ["na", "euw"],
    prioritizeKorean: true
  });

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Call Korean replays edge function for real data
      const { data, error } = await supabase.functions.invoke('korean-replays', {
        body: { 
          filters: {
            tier: filters.tier,
            duration: filters.minDuration,
            kda: filters.kdaThreshold,
            server: filters.server,
            recordingMode: filters.recordingMode,
            specificPlayer: filters.specificPlayer,
            selectedTier: filters.selectedTier,
            specificChampion: filters.specificChampion,
            onlyWinners: filters.onlyWinners
          }
        }
      });

      if (error) {
        console.error('Error fetching Korean replays:', error);
        toast({
          title: "Search Error",
          description: "Failed to fetch Korean server data. Please try again.",
          variant: "destructive"
        });
        setIsSearching(false);
        return;
      }

      const newReplays = data.replays || [];
      
      // Format replays for display
      const formattedReplays: Replay[] = newReplays.map((replay: any) => ({
        id: replay.id,
        player: replay.player,
        champion: replay.champion,
        rank: `${replay.tier} ${replay.rank || ''}`,
        kda: `${replay.kda} (${replay.kdaRatio} KDA)`,
        duration: typeof replay.duration === 'number' ? 
          `${Math.floor(replay.duration / 60)}:${(replay.duration % 60).toString().padStart(2, '0')}` : 
          replay.duration,
        gameMode: replay.gameMode || "Ranked Solo",
        patch: replay.patch || "14.1",
        downloadUrl: replay.downloadUrl || "#",
        teamId: replay.teamId,
        win: replay.win
      }));
      
      setReplays([...replays, ...formattedReplays]);
      setIsSearching(false);
      
      const modeDescription = {
        'random-pro': 'random pro players',
        'specific-pro': `${filters.specificPlayer || 'specific'} player`,
        'single-tier': `${filters.selectedTier || filters.tier} tier`,
        'all-tiers': 'all high-elo tiers',
        'champion-tier': `${filters.specificChampion || 'champion'} in ${filters.selectedTier || filters.tier}`,
        'continuous-auto': 'continuous automation mode'
      };

      toast({
        title: "Korean Server Search Complete",
        description: `Found ${formattedReplays.length} replays using ${modeDescription[filters.recordingMode]} configuration from Korean server.`,
      });

      // Auto-start next search if continuous recording is enabled
      if (filters.continuousRecording && filters.recordingMode === 'continuous-auto') {
        setTimeout(() => {
          handleSearch();
        }, 10000); // Wait 10 seconds before next search
      }
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error", 
        description: "Unable to connect to Korean server. Please check your connection.",
        variant: "destructive"
      });
      setIsSearching(false);
    }
  };

  const handleDownload = (replay: Replay) => {
    // Determine Fog of War setting based on team
    const fogOfWar = replay.teamId === 100 ? 'Blue' : replay.teamId === 200 ? 'Red' : 'Auto';
    
    // Add replay to queue with Korean server priority and Fog of War setting
    const replayWithSettings = {
      ...replay,
      fogOfWar,
      server: 'Korean',
      recordingSettings: {
        fogOfWar,
        teamColor: replay.teamId === 100 ? 'blue' : 'red',
        autoRecord: true
      }
    };
    
    addReplayToQueue(replayWithSettings);
    
    toast({
      title: "Added to Download Queue",
      description: `${replay.player}'s ${replay.champion} replay queued with Fog of War set to ${fogOfWar} team.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="gaming-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Filter className="w-5 h-5 text-gold" />
            Discovery Filters
          </CardTitle>
          <CardDescription>
            Configure replay search criteria with Korean server priority and random selection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Mode Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recording-mode">Recording Mode</Label>
              <Select value={filters.recordingMode} onValueChange={(value: any) => setFilters({...filters, recordingMode: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random-pro">1. Record Random Pro Players</SelectItem>
                  <SelectItem value="specific-pro">2. Record a Specific Pro Player</SelectItem>
                  <SelectItem value="single-tier">3. Record by Selected High-Elo Tier</SelectItem>
                  <SelectItem value="all-tiers">4. Record Randomly Across All High-Elo Tiers</SelectItem>
                  <SelectItem value="champion-tier">5. Record Specific Champion with Tier Filtering</SelectItem>
                  <SelectItem value="continuous-auto">6. Fully Automated Continuous Operation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional inputs based on recording mode */}
            {filters.recordingMode === 'specific-pro' && (
              <div className="space-y-2">
                <Label htmlFor="specific-player">Specific Pro Player</Label>
                <Select value={filters.specificPlayer || ""} onValueChange={(value) => setFilters({...filters, specificPlayer: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pro player" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faker">Faker</SelectItem>
                    <SelectItem value="Canyon">Canyon</SelectItem>
                    <SelectItem value="Chovy">Chovy</SelectItem>
                    <SelectItem value="ShowMaker">ShowMaker</SelectItem>
                    <SelectItem value="Keria">Keria</SelectItem>
                    <SelectItem value="Zeus">Zeus</SelectItem>
                    <SelectItem value="Oner">Oner</SelectItem>
                    <SelectItem value="Gumayusi">Gumayusi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(filters.recordingMode === 'single-tier' || filters.recordingMode === 'champion-tier') && (
              <div className="space-y-2">
                <Label htmlFor="selected-tier">Selected Tier</Label>
                <Select value={filters.selectedTier || ""} onValueChange={(value) => setFilters({...filters, selectedTier: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Grandmaster">Grandmaster</SelectItem>
                    <SelectItem value="Challenger">Challenger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {filters.recordingMode === 'champion-tier' && (
              <div className="space-y-2">
                <Label htmlFor="specific-champion">Specific Champion</Label>
                <Select value={filters.specificChampion || ""} onValueChange={(value) => setFilters({...filters, specificChampion: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a champion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Azir">Azir</SelectItem>
                    <SelectItem value="Yasuo">Yasuo</SelectItem>
                    <SelectItem value="Zed">Zed</SelectItem>
                    <SelectItem value="Orianna">Orianna</SelectItem>
                    <SelectItem value="LeBlanc">LeBlanc</SelectItem>
                    <SelectItem value="Sylas">Sylas</SelectItem>
                    <SelectItem value="Lee Sin">Lee Sin</SelectItem>
                    <SelectItem value="Graves">Graves</SelectItem>
                    <SelectItem value="Jinx">Jinx</SelectItem>
                    <SelectItem value="Kai'Sa">Kai'Sa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server">Server</Label>
              <Select value={filters.server} onValueChange={(value) => setFilters({...filters, server: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kr">Korea (KR)</SelectItem>
                  <SelectItem value="na">North America (NA)</SelectItem>
                  <SelectItem value="euw">Europe West (EUW)</SelectItem>
                  <SelectItem value="eune">Europe Nordic East (EUNE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Minimum Tier</Label>
              <Select value={filters.tier} onValueChange={(value) => setFilters({...filters, tier: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="challenger">Challenger</SelectItem>
                  <SelectItem value="grandmaster">Grandmaster+</SelectItem>
                  <SelectItem value="master">Master+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Min Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={filters.minDuration}
                onChange={(e) => setFilters({...filters, minDuration: parseInt(e.target.value)})}
                min={15}
                max={60}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kda">Min KDA</Label>
              <Input
                id="kda"
                type="number"
                step="0.1"
                value={filters.kdaThreshold}
                onChange={(e) => setFilters({...filters, kdaThreshold: parseFloat(e.target.value)})}
                min={1.0}
                max={10.0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="winners-only"
                checked={filters.onlyWinners}
                onCheckedChange={(checked) => setFilters({...filters, onlyWinners: checked})}
              />
              <Label htmlFor="winners-only">Only winning team players</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="random-selection"
                checked={randomSelectionEnabled}
                onCheckedChange={setRandomSelectionEnabled}
              />
              <Label htmlFor="random-selection">Random replay selection</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="continuous-recording"
                checked={filters.continuousRecording}
                onCheckedChange={(checked) => setFilters({...filters, continuousRecording: checked})}
              />
              <Label htmlFor="continuous-recording">Continuous recording loop</Label>
            </div>
          </div>

          <div className="p-4 gaming-card border border-border/50">
            <h4 className="font-semibold text-card-foreground mb-2">Current Recording Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mode:</span>
                <Badge variant="default" className="ml-2">
                  {filters.recordingMode === 'random-pro' ? 'Random Pro' :
                   filters.recordingMode === 'specific-pro' ? 'Specific Pro' :
                   filters.recordingMode === 'single-tier' ? 'Single Tier' :
                   filters.recordingMode === 'all-tiers' ? 'All Tiers' :
                   filters.recordingMode === 'champion-tier' ? 'Champion+Tier' :
                   'Continuous Auto'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Server:</span>
                <Badge variant="outline" className="ml-2">{filters.server.toUpperCase()}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Champions:</span>
                <Badge variant="outline" className="ml-2">
                  {filters.specificChampion || 'Random'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Automation:</span>
                <Badge variant={filters.continuousRecording ? "default" : "secondary"} className="ml-2">
                  {filters.continuousRecording ? "Continuous" : "Manual"}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            variant="gaming"
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full md:w-auto"
          >
            {isSearching ? (
              <>
                <Search className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Replays
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Discovered Replays */}
      <Card className="gaming-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Eye className="w-5 h-5 text-blue-rift" />
            Discovered Replays ({replays.length})
          </CardTitle>
          <CardDescription>
            High-performance replays ready for processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {replays.map((replay) => (
              <div
                key={replay.id}
                className="gaming-card p-4 border border-border/50 hover:border-gold/50 transition-smooth"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-gaming rounded-lg flex items-center justify-center">
                      <Sword className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">{replay.player}</h4>
                      <p className="text-sm text-muted-foreground">{replay.champion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gold">
                        <Trophy className="w-4 h-4" />
                        <span className="font-medium">{replay.rank}</span>
                      </div>
                      <p className="text-muted-foreground">Rank</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-success">
                        <Star className="w-4 h-4" />
                        <span className="font-medium">{replay.kda}</span>
                      </div>
                      <p className="text-muted-foreground">KDA</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-blue-rift">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{replay.duration}</span>
                      </div>
                      <p className="text-muted-foreground">Duration</p>
                    </div>

                    <div className="text-center">
                      <Badge variant="outline" className="border-teal-nexus text-teal-nexus">
                        {replay.patch}
                      </Badge>
                      <p className="text-muted-foreground mt-1">Patch</p>
                    </div>
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleDownload(replay)}
                  >
                    <Download className="w-4 h-4" />
                    Queue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};