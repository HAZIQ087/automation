import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
}

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
  replayData?: Replay;
}

interface SystemStatus {
  isRunning: boolean;
  currentTask: string;
  replaysFound: number;
  videosUploaded: number;
  lastActivity: string;
  uptime: string;
}

interface AppContextType {
  systemStatus: SystemStatus;
  setSystemStatus: (status: SystemStatus) => void;
  uploadJobs: UploadJob[];
  setUploadJobs: (jobs: UploadJob[]) => void;
  replays: Replay[];
  setReplays: (replays: Replay[]) => void;
  addReplayToQueue: (replay: Replay) => void;
  removeJob: (jobId: string) => void;
  updateJobStatus: (jobId: string, status: UploadJob["status"], progress?: number) => void;
  toggleSystem: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    isRunning: false,
    currentTask: "Idle",
    replaysFound: 0,
    videosUploaded: 0,
    lastActivity: "Never",
    uptime: "0h 0m"
  });

  const [uploadJobs, setUploadJobs] = useState<UploadJob[]>([]);
  const [replays, setReplays] = useState<Replay[]>([]);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (!user) {
      // Reset data when user logs out
      setSystemStatus({
        isRunning: false,
        currentTask: "Idle",
        replaysFound: 0,
        videosUploaded: 0,
        lastActivity: "Never",
        uptime: "0h 0m"
      });
      setUploadJobs([]);
      setReplays([]);
      return;
    }

    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load system status
      const { data: statusData } = await supabase
        .from('system_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statusData) {
        setSystemStatus({
          isRunning: statusData.is_running,
          currentTask: statusData.current_task || "Idle",
          replaysFound: statusData.replays_found || 0,
          videosUploaded: statusData.videos_uploaded || 0,
          lastActivity: statusData.last_activity ? new Date(statusData.last_activity).toLocaleString() : "Never",
          uptime: `${Math.floor((statusData.uptime || 0) / 60)}h ${(statusData.uptime || 0) % 60}m`
        });
      }

      // Load replays
      const { data: replaysData } = await supabase
        .from('replays')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (replaysData) {
        const formattedReplays = replaysData.map(replay => ({
          id: replay.id,
          player: replay.player_name,
          champion: replay.champion,
          rank: replay.rank_tier || "Unranked",
          kda: replay.kda || "0/0/0",
          duration: formatDuration(replay.duration || 0),
          gameMode: replay.game_mode || "Unknown",
          patch: replay.patch_version || "Unknown",
          downloadUrl: replay.download_url || "#"
        }));
        setReplays(formattedReplays);
      }

      // Load upload jobs
      const { data: jobsData } = await supabase
        .from('upload_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsData) {
        const formattedJobs = jobsData.map(job => ({
          id: job.id,
          title: job.title,
          player: job.player_name,
          champion: job.champion,
          status: job.status as UploadJob["status"],
          progress: job.progress || 0,
          duration: formatDuration(job.duration || 0),
          fileSize: formatFileSize(job.file_size || 0),
          thumbnail: job.thumbnail_url || "/api/placeholder/120/68",
          estimatedTime: job.estimated_time ? `${job.estimated_time} min remaining` : "Unknown",
          youtubeUrl: job.youtube_url
        }));
        setUploadJobs(formattedJobs);
      }
    } catch (error: any) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const addReplayToQueue = (replay: Replay) => {
    const newJob: UploadJob = {
      id: Date.now().toString(),
      title: `${replay.player.toUpperCase()} ${replay.champion.toUpperCase()} ${replay.kda} CHALLENGER GAMEPLAY`,
      player: replay.player,
      champion: replay.champion,
      status: "pending",
      progress: 0,
      duration: replay.duration,
      fileSize: "2.0 GB", // Default file size
      thumbnail: "/api/placeholder/120/68",
      estimatedTime: "Queued",
      replayData: replay
    };

    setUploadJobs(prev => [...prev, newJob]);
    
    // Update system status
    setSystemStatus(prev => ({
      ...prev,
      lastActivity: "Just now",
      replaysFound: prev.replaysFound + 1
    }));
  };

  const removeJob = (jobId: string) => {
    setUploadJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const updateJobStatus = (jobId: string, status: UploadJob["status"], progress?: number) => {
    setUploadJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status, 
            progress: progress !== undefined ? progress : job.progress,
            estimatedTime: status === "completed" ? "Completed" : job.estimatedTime,
            youtubeUrl: status === "completed" ? "https://youtube.com/watch?v=example" : job.youtubeUrl
          }
        : job
    ));

    // Update system status when job completes
    if (status === "completed") {
      setSystemStatus(prev => ({
        ...prev,
        videosUploaded: prev.videosUploaded + 1,
        lastActivity: "Just now"
      }));
    }
  };

  const toggleSystem = () => {
    setSystemStatus(prev => {
      const newRunning = !prev.isRunning;
      return {
        ...prev,
        isRunning: newRunning,
        currentTask: newRunning ? "Searching for replays..." : "Idle",
        lastActivity: "Just now"
      };
    });

    // Start processing jobs when system starts
    if (!systemStatus.isRunning) {
      const pendingJobs = uploadJobs.filter(job => job.status === "pending");
      if (pendingJobs.length > 0) {
        // Start the first pending job
        updateJobStatus(pendingJobs[0].id, "processing", 0);
        
        // Simulate job progression
        setTimeout(() => {
          updateJobStatus(pendingJobs[0].id, "processing", 50);
        }, 2000);
        
        setTimeout(() => {
          updateJobStatus(pendingJobs[0].id, "uploading", 75);
        }, 4000);
        
        setTimeout(() => {
          updateJobStatus(pendingJobs[0].id, "completed", 100);
        }, 6000);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      systemStatus,
      setSystemStatus,
      uploadJobs,
      setUploadJobs,
      replays,
      setReplays,
      addReplayToQueue,
      removeJob,
      updateJobStatus,
      toggleSystem
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}