import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  Download, 
  Upload, 
  Eye,
  Trophy,
  Clock,
  Zap,
  PlayCircle,
  StopCircle,
  CheckCircle,
  AlertCircle,
  LogOut,
  User
} from "lucide-react";
import { ReplayDiscovery } from "./modules/ReplayDiscovery";
import { ReplayRecording } from "./modules/ReplayRecording";
import { ThumbnailGeneration } from "./modules/ThumbnailGeneration";
import { YoutubeUpload } from "./modules/YoutubeUpload";
import { UploadQueue } from "./modules/UploadQueue";
import { SystemSettings } from "./modules/SystemSettings";
import { Analytics } from "./modules/Analytics";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/hooks/useAuth";

export const Dashboard = () => {
  const { systemStatus, uploadJobs, toggleSystem } = useApp();
  const { user, signOut } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSignOut = async () => {
    await signOut();
  };

  // Calculate current upload progress from active jobs
  useEffect(() => {
    const activeJobs = uploadJobs.filter(job => 
      job.status === "processing" || job.status === "uploading"
    );
    
    if (activeJobs.length > 0) {
      const avgProgress = activeJobs.reduce((sum, job) => sum + job.progress, 0) / activeJobs.length;
      setUploadProgress(avgProgress);
    } else {
      setUploadProgress(0);
    }
  }, [uploadJobs]);

  const statusCards = [
    {
      title: "System Status",
      value: systemStatus.isRunning ? "Running" : "Stopped",
      icon: systemStatus.isRunning ? PlayCircle : StopCircle,
      color: systemStatus.isRunning ? "text-success" : "text-muted-foreground",
      gradient: systemStatus.isRunning ? "gradient-success" : "gradient-card"
    },
    {
      title: "Replays Found",
      value: systemStatus.replaysFound.toString(),
      icon: Eye,
      color: "text-blue-rift",
      gradient: "gradient-gaming"
    },
    {
      title: "Videos Uploaded",
      value: systemStatus.videosUploaded.toString(),
      icon: Upload,
      color: "text-gold",
      gradient: "gradient-primary"
    },
    {
      title: "Uptime",
      value: systemStatus.uptime,
      icon: Clock,
      color: "text-teal-nexus",
      gradient: "gradient-card"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2">
              Challenger Replays Automation
            </h1>
            <p className="text-muted-foreground text-lg">
              Automated League of Legends replay processing and YouTube uploads
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`status-indicator ${systemStatus.isRunning ? 'status-online' : 'status-offline'}`} />
              <span className="text-sm font-medium">
                {systemStatus.isRunning ? 'System Active' : 'System Idle'}
              </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card border border-border">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.email}</span>
                <span className="text-xs text-muted-foreground">Challenger Player</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant={systemStatus.isRunning ? "destructive" : "gaming"}
              size="lg"
              onClick={toggleSystem}
              className="min-w-[120px]"
            >
              {systemStatus.isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop System
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start System
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusCards.map((card, index) => (
            <Card key={index} className={`gaming-card ${card.gradient} border-gold/20 shadow-[0_2px_8px_hsl(210_25%_5%/0.3)] hover:shadow-[0_4px_12px_hsl(207_85%_45%/0.15)]`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground/80">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Activity */}
        <Card className="gaming-card border-gold/20 shadow-[0_2px_8px_hsl(210_25%_5%/0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Activity className="w-5 h-5 text-gold" />
              Current Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-medium text-card-foreground">
                  {systemStatus.currentTask}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last activity: {systemStatus.lastActivity}
                </p>
              </div>
              <Badge 
                variant={systemStatus.isRunning ? "default" : "secondary"}
                className={systemStatus.isRunning ? "gradient-success" : ""}
              >
                {systemStatus.isRunning ? "Processing" : "Idle"}
              </Badge>
            </div>
            {systemStatus.isRunning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Upload Progress</span>
                  <span className="text-card-foreground font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:gradient-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="discovery" className="data-[state=active]:gradient-gaming">
              Discovery
            </TabsTrigger>
            <TabsTrigger value="recording" className="data-[state=active]:gradient-success">
              Recording
            </TabsTrigger>
            <TabsTrigger value="thumbnails" className="data-[state=active]:gradient-card">
              Thumbnails
            </TabsTrigger>
            <TabsTrigger value="uploads" className="data-[state=active]:gradient-primary">
              YouTube
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:gradient-card">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Analytics />
          </TabsContent>

          <TabsContent value="discovery">
            <ReplayDiscovery />
          </TabsContent>

          <TabsContent value="recording">
            <ReplayRecording />
          </TabsContent>

          <TabsContent value="thumbnails">
            <ThumbnailGeneration />
          </TabsContent>

          <TabsContent value="uploads">
            <YoutubeUpload />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};