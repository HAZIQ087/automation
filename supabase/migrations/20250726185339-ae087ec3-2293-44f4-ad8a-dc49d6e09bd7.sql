-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  league_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_configs table for storing user settings
CREATE TABLE public.system_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lcu_enabled BOOLEAN DEFAULT false,
  league_api_key TEXT,
  youtube_api_key TEXT,
  youtube_channel_id TEXT,
  auto_discovery BOOLEAN DEFAULT false,
  auto_recording BOOLEAN DEFAULT false,
  auto_thumbnails BOOLEAN DEFAULT false,
  auto_upload BOOLEAN DEFAULT false,
  video_quality TEXT DEFAULT 'high',
  video_format TEXT DEFAULT 'mp4',
  thumbnail_style TEXT DEFAULT 'modern',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create replays table for storing replay data
CREATE TABLE public.replays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  champion TEXT NOT NULL,
  rank_tier TEXT,
  kda TEXT,
  duration INTEGER, -- in seconds
  game_mode TEXT,
  patch_version TEXT,
  download_url TEXT,
  file_size BIGINT, -- in bytes
  status TEXT DEFAULT 'discovered' CHECK (status IN ('discovered', 'downloaded', 'processed', 'uploaded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create upload_jobs table for tracking video uploads
CREATE TABLE public.upload_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  replay_id UUID REFERENCES public.replays(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  player_name TEXT NOT NULL,
  champion TEXT NOT NULL,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'uploading', 'completed', 'failed', 'paused')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  thumbnail_url TEXT,
  youtube_url TEXT,
  estimated_time INTEGER, -- in minutes
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_status table for tracking system state
CREATE TABLE public.system_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_running BOOLEAN DEFAULT false,
  current_task TEXT,
  replays_found INTEGER DEFAULT 0,
  videos_uploaded INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  uptime INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create analytics table for storing analytics data
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  replays_discovered INTEGER DEFAULT 0,
  videos_uploaded INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_watch_time INTEGER DEFAULT 0, -- in minutes
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for system_configs
CREATE POLICY "Users can view their own config" ON public.system_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own config" ON public.system_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own config" ON public.system_configs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for replays
CREATE POLICY "Users can view their own replays" ON public.replays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own replays" ON public.replays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replays" ON public.replays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replays" ON public.replays FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for upload_jobs
CREATE POLICY "Users can view their own upload jobs" ON public.upload_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own upload jobs" ON public.upload_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own upload jobs" ON public.upload_jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own upload jobs" ON public.upload_jobs FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for system_status
CREATE POLICY "Users can view their own system status" ON public.system_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own system status" ON public.system_status FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own system status" ON public.system_status FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for analytics
CREATE POLICY "Users can view their own analytics" ON public.analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analytics" ON public.analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analytics" ON public.analytics FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_configs_updated_at BEFORE UPDATE ON public.system_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_replays_updated_at BEFORE UPDATE ON public.replays FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_upload_jobs_updated_at BEFORE UPDATE ON public.upload_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_status_updated_at BEFORE UPDATE ON public.system_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON public.analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  
  INSERT INTO public.system_configs (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.system_status (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();