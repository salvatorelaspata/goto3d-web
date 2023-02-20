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
      catalogs: {
        Row: {
          created_at: string | null
          id: number
          public: boolean | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          public?: boolean | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          public?: boolean | null
          title?: string | null
        }
      }
      "dashboard-users": {
        Row: {
          created_at: string | null
          email: string | null
          email_verified: boolean | null
          family_name: string | null
          given_name: string | null
          hd: string | null
          id: number
          image: string | null
          locale: string | null
          name: string | null
          picture: string | null
          profile: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          family_name?: string | null
          given_name?: string | null
          hd?: string | null
          id?: number
          image?: string | null
          locale?: string | null
          name?: string | null
          picture?: string | null
          profile?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          family_name?: string | null
          given_name?: string | null
          hd?: string | null
          id?: number
          image?: string | null
          locale?: string | null
          name?: string | null
          picture?: string | null
          profile?: string | null
          userId?: string | null
        }
      }
      process: {
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
      projects: {
        Row: {
          catalog_id: number | null
          created_at: string | null
          description: string | null
          id: number
          mode: string | null
          name: string | null
          process_uuid: number | null
          public: boolean | null
          tags: string[] | null
          user_id: number | null
        }
        Insert: {
          catalog_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          mode?: string | null
          name?: string | null
          process_uuid?: number | null
          public?: boolean | null
          tags?: string[] | null
          user_id?: number | null
        }
        Update: {
          catalog_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          mode?: string | null
          name?: string | null
          process_uuid?: number | null
          public?: boolean | null
          tags?: string[] | null
          user_id?: number | null
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
      "viewer-3d-dev-users": {
        Row: {
          created_at: string | null
          email: string | null
          email_verified: boolean | null
          family_name: string | null
          given_name: string | null
          hd: string | null
          id: number
          image: string | null
          locale: string | null
          name: string | null
          picture: string | null
          profile: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          family_name?: string | null
          given_name?: string | null
          hd?: string | null
          id?: number
          image?: string | null
          locale?: string | null
          name?: string | null
          picture?: string | null
          profile?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          family_name?: string | null
          given_name?: string | null
          hd?: string | null
          id?: number
          image?: string | null
          locale?: string | null
          name?: string | null
          picture?: string | null
          profile?: string | null
          userId?: string | null
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
