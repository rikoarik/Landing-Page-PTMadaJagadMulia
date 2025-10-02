export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string
          image_url: string | null
          stats: Json
          version: number
          is_published: boolean
          created_at: string | null
          updated_at: string | null
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description: string
          image_url?: string | null
          stats?: Json
          version?: number
          is_published?: boolean
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string
          image_url?: string | null
          stats?: Json
          version?: number
          is_published?: boolean
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
        }
        Relationships: []
      }
      about_content_history: {
        Row: {
          id: string
          about_content_id: string
          title: string
          subtitle: string | null
          description: string
          image_url: string | null
          stats: Json
          version: number
          created_at: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          about_content_id: string
          title: string
          subtitle?: string | null
          description: string
          image_url?: string | null
          stats?: Json
          version: number
          created_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          about_content_id?: string
          title?: string
          subtitle?: string | null
          description?: string
          image_url?: string | null
          stats?: Json
          version?: number
          created_at?: string | null
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "about_content_history_about_content_id_fkey"
            columns: ["about_content_id"]
            referencedRelation: "about_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "about_content_history_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_structure: {
        Row: {
          created_at: string | null
          id: string
          is_published: boolean | null
          level: number
          name: string
          position: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          level: number
          name: string
          position: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          level?: number
          name?: string
          position?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_published: boolean | null
          location: string
          sort_order: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location: string
          sort_order?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          bg_color: string
          color: string
          created_at: string | null
          description: string
          icon: string
          id: string
          is_published: boolean | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          bg_color: string
          color: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_published?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          bg_color?: string
          color?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_published?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          initials: string
          is_published: boolean | null
          name: string
          position: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          initials: string
          is_published?: boolean | null
          name: string
          position: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          initials?: string
          is_published?: boolean | null
          name?: string
          position?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          company: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          quote: string
          role: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          author: string
          company?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          quote: string
          role: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          author?: string
          company?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          quote?: string
          role?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          id: string
          visitor_id: string
          path: string
          referrer: string | null
          device_type: string
          duration: number
          created_at: string
        }
        Insert: {
          id?: string
          visitor_id: string
          path: string
          referrer?: string | null
          device_type: string
          duration?: number
          created_at?: string
        }
        Update: {
          id?: string
          visitor_id?: string
          path?: string
          referrer?: string | null
          device_type?: string
          duration?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
    Enums: {
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
