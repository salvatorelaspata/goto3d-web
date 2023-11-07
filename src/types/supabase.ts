export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Catalog: {
        Row: {
          description: string
          id: number
          public: boolean
          title: string
          user_id: string | null
        }
        Insert: {
          description: string
          id?: number
          public: boolean
          title: string
          user_id?: string | null
        }
        Update: {
          description?: string
          id?: number
          public?: boolean
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      Model: {
        Row: {
          file_name: string
          id: number
          mime_type: string
          projects_id: number
          size: number
        }
        Insert: {
          file_name: string
          id: number
          mime_type: string
          projects_id: number
          size: number
        }
        Update: {
          file_name?: string
          id?: number
          mime_type?: string
          projects_id?: number
          size?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_projects_id_foreign"
            columns: ["projects_id"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          }
        ]
      }
      Process: {
        Row: {
          created_at: string
          detail: Database["public"]["Enums"]["details"] | null
          feature: Database["public"]["Enums"]["features"] | null
          finished_at: string | null
          id: number
          models_url: string[] | null
          ordering: Database["public"]["Enums"]["orders"] | null
          project_id: number
          started_at: string | null
          status: string | null
          userId: string
          uuid: string | null
        }
        Insert: {
          created_at?: string
          detail?: Database["public"]["Enums"]["details"] | null
          feature?: Database["public"]["Enums"]["features"] | null
          finished_at?: string | null
          id?: number
          models_url?: string[] | null
          ordering?: Database["public"]["Enums"]["orders"] | null
          project_id: number
          started_at?: string | null
          status?: string | null
          userId?: string
          uuid?: string | null
        }
        Update: {
          created_at?: string
          detail?: Database["public"]["Enums"]["details"] | null
          feature?: Database["public"]["Enums"]["features"] | null
          finished_at?: string | null
          id?: number
          models_url?: string[] | null
          ordering?: Database["public"]["Enums"]["orders"] | null
          project_id?: number
          started_at?: string | null
          status?: string | null
          userId?: string
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Process_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          }
        ]
      }
      Project: {
        Row: {
          catalog_id: number | null
          created_at: string
          description: string
          file_location: string | null
          files: Json[] | null
          id: number
          name: string
          status: string
          user_id: string
        }
        Insert: {
          catalog_id?: number | null
          created_at?: string
          description: string
          file_location?: string | null
          files?: Json[] | null
          id?: number
          name: string
          status: string
          user_id?: string
        }
        Update: {
          catalog_id?: number | null
          created_at?: string
          description?: string
          file_location?: string | null
          files?: Json[] | null
          id?: number
          name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Project_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "Catalog"
            referencedColumns: ["id"]
          }
        ]
      }
      queue: {
        Row: {
          completed_timestamp: string | null
          created_at: string
          id: number
          status: string
          task_data: Json
          timestamp: string
        }
        Insert: {
          completed_timestamp?: string | null
          created_at?: string
          id?: number
          status: string
          task_data: Json
          timestamp: string
        }
        Update: {
          completed_timestamp?: string | null
          created_at?: string
          id?: number
          status?: string
          task_data?: Json
          timestamp?: string
        }
        Relationships: []
      }
      "viewer-3d-dev": {
        Row: {
          count: number | null
          created_at: string | null
          files: string[] | null
          finished_at: string | null
          id: number
          models_url: string[] | null
          started_at: string | null
          status: string | null
          userId: string | null
          uuid: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          files?: string[] | null
          finished_at?: string | null
          id?: number
          models_url?: string[] | null
          started_at?: string | null
          status?: string | null
          userId?: string | null
          uuid?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          files?: string[] | null
          finished_at?: string | null
          id?: number
          models_url?: string[] | null
          started_at?: string | null
          status?: string | null
          userId?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      details: "preview" | "reduced" | "medium" | "full" | "raw"
      features: "normal" | "high"
      orders: "unordered" | "sequential"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
