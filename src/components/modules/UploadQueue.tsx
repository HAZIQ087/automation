import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { 
  Upload, 
  Pause, 
  Play, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Youtube,
  FileVideo,
  Eye
} from "lucide-react";

interface UploadJob {
  id: string;
  title: string;
  player: string;
  champion: string;
  status: "pending" | "processing" | "uploading" | "completed" | "failed";
  progress: number;
  duration: string;
  fileSize: string;
  thumbnail: string;
  estimatedTime: string;
  youtubeUrl?: string;
}

export const UploadQueue = () => {
  const { uploadJobs, removeJob, updateJobStatus } = useApp();
  const { toast } = useToast();

  const getStatusColor = (status: UploadJob["status"]) => {
    switch (status) {
      case "completed": return "text-success";
      case "uploading": return "text-blue-rift";
      case "processing": return "text-warning";
      case "failed": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: UploadJob["status"]) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "uploading": return Upload;
      case "processing": return FileVideo;
      case "failed": return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusBadge = (status: UploadJob["status"]) => {
    switch (status) {
      case "completed": return "gradient-success";
      case "uploading": return "gradient-gaming";
      case "processing": return "bg-warning";
      case "failed": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const handlePauseResume = (jobId: string, currentStatus: UploadJob["status"]) => {
    if (currentStatus === "pending") {
      // Start job
      updateJobStatus(jobId, "processing", 0);
      
      // Simulate job progression
      setTimeout(() => updateJobStatus(jobId, "processing", 30), 1000);
      setTimeout(() => updateJobStatus(jobId, "processing", 60), 2000);
      setTimeout(() => updateJobStatus(jobId, "uploading", 75), 3000);
      setTimeout(() => updateJobStatus(jobId, "uploading", 90), 4000);
      setTimeout(() => updateJobStatus(jobId, "completed", 100), 5000);
      
      toast({
        title: "Job Started",
        description: "Video processing has begun.",
      });
    } else {
      // Pause job (for demo, just show message)
      toast({
        title: "Job Paused",
        description: "Video processing has been paused.",
      });
    }
  };

  const handleDelete = (jobId: string) => {
    removeJob(jobId);
    toast({
      title: "Job Removed",
      description: "The job has been removed from the queue.",
    });
  };

  const handleViewVideo = (url: string) => {
    window.open(url, '_blank');
  };

  const completedJobs = uploadJobs.filter(job => job.status === "completed").length;
  const pendingJobs = uploadJobs.filter(job => job.status === "pending").length;
  const processingJobs = uploadJobs.filter(job => job.status === "processing" || job.status === "uploading").length;

  return (
    <div className="space-y-6">
      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gaming-card border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-success">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{completedJobs}</div>
          </CardContent>
        </Card>

        <Card className="gaming-card border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-warning">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{processingJobs}</div>
          </CardContent>
        </Card>

        <Card className="gaming-card border-blue-rift/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-rift">Queued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{pendingJobs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Queue */}
      <Card className="gaming-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Upload className="w-5 h-5 text-gold" />
            Upload Queue ({uploadJobs.length} jobs)
          </CardTitle>
          <CardDescription>
            Monitor video processing and YouTube upload progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadJobs.map((job) => {
              const StatusIcon = getStatusIcon(job.status);
              return (
                <div
                  key={job.id}
                  className="gaming-card p-4 border border-border/50 hover:border-gold/50 transition-smooth"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-11 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-gaming flex items-center justify-center">
                        <FileVideo className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-card-foreground truncate">
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{job.player} • {job.champion}</span>
                            <span>{job.duration}</span>
                            <span>{job.fileSize}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <Badge className={getStatusBadge(job.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Progress */}
                      {(job.status === "processing" || job.status === "uploading") && (
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {job.status === "processing" ? "Processing video..." : "Uploading to YouTube..."}
                            </span>
                            <span className="text-card-foreground font-medium">{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {job.estimatedTime}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {job.status === "completed" && job.youtubeUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewVideo(job.youtubeUrl!)}
                          >
                            <Youtube className="w-4 h-4 mr-1" />
                            View on YouTube
                          </Button>
                        )}

                        {(job.status === "processing" || job.status === "uploading") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePauseResume(job.id, job.status)}
                          >
                            <Pause className="w-4 h-4" />
                            Pause
                          </Button>
                        )}

                        {job.status === "pending" && (
                          <Button
                            variant="gaming"
                            size="sm"
                            onClick={() => handlePauseResume(job.id, job.status)}
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
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