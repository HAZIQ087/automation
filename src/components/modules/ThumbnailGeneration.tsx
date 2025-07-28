import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TemplateManager } from "./TemplateManager";
import { 
  Image, 
  Palette, 
  Wand2, 
  Download, 
  RefreshCw,
  Eye,
  Settings,
  Sparkles,
  FileImage,
  Zap,
  Upload
} from "lucide-react";

interface ThumbnailTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: string;
}

interface GeneratedThumbnail {
  id: string;
  replayId: string;
  player: string;
  champion: string;
  template: string;
  status: "generating" | "completed" | "failed";
  imageUrl: string;
  generatedAt: string;
}

export const ThumbnailGeneration = () => {
  const { toast } = useToast();
  
  const [templates] = useState<ThumbnailTemplate[]>([
    {
      id: "default",
      name: "Default Gaming",
      description: "Classic gaming thumbnail with champion focus",
      preview: "/api/placeholder/200/113",
      style: "championship"
    },
    {
      id: "champion-focus",
      name: "Champion Focus",
      description: "Large champion portrait with KDA highlight",
      preview: "/api/placeholder/200/113",
      style: "portrait"
    },
    {
      id: "kda-highlight",
      name: "KDA Highlight",
      description: "Emphasizes performance metrics and stats",
      preview: "/api/placeholder/200/113",
      style: "stats"
    },
    {
      id: "rank-showcase",
      name: "Rank Showcase",
      description: "Features player rank and tier prominently",
      preview: "/api/placeholder/200/113",
      style: "rank"
    },
    {
      id: "ai-enhanced",
      name: "AI Enhanced",
      description: "AI-generated unique thumbnails with dynamic elements",
      preview: "/api/placeholder/200/113",
      style: "ai"
    }
  ]);

  const [thumbnails, setThumbnails] = useState<GeneratedThumbnail[]>([
    {
      id: "1",
      replayId: "replay_1",
      player: "Faker",
      champion: "Azir",
      template: "champion-focus",
      status: "completed",
      imageUrl: "/api/placeholder/200/113",
      generatedAt: "2 minutes ago"
    },
    {
      id: "2",
      replayId: "replay_2",
      player: "Canyon",
      champion: "Graves",
      template: "kda-highlight",
      status: "generating",
      imageUrl: "/api/placeholder/200/113",
      generatedAt: "Generating..."
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    creativity: "balanced",
    uniqueness: "medium",
    colorScheme: "auto"
  });

  const generateThumbnail = (replayData: any) => {
    const newThumbnail: GeneratedThumbnail = {
      id: Date.now().toString(),
      replayId: replayData.id || "new_replay",
      player: replayData.player || "Player",
      champion: replayData.champion || "Champion",
      template: selectedTemplate,
      status: "generating",
      imageUrl: "/api/placeholder/200/113",
      generatedAt: "Generating..."
    };

    setThumbnails(prev => [newThumbnail, ...prev]);

    // Simulate thumbnail generation
    setTimeout(() => {
      setThumbnails(prev => prev.map(thumb =>
        thumb.id === newThumbnail.id
          ? { ...thumb, status: "completed", generatedAt: "Just now" }
          : thumb
      ));

      toast({
        title: "Thumbnail Generated",
        description: `Created thumbnail for ${replayData.player}'s ${replayData.champion} replay.`,
      });
    }, 3000);
  };

  const regenerateThumbnail = (thumbnailId: string) => {
    setThumbnails(prev => prev.map(thumb =>
      thumb.id === thumbnailId
        ? { ...thumb, status: "generating", generatedAt: "Regenerating..." }
        : thumb
    ));

    setTimeout(() => {
      setThumbnails(prev => prev.map(thumb =>
        thumb.id === thumbnailId
          ? { ...thumb, status: "completed", generatedAt: "Just now" }
          : thumb
      ));

      toast({
        title: "Thumbnail Regenerated",
        description: "New thumbnail has been generated with different variations.",
      });
    }, 2000);
  };

  const getStatusColor = (status: GeneratedThumbnail["status"]) => {
    switch (status) {
      case "completed": return "text-success";
      case "generating": return "text-warning";
      case "failed": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Use Templates</TabsTrigger>
          <TabsTrigger value="manage">Manage Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-6">
          {/* Template Selection */}
          <Card className="gaming-card border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Palette className="w-5 h-5 text-gold" />
                Thumbnail Templates
              </CardTitle>
              <CardDescription>
                Choose from preset templates or enable AI-enhanced generation
              </CardDescription>
            </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`gaming-card p-4 border cursor-pointer transition-smooth ${
                  selectedTemplate === template.id
                    ? "border-gold bg-gold/5"
                    : "border-border/50 hover:border-gold/50"
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-gaming flex items-center justify-center">
                    <FileImage className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                <Badge variant={template.id === "ai-enhanced" ? "default" : "outline"}>
                  {template.style}
                  {template.id === "ai-enhanced" && <Sparkles className="w-3 h-3 ml-1" />}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="gaming"
              onClick={() => generateThumbnail({ player: "Sample", champion: "Yasuo", id: "sample" })}
              className="flex-1"
            >
              <Wand2 className="w-4 h-4" />
              Generate Sample Thumbnail
            </Button>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Enhancement Settings */}
      {selectedTemplate === "ai-enhanced" && (
        <Card className="gaming-card border-purple-void/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Sparkles className="w-5 h-5 text-purple-void" />
              AI Enhancement Settings
            </CardTitle>
            <CardDescription>
              Configure AI-powered thumbnail generation parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-card-foreground">Creativity Level</label>
                <Select value={aiSettings.creativity} onValueChange={(value) => 
                  setAiSettings(prev => ({ ...prev, creativity: value }))
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="experimental">Experimental</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground">Uniqueness</label>
                <Select value={aiSettings.uniqueness} onValueChange={(value) => 
                  setAiSettings(prev => ({ ...prev, uniqueness: value }))
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="maximum">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground">Color Scheme</label>
                <Select value={aiSettings.colorScheme} onValueChange={(value) => 
                  setAiSettings(prev => ({ ...prev, colorScheme: value }))
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Champion-based)</SelectItem>
                    <SelectItem value="blue">Blue Gaming</SelectItem>
                    <SelectItem value="gold">Gold Prestige</SelectItem>
                    <SelectItem value="red">Red Energy</SelectItem>
                    <SelectItem value="purple">Purple Mystic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

          {/* Generated Thumbnails */}
          <Card className="gaming-card border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Image className="w-5 h-5 text-blue-rift" />
                Generated Thumbnails ({thumbnails.length})
              </CardTitle>
              <CardDescription>
                Recent thumbnail generations ready for YouTube upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {thumbnails.map((thumbnail) => (
                  <div
                    key={thumbnail.id}
                    className="gaming-card p-4 border border-border/50 hover:border-gold/50 transition-smooth"
                  >
                    <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <div className="w-full h-full bg-gradient-gaming flex items-center justify-center relative">
                        <FileImage className="w-8 h-8 text-white" />
                        {thumbnail.status === "generating" && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-card-foreground text-sm">
                          {thumbnail.player} • {thumbnail.champion}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(thumbnail.status)}
                        >
                          {thumbnail.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{thumbnail.template}</span>
                        <span>{thumbnail.generatedAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => regenerateThumbnail(thumbnail.id)}
                          disabled={thumbnail.status === "generating"}
                          className="flex-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <TemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};