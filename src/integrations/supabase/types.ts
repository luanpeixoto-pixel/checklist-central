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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          element_class: string | null
          element_id: string | null
          element_text: string | null
          event_name: string | null
          event_type: string
          id: string
          metadata: Json | null
          page_path: string
          scroll_depth: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_name?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          page_path: string
          scroll_depth?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_name?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          page_path?: string
          scroll_depth?: number | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      checklists: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      popup_definitions: {
        Row: {
          created_at: string
          description: string | null
          form_schema: Json
          id: string
          is_active: boolean
          name: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_schema: Json
          id?: string
          is_active?: boolean
          name: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          form_schema?: Json
          id?: string
          is_active?: boolean
          name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      popup_displays: {
        Row: {
          displayed_at: string
          id: string
          popup_id: string
          trigger_id: string | null
          user_id: string
        }
        Insert: {
          displayed_at?: string
          id?: string
          popup_id: string
          trigger_id?: string | null
          user_id: string
        }
        Update: {
          displayed_at?: string
          id?: string
          popup_id?: string
          trigger_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "popup_displays_popup_id_fkey"
            columns: ["popup_id"]
            isOneToOne: false
            referencedRelation: "popup_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popup_displays_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "popup_triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      popup_responses: {
        Row: {
          created_at: string
          id: string
          popup_id: string
          response_data: Json
          trigger_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          popup_id: string
          response_data: Json
          trigger_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          popup_id?: string
          response_data?: Json
          trigger_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "popup_responses_popup_id_fkey"
            columns: ["popup_id"]
            isOneToOne: false
            referencedRelation: "popup_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popup_responses_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "popup_triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      popup_triggers: {
        Row: {
          conditions: Json
          cooldown_hours: number | null
          created_at: string
          id: string
          is_active: boolean
          max_displays: number | null
          popup_id: string
          priority: number
          trigger_type: string
        }
        Insert: {
          conditions: Json
          cooldown_hours?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          max_displays?: number | null
          popup_id: string
          priority?: number
          trigger_type: string
        }
        Update: {
          conditions?: Json
          cooldown_hours?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          max_displays?: number | null
          popup_id?: string
          priority?: number
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "popup_triggers_popup_id_fkey"
            columns: ["popup_id"]
            isOneToOne: false
            referencedRelation: "popup_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
