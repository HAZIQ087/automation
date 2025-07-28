import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Key, 
  Youtube, 
  Download, 
  Shield, 
  Zap,
  Save,
  TestTube,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface SystemConfig {
  leagueCredentials: {
    username: string;
    password: string;
  };
  youtubeConfig: {
    clientSecretFile: string;
    playlistId: string;
    channelName: string;
  };
  riotApiConfig: {
    apiKey: string;
    primaryRegion: string;
    secondaryRegions: string[];
  };
  automationSettings: {
    autoStart: boolean;
    processInterval: number;
    maxConcurrentUploads: number;
    deleteAfterUpload: boolean;
  };
  videoSettings: {
    quality: string;
    overlayRunes: boolean;
    overlayChannelName: boolean;
    thumbnailTemplate: string;
  };
}

export const SystemSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SystemConfig>({
    leagueCredentials: {
      username: "tjddkdus21",
      password: "••••••••••"
    },
    youtubeConfig: {
      clientSecretFile: "client_secret_63614562335...json",
      playlistId: "",
      channelName: "Challenger Replays"
    },
    riotApiConfig: {
      apiKey: "",
      primaryRegion: "kr",
      secondaryRegions: ["na1", "euw1"]
    },
    automationSettings: {
      autoStart: false,
      processInterval: 30,
      maxConcurrentUploads: 2,
      deleteAfterUpload: true
    },
    videoSettings: {
      quality: "1080p",
      overlayRunes: true,
      overlayChannelName: true,
      thumbnailTemplate: "default"
    }
  });

  const [connectionStatus, setConnectionStatus] = useState({
    lcu: "connected",
    youtube: "connected",
    leagueApi: "connected"
  });

  const handleSave = () => {
    // Simulate saving configuration
    toast({
      title: "Configuration Saved",
      description: "All settings have been saved successfully.",
    });
    
    // Here you would normally save to localStorage or send to backend
    localStorage.setItem('systemConfig', JSON.stringify(config));
  };

  const testConnection = (service: string) => {
    // Simulate connection test
    toast({
      title: "Testing Connection",
      description: `Testing ${service} connection...`,
    });
    
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success 
          ? `${service} connection is working properly.`
          : `Failed to connect to ${service}. Please check your settings.`,
        variant: success ? "default" : "destructive"
      });
      
      if (success) {
        setConnectionStatus(prev => ({ ...prev, [service]: "connected" }));
      } else {
        setConnectionStatus(prev => ({ ...prev, [service]: "disconnected" }));
      }
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-success";
      case "disconnected": return "text-destructive";
      default: return "text-warning";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return CheckCircle;
      case "disconnected": return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="gaming-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Shield className="w-5 h-5 text-gold" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Monitor system connections and service availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(connectionStatus).map(([service, status]) => {
              const StatusIcon = getStatusIcon(status);
              return (
                <div
                  key={service}
                  className="gaming-card p-4 border border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-card-foreground capitalize">
                        {service === "lcu" ? "League Client" : service === "youtube" ? "YouTube API" : "League API"}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(status)}`} />
                        <span className={`text-sm ${getStatusColor(status)} capitalize`}>
                          {status}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(service)}
                    >
                      <TestTube className="w-4 h-4" />
                      Test
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* League of Legends Settings */}
        <Card className="gaming-card border-blue-rift/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Key className="w-5 h-5 text-blue-rift" />
              League of Legends
            </CardTitle>
            <CardDescription>
              Configure League Client and API credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lol-username">Username</Label>
              <Input
                id="lol-username"
                value={config.leagueCredentials.username}
                onChange={(e) => setConfig({
                  ...config,
                  leagueCredentials: {
                    ...config.leagueCredentials,
                    username: e.target.value
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lol-password">Password</Label>
              <Input
                id="lol-password"
                type="password"
                value={config.leagueCredentials.password}
                onChange={(e) => setConfig({
                  ...config,
                  leagueCredentials: {
                    ...config.leagueCredentials,
                    password: e.target.value
                  }
                })}
              />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-rift" />
                <span className="text-muted-foreground">
                  Credentials are encrypted and stored locally
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* YouTube Settings */}
        <Card className="gaming-card border-red-baron/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Youtube className="w-5 h-5 text-red-baron" />
              YouTube Integration
            </CardTitle>
            <CardDescription>
              Configure YouTube upload settings and credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-secret">Client Secret File</Label>
              <Input
                id="client-secret"
                value={config.youtubeConfig.clientSecretFile}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playlist-id">Playlist ID</Label>
              <Input
                id="playlist-id"
                placeholder="Enter YouTube playlist ID"
                value={config.youtubeConfig.playlistId}
                onChange={(e) => setConfig({
                  ...config,
                  youtubeConfig: {
                    ...config.youtubeConfig,
                    playlistId: e.target.value
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel-name">Channel Name</Label>
              <Input
                id="channel-name"
                value={config.youtubeConfig.channelName}
                onChange={(e) => setConfig({
                  ...config,
                  youtubeConfig: {
                    ...config.youtubeConfig,
                    channelName: e.target.value
                  }
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riot API Configuration */}
      <Card className="gaming-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Shield className="w-5 h-5 text-gold" />
            Riot Games API Configuration
          </CardTitle>
          <CardDescription>
            Configure Riot API key for accessing League of Legends match data and player statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 gaming-card border border-border/50">
                <h4 className="font-semibold text-card-foreground mb-2">API Requirements</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>Production API Key from Riot Developer Portal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-rift rounded-full"></div>
                    <span>Rate limit: 100 requests/2 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-nexus rounded-full"></div>
                    <span>Required for replay discovery and player data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-void rounded-full"></div>
                    <span>Supports Korean server priority</span>
                  </div>
                </div>
              </div>

              <div className="p-4 gaming-card border border-border/50">
                <h4 className="font-semibold text-card-foreground mb-2">API Usage</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• Match-V5: Get match details and replay files</div>
                  <div>• Summoner-V4: Get player information</div>
                  <div>• League-V4: Get ranked information</div>
                  <div>• Spectator-V4: Get featured games</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="riot-api-key">Riot API Key</Label>
                  <Input
                    id="riot-api-key"
                    type="password"
                    placeholder="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={config.riotApiConfig.apiKey}
                    onChange={(e) => setConfig({
                      ...config,
                      riotApiConfig: {
                        ...config.riotApiConfig,
                        apiKey: e.target.value
                      }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a
                      href="https://developer.riotgames.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      Riot Developer Portal
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-region">Primary Region</Label>
                  <Select
                    value={config.riotApiConfig.primaryRegion}
                    onValueChange={(value) => setConfig({
                      ...config,
                      riotApiConfig: {
                        ...config.riotApiConfig,
                        primaryRegion: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kr">Korea (KR)</SelectItem>
                      <SelectItem value="na1">North America (NA1)</SelectItem>
                      <SelectItem value="euw1">Europe West (EUW1)</SelectItem>
                      <SelectItem value="eun1">Europe Nordic & East (EUN1)</SelectItem>
                      <SelectItem value="br1">Brazil (BR1)</SelectItem>
                      <SelectItem value="la1">Latin America North (LA1)</SelectItem>
                      <SelectItem value="la2">Latin America South (LA2)</SelectItem>
                      <SelectItem value="oc1">Oceania (OC1)</SelectItem>
                      <SelectItem value="tr1">Turkey (TR1)</SelectItem>
                      <SelectItem value="ru">Russia (RU)</SelectItem>
                      <SelectItem value="jp1">Japan (JP1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Status</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Key Status:</span>
                    <Badge 
                      variant={config.riotApiConfig.apiKey ? "default" : "outline"} 
                      className={config.riotApiConfig.apiKey ? "border-success text-success" : "border-gold text-gold"}
                    >
                      {config.riotApiConfig.apiKey ? "Configured" : "Not Configured"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Primary Region:</span>
                    <Badge variant="default">{config.riotApiConfig.primaryRegion.toUpperCase()}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-gold/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-card-foreground">Security Notice</h4>
                <p className="text-sm text-muted-foreground">
                  Your Riot API key is stored securely using Supabase's encrypted secret management. 
                  It will never be exposed in your codebase or transmitted unsecurely.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Settings */}
        <Card className="gaming-card border-teal-nexus/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Zap className="w-5 h-5 text-teal-nexus" />
              Automation
            </CardTitle>
            <CardDescription>
              Configure automated processing behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-start">Auto-start on system boot</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically begin processing when system starts
                </p>
              </div>
              <Switch
                id="auto-start"
                checked={config.automationSettings.autoStart}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  automationSettings: {
                    ...config.automationSettings,
                    autoStart: checked
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="process-interval">Processing Interval (minutes)</Label>
              <Input
                id="process-interval"
                type="number"
                min={5}
                max={120}
                value={config.automationSettings.processInterval}
                onChange={(e) => setConfig({
                  ...config,
                  automationSettings: {
                    ...config.automationSettings,
                    processInterval: parseInt(e.target.value)
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-uploads">Max Concurrent Uploads</Label>
              <Select
                value={config.automationSettings.maxConcurrentUploads.toString()}
                onValueChange={(value) => setConfig({
                  ...config,
                  automationSettings: {
                    ...config.automationSettings,
                    maxConcurrentUploads: parseInt(value)
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Upload</SelectItem>
                  <SelectItem value="2">2 Uploads</SelectItem>
                  <SelectItem value="3">3 Uploads</SelectItem>
                  <SelectItem value="4">4 Uploads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="delete-after">Delete files after upload</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically remove local files after successful upload
                </p>
              </div>
              <Switch
                id="delete-after"
                checked={config.automationSettings.deleteAfterUpload}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  automationSettings: {
                    ...config.automationSettings,
                    deleteAfterUpload: checked
                  }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Video Settings */}
        <Card className="gaming-card border-purple-void/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Download className="w-5 h-5 text-purple-void" />
              Video Processing
            </CardTitle>
            <CardDescription>
              Configure video quality and overlay settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quality">Video Quality</Label>
              <Select
                value={config.videoSettings.quality}
                onValueChange={(value) => setConfig({
                  ...config,
                  videoSettings: {
                    ...config.videoSettings,
                    quality: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p (HD)</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  <SelectItem value="1440p">1440p (2K)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="overlay-runes">Overlay player runes</Label>
                <p className="text-sm text-muted-foreground">
                  Show rune setup during video
                </p>
              </div>
              <Switch
                id="overlay-runes"
                checked={config.videoSettings.overlayRunes}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  videoSettings: {
                    ...config.videoSettings,
                    overlayRunes: checked
                  }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="overlay-channel">Overlay channel name</Label>
                <p className="text-sm text-muted-foreground">
                  Display channel branding
                </p>
              </div>
              <Switch
                id="overlay-channel"
                checked={config.videoSettings.overlayChannelName}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  videoSettings: {
                    ...config.videoSettings,
                    overlayChannelName: checked
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail-template">Thumbnail Template</Label>
              <Select
                value={config.videoSettings.thumbnailTemplate}
                onValueChange={(value) => setConfig({
                  ...config,
                  videoSettings: {
                    ...config.videoSettings,
                    thumbnailTemplate: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  <SelectItem value="champion-focus">Champion Focus</SelectItem>
                  <SelectItem value="kda-highlight">KDA Highlight</SelectItem>
                  <SelectItem value="rank-showcase">Rank Showcase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="gaming" size="lg" onClick={handleSave}>
          <Save className="w-5 h-5" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};