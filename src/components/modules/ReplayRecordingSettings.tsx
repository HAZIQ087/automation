import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, Settings, Monitor } from "lucide-react";

interface RecordingSettings {
  fogOfWar: 'Blue' | 'Red' | 'Auto' | 'Off';
  autoDetectTeam: boolean;
  recordingQuality: 'High' | 'Medium' | 'Low';
  enableUI: boolean;
  showTimestamp: boolean;
}

interface ReplayRecordingSettingsProps {
  replay?: {
    teamId?: number;
    player: string;
    champion: string;
  };
  onSettingsChange?: (settings: RecordingSettings) => void;
}

export const ReplayRecordingSettings = ({ replay, onSettingsChange }: ReplayRecordingSettingsProps) => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<RecordingSettings>({
    fogOfWar: replay?.teamId === 100 ? 'Blue' : replay?.teamId === 200 ? 'Red' : 'Auto',
    autoDetectTeam: true,
    recordingQuality: 'High',
    enableUI: true,
    showTimestamp: true
  });

  const handleSettingChange = (key: keyof RecordingSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const getTeamColor = () => {
    if (replay?.teamId === 100) return 'Blue';
    if (replay?.teamId === 200) return 'Red';
    return 'Unknown';
  };

  const startRecording = () => {
    toast({
      title: "Recording Started",
      description: `Recording ${replay?.player}'s ${replay?.champion} with Fog of War set to ${settings.fogOfWar}.`,
    });
  };

  return (
    <Card className="gaming-card border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Monitor className="w-5 h-5 text-blue-rift" />
          Replay Recording Settings
        </CardTitle>
        <CardDescription>
          Configure recording options and Fog of War settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Detection */}
        {replay && (
          <div className="gaming-card p-4 border border-border/50">
            <h4 className="font-semibold text-card-foreground mb-2">Detected Team Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-muted-foreground">Player:</span>
                <Badge variant="outline" className="ml-2">{replay.player}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Champion:</span>
                <Badge variant="outline" className="ml-2">{replay.champion}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Team Color:</span>
                <Badge 
                  variant={getTeamColor() === 'Blue' ? "default" : "destructive"} 
                  className="ml-2"
                >
                  {getTeamColor()} Team
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Fog of War Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fog-of-war" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Fog of War Setting
            </Label>
            <Select 
              value={settings.fogOfWar} 
              onValueChange={(value: any) => handleSettingChange('fogOfWar', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Blue">Blue Team Perspective</SelectItem>
                <SelectItem value="Red">Red Team Perspective</SelectItem>
                <SelectItem value="Auto">Auto-detect from Player</SelectItem>
                <SelectItem value="Off">No Fog of War</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Set to {replay?.teamId === 100 ? 'Blue' : replay?.teamId === 200 ? 'Red' : 'Auto'} based on {replay?.player}'s team
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-detect"
              checked={settings.autoDetectTeam}
              onCheckedChange={(checked) => handleSettingChange('autoDetectTeam', checked)}
            />
            <Label htmlFor="auto-detect">Auto-detect team from replay data</Label>
          </div>
        </div>

        {/* Recording Quality */}
        <div className="space-y-2">
          <Label htmlFor="quality">Recording Quality</Label>
          <Select 
            value={settings.recordingQuality} 
            onValueChange={(value: any) => handleSettingChange('recordingQuality', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High (1080p)</SelectItem>
              <SelectItem value="Medium">Medium (720p)</SelectItem>
              <SelectItem value="Low">Low (480p)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* UI Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-ui"
              checked={settings.enableUI}
              onCheckedChange={(checked) => handleSettingChange('enableUI', checked)}
            />
            <Label htmlFor="enable-ui">Include game UI in recording</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-timestamp"
              checked={settings.showTimestamp}
              onCheckedChange={(checked) => handleSettingChange('showTimestamp', checked)}
            />
            <Label htmlFor="show-timestamp">Show timestamp overlay</Label>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="gaming-card p-4 border border-border/50">
          <h4 className="font-semibold text-card-foreground mb-2">Current Recording Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Fog of War:</span>
              <Badge 
                variant={settings.fogOfWar === 'Blue' ? "default" : settings.fogOfWar === 'Red' ? "destructive" : "outline"} 
                className="ml-2"
              >
                {settings.fogOfWar}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Quality:</span>
              <Badge variant="outline" className="ml-2">{settings.recordingQuality}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">UI Enabled:</span>
              <Badge variant={settings.enableUI ? "default" : "secondary"} className="ml-2">
                {settings.enableUI ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Auto-detect:</span>
              <Badge variant={settings.autoDetectTeam ? "default" : "secondary"} className="ml-2">
                {settings.autoDetectTeam ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          variant="gaming"
          onClick={startRecording}
          className="w-full"
        >
          <Monitor className="w-4 h-4" />
          Start Recording with Current Settings
        </Button>
      </CardContent>
    </Card>
  );
};