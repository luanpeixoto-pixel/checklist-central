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
          user_id: string
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
          user_id: string
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
          user_id?: string
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
      fuel_records: {
        Row: {
          condutor: string | null
          created_at: string
          data_abastecimento: string
          id: string
          km_por_litro: number | null
          km_rodados: number | null
          litros: number
          observacoes: string | null
          posto: string | null
          quilometragem: number
          tanque_cheio: boolean | null
          tipo_combustivel: string
          updated_at: string
          user_id: string
          valor_litro: number | null
          valor_total: number
          vehicle_id: string
        }
        Insert: {
          condutor?: string | null
          created_at?: string
          data_abastecimento: string
          id?: string
          km_por_litro?: number | null
          km_rodados?: number | null
          litros: number
          observacoes?: string | null
          posto?: string | null
          quilometragem: number
          tanque_cheio?: boolean | null
          tipo_combustivel: string
          updated_at?: string
          user_id: string
          valor_litro?: number | null
          valor_total: number
          vehicle_id: string
        }
        Update: {
          condutor?: string | null
          created_at?: string
          data_abastecimento?: string
          id?: string
          km_por_litro?: number | null
          km_rodados?: number | null
          litros?: number
          observacoes?: string | null
          posto?: string | null
          quilometragem?: number
          tanque_cheio?: boolean | null
          tipo_combustivel?: string
          updated_at?: string
          user_id?: string
          valor_litro?: number | null
          valor_total?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          created_at: string
          custo: number | null
          data_manutencao: string
          data_proxima: string | null
          descricao: string | null
          fornecedor: string | null
          grupo: string | null
          id: string
          item: string
          nota_fiscal: string | null
          observacoes: string | null
          quilometragem_atual: number | null
          quilometragem_proxima: number | null
          status: string | null
          tipo_manutencao: string
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          custo?: number | null
          data_manutencao: string
          data_proxima?: string | null
          descricao?: string | null
          fornecedor?: string | null
          grupo?: string | null
          id?: string
          item: string
          nota_fiscal?: string | null
          observacoes?: string | null
          quilometragem_atual?: number | null
          quilometragem_proxima?: number | null
          status?: string | null
          tipo_manutencao: string
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          custo?: number | null
          data_manutencao?: string
          data_proxima?: string | null
          descricao?: string | null
          fornecedor?: string | null
          grupo?: string | null
          id?: string
          item?: string
          nota_fiscal?: string | null
          observacoes?: string | null
          quilometragem_atual?: number | null
          quilometragem_proxima?: number | null
          status?: string | null
          tipo_manutencao?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          popup_id: string
          response_data: Json
          trigger_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          popup_id?: string
          response_data?: Json
          trigger_id?: string | null
          user_id?: string
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
          delay_seconds: number | null
          id: string
          is_active: boolean
          max_displays: number | null
          pages: string[] | null
          popup_id: string
          priority: number
          trigger_event_name: string | null
          trigger_type: string
        }
        Insert: {
          conditions: Json
          cooldown_hours?: number | null
          created_at?: string
          delay_seconds?: number | null
          id?: string
          is_active?: boolean
          max_displays?: number | null
          pages?: string[] | null
          popup_id: string
          priority?: number
          trigger_event_name?: string | null
          trigger_type: string
        }
        Update: {
          conditions?: Json
          cooldown_hours?: number | null
          created_at?: string
          delay_seconds?: number | null
          id?: string
          is_active?: boolean
          max_displays?: number | null
          pages?: string[] | null
          popup_id?: string
          priority?: number
          trigger_event_name?: string | null
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          ano: number | null
          cor: string | null
          created_at: string
          empresa: string | null
          id: string
          marca: string | null
          modelo: string
          placa: string
          quilometragem_atual: number | null
          status: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ano?: number | null
          cor?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          marca?: string | null
          modelo: string
          placa: string
          quilometragem_atual?: number | null
          status?: string | null
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ano?: number | null
          cor?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          marca?: string | null
          modelo?: string
          placa?: string
          quilometragem_atual?: number | null
          status?: string | null
          tipo?: string
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
