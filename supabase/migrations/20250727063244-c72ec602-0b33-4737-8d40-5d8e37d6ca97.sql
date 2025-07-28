-- Create storage bucket for thumbnail templates
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnail-templates', 'thumbnail-templates', true);

-- Create policies for template uploads
CREATE POLICY "Users can view all thumbnail templates" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'thumbnail-templates');

CREATE POLICY "Users can upload thumbnail templates" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'thumbnail-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own thumbnail templates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'thumbnail-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own thumbnail templates" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'thumbnail-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create thumbnail_templates table
CREATE TABLE public.thumbnail_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'custom', -- 'predefined', 'custom', 'ai-enhanced'
  preview_url TEXT,
  settings JSONB, -- For storing template-specific settings
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.thumbnail_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for thumbnail_templates
CREATE POLICY "Users can view all active thumbnail templates" 
ON public.thumbnail_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can insert their own thumbnail templates" 
ON public.thumbnail_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thumbnail templates" 
ON public.thumbnail_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thumbnail templates" 
ON public.thumbnail_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_thumbnail_templates_updated_at
BEFORE UPDATE ON public.thumbnail_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();