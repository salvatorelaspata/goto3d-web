export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
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
        }
        Insert: {
          description: string
          id?: number
          public: boolean
          title: string
        }
        Update: {
          description?: string
          id?: number
          public?: boolean
          title?: string
        }
      }
      File: {
        Row: {
          file_name: string
          id: number
          mime_type: string
          project_id: number
          size: number
          user_id: string | null
        }
        Insert: {
          file_name: string
          id?: number
          mime_type: string
          project_id: number
          size: number
          user_id?: string | null
        }
        Update: {
          file_name?: string
          id?: number
          mime_type?: string
          project_id?: number
          size?: number
          user_id?: string | null
        }
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
      }
      Project: {
        Row: {
          catalogs_id: number | null
          created_at: string
          description: string
          finished_at: string | null
          id: number
          name: string
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          catalogs_id?: number | null
          created_at?: string
          description: string
          finished_at?: string | null
          id?: number
          name: string
          started_at?: string | null
          status: string
          user_id?: string
        }
        Update: {
          catalogs_id?: number | null
          created_at?: string
          description?: string
          finished_at?: string | null
          id?: number
          name?: string
          started_at?: string | null
          status?: string
          user_id?: string
        }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
