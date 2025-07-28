import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { 
  PlayCircle, 
  StopCircle, 
  Download, 
  Eye, 
  Settings, 
  Zap,
  FileVideo,
  Clock,
  AlertCircle,
  CheckCircle,
  Gamepad2,
  Camera
} from "lucide-react";

interface RecordingJob {
  id: string;
  replay: any;
  status: "downloading" | "preparing" | "recording" | "processing" | "completed" | "failed";
  progress: number;
  currentStep: string;
  duration: string;
  estimatedTime: string;
}

export const ReplayRecording = () => {
  const { addReplayToQueue } = useApp();
  const { toast } = useToast();
  
  const [recordingJobs, setRecordingJobs] = useState<RecordingJob[]>([
    {
      id: "1",
      replay: {
        player: "Faker",
        champion: "Azir",
        kda: "12/2/8"
      },
      status: "recording",
      progress: 45,
      currentStep: "Recording game replay with automation scripts",
      duration: "32:45",
      estimatedTime: "18 min remaining"
    }
  ]);

  const [automationSettings, setAutomationSettings] = useState({
    enableKeySequence: true,
    keySequence: "nouc",
    enableZoomOut: true,
    zoomShortcut: "Ctrl+Shift+Z",
    cameraFraming: true,
    scrollAmount: 3
  });

  const getStatusColor = (status: RecordingJob["status"]) => {
    switch (status) {
      case "completed": return "text-success";
      case "recording": return "text-blue-rift";
      case "downloading": return "text-warning";
      case "failed": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: RecordingJob["status"]) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "recording": return Camera;
      case "downloading": return Download;
      case "failed": return AlertCircle;
      default: return Clock;
    }
  };

  const startRecording = (job: RecordingJob) => {
    setRecordingJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { ...j, status: "downloading", progress: 0, currentStep: "Downloading replay file..." }
        : j
    ));

    // Simulate recording process
    setTimeout(() => {
      setRecordingJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, status: "preparing", progress: 15, currentStep: "Preparing League Client..." }
          : j
      ));
    }, 2000);

    setTimeout(() => {
      setRecordingJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, status: "recording", progress: 25, currentStep: "Executing automation scripts (n, o, u, c)..." }
          : j
      ));
    }, 4000);

    setTimeout(() => {
      setRecordingJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, progress: 40, currentStep: "Applying zoom-out (Ctrl+Shift+Z)..." }
          : j
      ));
    }, 6000);

    setTimeout(() => {
      setRecordingJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, progress: 60, currentStep: "Recording gameplay..." }
          : j
      ));
    }, 8000);

    setTimeout(() => {
      setRecordingJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, status: "processing", progress: 85, currentStep: "Processing video file..." }
          : j
      ));
    }, 25000);

    setTimeout(() => {
      const job = recordingJobs.find(j => j.id === job.id);
      if (job) {
        addReplayToQueue(job.replay);
        setRecordingJobs(prev => prev.map(j => 
          j.id === job.id 
            ? { ...j, status: "completed", progress: 100, currentStep: "Recording completed" }
            : j
        ));
        
        toast({
          title: "Recording Complete",
          description: "Video has been processed and added to upload queue.",
        });
      }
    }, 30000);
  };

  const stopRecording = (jobId: string) => {
    setRecordingJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, status: "failed", currentStep: "Recording stopped by user" }
        : j
    ));
    
    toast({
      title: "Recording Stopped",
      description: "The recording has been stopped.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {/* Automation Settings */}
      <Card className="gaming-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Gamepad2 className="w-5 h-5 text-gold" />
            Recording Automation Settings
          </CardTitle>
          <CardDescription>
            Configure automated scripts executed before replay recording
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 gaming-card border border-border/50">
                <h4 className="font-semibold text-card-foreground mb-2">Key Sequence Automation</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Execute key sequence</span>
                    <Badge variant={automationSettings.enableKeySequence ? "default" : "secondary"}>
                      {automationSettings.enableKeySequence ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Sequence: </span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {automationSettings.keySequence.split('').join(', ')}
                    </code>
                  </div>
                </div>
              </div>

              <div className="p-4 gaming-card border border-border/50">
                <h4 className="font-semibold text-card-foreground mb-2">Camera Controls</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Zoom-out shortcut</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {automationSettings.zoomShortcut}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Camera framing</span>
                    <Badge variant={automationSettings.cameraFraming ? "default" : "secondary"}>
                      {automationSettings.cameraFraming ? "Auto" : "Manual"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 gaming-card border border-border/50">
                <h4 className="font-semibold text-card-foreground mb-2">Execution Flow</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-rift rounded-full"></div>
                    <span className="text-muted-foreground">1. Download replay file via LCU API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-muted-foreground">2. Launch League Client replay viewer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-nexus rounded-full"></div>
                    <span className="text-muted-foreground">3. Execute key sequence: n, o, u, c</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-void rounded-full"></div>
                    <span className="text-muted-foreground">4. Apply zoom-out with Ctrl+Shift+Z</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">5. Start recording with framing</span>
                  </div>
                </div>
              </div>

              <div className="p-4 gaming-card border border-border/50">
                <h4 className="font-semibold text-card-foreground mb-2">Technical Details</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• Uses pydirectinput for key automation</div>
                  <div>• LCU API for replay file management</div>
                  <div>• Screen recording via OBS/FFmpeg</div>
                  <div>• Auto-deletion after processing</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Recordings */}
      <Card className="gaming-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Camera className="w-5 h-5 text-blue-rift" />
            Active Recordings ({recordingJobs.length})
          </CardTitle>
          <CardDescription>
            Monitor replay download, viewing, and recording progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recordingJobs.map((job) => {
              const StatusIcon = getStatusIcon(job.status);
              return (
                <div
                  key={job.id}
                  className="gaming-card p-4 border border-border/50 hover:border-gold/50 transition-smooth"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-gaming rounded-lg flex items-center justify-center flex-shrink-0">
                      <StatusIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-card-foreground">
                            {job.replay.player} - {job.replay.champion}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {job.replay.kda} • {job.duration}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(job.status)} border`} variant="outline">
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{job.currentStep}</span>
                          <span className="text-card-foreground font-medium">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {job.estimatedTime}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {job.status === "recording" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => stopRecording(job.id)}
                          >
                            <StopCircle className="w-4 h-4" />
                            Stop Recording
                          </Button>
                        )}

                        {(job.status === "failed" || job.status === "completed") && (
                          <Button
                            variant="gaming"
                            size="sm"
                            onClick={() => startRecording(job)}
                          >
                            <PlayCircle className="w-4 h-4" />
                            Start Recording
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};