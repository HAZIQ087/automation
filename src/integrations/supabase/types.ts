export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          replays_discovered: number | null
          subscriber_count: number | null
          total_views: number | null
          total_watch_time: number | null
          updated_at: string
          user_id: string
          videos_uploaded: number | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          replays_discovered?: number | null
          subscriber_count?: number | null
          total_views?: number | null
          total_watch_time?: number | null
          updated_at?: string
          user_id: string
          videos_uploaded?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          replays_discovered?: number | null
          subscriber_count?: number | null
          total_views?: number | null
          total_watch_time?: number | null
          updated_at?: string
          user_id?: string
          videos_uploaded?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          league_username: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          league_username?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          league_username?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      replays: {
        Row: {
          champion: string
          created_at: string
          download_url: string | null
          duration: number | null
          file_size: number | null
          game_mode: string | null
          id: string
          kda: string | null
          patch_version: string | null
          player_name: string
          rank_tier: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          champion: string
          created_at?: string
          download_url?: string | null
          duration?: number | null
          file_size?: number | null
          game_mode?: string | null
          id?: string
          kda?: string | null
          patch_version?: string | null
          player_name: string
          rank_tier?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          champion?: string
          created_at?: string
          download_url?: string | null
          duration?: number | null
          file_size?: number | null
          game_mode?: string | null
          id?: string
          kda?: string | null
          patch_version?: string | null
          player_name?: string
          rank_tier?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_configs: {
        Row: {
          auto_discovery: boolean | null
          auto_recording: boolean | null
          auto_thumbnails: boolean | null
          auto_upload: boolean | null
          created_at: string
          id: string
          lcu_enabled: boolean | null
          league_api_key: string | null
          thumbnail_style: string | null
          updated_at: string
          user_id: string
          video_format: string | null
          video_quality: string | null
          youtube_api_key: string | null
          youtube_channel_id: string | null
        }
        Insert: {
          auto_discovery?: boolean | null
          auto_recording?: boolean | null
          auto_thumbnails?: boolean | null
          auto_upload?: boolean | null
          created_at?: string
          id?: string
          lcu_enabled?: boolean | null
          league_api_key?: string | null
          thumbnail_style?: string | null
          updated_at?: string
          user_id: string
          video_format?: string | null
          video_quality?: string | null
          youtube_api_key?: string | null
          youtube_channel_id?: string | null
        }
        Update: {
          auto_discovery?: boolean | null
          auto_recording?: boolean | null
          auto_thumbnails?: boolean | null
          auto_upload?: boolean | null
          created_at?: string
          id?: string
          lcu_enabled?: boolean | null
          league_api_key?: string | null
          thumbnail_style?: string | null
          updated_at?: string
          user_id?: string
          video_format?: string | null
          video_quality?: string | null
          youtube_api_key?: string | null
          youtube_channel_id?: string | null
        }
        Relationships: []
      }
      system_status: {
        Row: {
          created_at: string
          current_task: string | null
          id: string
          is_running: boolean | null
          last_activity: string | null
          replays_found: number | null
          updated_at: string
          uptime: number | null
          user_id: string
          videos_uploaded: number | null
        }
        Insert: {
          created_at?: string
          current_task?: string | null
          id?: string
          is_running?: boolean | null
          last_activity?: string | null
          replays_found?: number | null
          updated_at?: string
          uptime?: number | null
          user_id: string
          videos_uploaded?: number | null
        }
        Update: {
          created_at?: string
          current_task?: string | null
          id?: string
          is_running?: boolean | null
          last_activity?: string | null
          replays_found?: number | null
          updated_at?: string
          uptime?: number | null
          user_id?: string
          videos_uploaded?: number | null
        }
        Relationships: []
      }
      thumbnail_templates: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_url: string
          id: string
          is_active: boolean | null
          name: string
          preview_url: string | null
          settings: Json | null
          template_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_url: string
          id?: string
          is_active?: boolean | null
          name: string
          preview_url?: string | null
          settings?: Json | null
          template_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          name?: string
          preview_url?: string | null
          settings?: Json | null
          template_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      upload_jobs: {
        Row: {
          champion: string
          created_at: string
          duration: number | null
          error_message: string | null
          estimated_time: number | null
          file_size: number | null
          id: string
          player_name: string
          progress: number | null
          replay_id: string | null
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          youtube_url: string | null
        }
        Insert: {
          champion: string
          created_at?: string
          duration?: number | null
          error_message?: string | null
          estimated_time?: number | null
          file_size?: number | null
          id?: string
          player_name: string
          progress?: number | null
          replay_id?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          youtube_url?: string | null
        }
        Update: {
          champion?: string
          created_at?: string
          duration?: number | null
          error_message?: string | null
          estimated_time?: number | null
          file_size?: number | null
          id?: string
          player_name?: string
          progress?: number | null
          replay_id?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upload_jobs_replay_id_fkey"
            columns: ["replay_id"]
            isOneToOne: false
            referencedRelation: "replays"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
