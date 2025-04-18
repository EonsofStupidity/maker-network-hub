export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_shortcuts: {
        Row: {
          active_section: string | null
          created_at: string | null
          dashboard_collapsed: boolean | null
          dashboard_items: Json | null
          frozen_zones: Json | null
          id: string
          is_dark_mode: boolean | null
          layout_preference: string | null
          recent_views: Json | null
          shortcuts: Json
          show_labels: boolean | null
          sidebar_expanded: boolean | null
          theme_preference: string | null
          topnav_items: Json | null
          ui_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_section?: string | null
          created_at?: string | null
          dashboard_collapsed?: boolean | null
          dashboard_items?: Json | null
          frozen_zones?: Json | null
          id?: string
          is_dark_mode?: boolean | null
          layout_preference?: string | null
          recent_views?: Json | null
          shortcuts?: Json
          show_labels?: boolean | null
          sidebar_expanded?: boolean | null
          theme_preference?: string | null
          topnav_items?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_section?: string | null
          created_at?: string | null
          dashboard_collapsed?: boolean | null
          dashboard_items?: Json | null
          frozen_zones?: Json | null
          id?: string
          is_dark_mode?: boolean | null
          layout_preference?: string | null
          recent_views?: Json | null
          shortcuts?: Json
          show_labels?: boolean | null
          sidebar_expanded?: boolean | null
          theme_preference?: string | null
          topnav_items?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      application_logs: {
        Row: {
          category: string
          details: Json | null
          id: string
          level: number
          message: string
          source: string | null
          timestamp: string | null
        }
        Insert: {
          category: string
          details?: Json | null
          id?: string
          level: number
          message: string
          source?: string | null
          timestamp?: string | null
        }
        Update: {
          category?: string
          details?: Json | null
          id?: string
          level?: number
          message?: string
          source?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      baseline_configs: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          id: string
          table_name: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          table_name: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          slug: string
          status: string
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          status?: string
          thumbnail_url?: string | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      build_mods: {
        Row: {
          build_id: string
          complexity: number | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          build_id: string
          complexity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          build_id?: string
          complexity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      build_parts: {
        Row: {
          build_id: string
          created_at: string
          id: string
          notes: string | null
          part_id: string
          quantity: number
        }
        Insert: {
          build_id: string
          created_at?: string
          id?: string
          notes?: string | null
          part_id: string
          quantity?: number
        }
        Update: {
          build_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          part_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "build_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "printer_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      build_reviews: {
        Row: {
          approved: boolean | null
          body: string | null
          build_id: string | null
          category: string[] | null
          created_at: string | null
          id: string
          image_urls: string[] | null
          rating: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          body?: string | null
          build_id?: string | null
          category?: string[] | null
          created_at?: string | null
          id?: string
          image_urls?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          body?: string | null
          build_id?: string | null
          category?: string[] | null
          created_at?: string | null
          id?: string
          image_urls?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "build_reviews_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "build_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_reviews_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "printer_builds"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          system_user_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          system_user_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          system_user_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_system_settings: {
        Row: {
          created_at: string | null
          default_model: string | null
          enable_history: boolean | null
          id: string
          max_context_length: number | null
          provider: string
          system_prompt: string | null
          system_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_model?: string | null
          enable_history?: boolean | null
          id?: string
          max_context_length?: number | null
          provider?: string
          system_prompt?: string | null
          system_user_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_model?: string | null
          enable_history?: boolean | null
          id?: string
          max_context_length?: number | null
          provider?: string
          system_prompt?: string | null
          system_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      components: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          specifications: Json | null
          trending: boolean | null
          updated_at: string | null
          value_rating: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          specifications?: Json | null
          trending?: boolean | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          specifications?: Json | null
          trending?: boolean | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          type: string
          updated_at: string
          version: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          type: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          type?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_content_type"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "content_types"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items_categories: {
        Row: {
          category_id: string
          content_id: string
        }
        Insert: {
          category_id: string
          content_id: string
        }
        Update: {
          category_id?: string
          content_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_categories_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_layout: {
        Row: {
          created_by: string | null
          featured_override: string | null
          id: string
          section_order: string[]
          updated_at: string | null
        }
        Insert: {
          created_by?: string | null
          featured_override?: string | null
          id?: string
          section_order?: string[]
          updated_at?: string | null
        }
        Update: {
          created_by?: string | null
          featured_override?: string | null
          id?: string
          section_order?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      import_errors: {
        Row: {
          column_name: string | null
          created_at: string
          error_message: string
          error_type: string
          id: string
          import_session_id: string | null
          original_value: string | null
          row_number: number
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          error_message: string
          error_type: string
          id?: string
          import_session_id?: string | null
          original_value?: string | null
          row_number: number
        }
        Update: {
          column_name?: string | null
          created_at?: string
          error_message?: string
          error_type?: string
          id?: string
          import_session_id?: string | null
          original_value?: string | null
          row_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_errors_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "import_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      import_mappings: {
        Row: {
          created_at: string | null
          id: string
          import_session_id: string | null
          source_column: string
          target_column: string
          transformation_rule: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          import_session_id?: string | null
          source_column: string
          target_column: string
          transformation_rule?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          import_session_id?: string | null
          source_column?: string
          target_column?: string
          transformation_rule?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_mappings_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "import_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      import_sessions: {
        Row: {
          column_types: Json | null
          created_at: string
          created_by: string | null
          error_count: number
          id: string
          mapping_config: Json | null
          original_filename: string | null
          processed_rows: number
          status: string
          success_count: number
          total_rows: number
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          column_types?: Json | null
          created_at?: string
          created_by?: string | null
          error_count?: number
          id?: string
          mapping_config?: Json | null
          original_filename?: string | null
          processed_rows?: number
          status?: string
          success_count?: number
          total_rows?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          column_types?: Json | null
          created_at?: string
          created_by?: string | null
          error_count?: number
          id?: string
          mapping_config?: Json | null
          original_filename?: string | null
          processed_rows?: number
          status?: string
          success_count?: number
          total_rows?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: []
      }
      layout_skeletons: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_locked: boolean
          layout_json: Json
          name: string
          scope: string
          type: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_locked?: boolean
          layout_json?: Json
          name: string
          scope: string
          type: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_locked?: boolean
          layout_json?: Json
          name?: string
          scope?: string
          type?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          created_at: string
          created_by: string | null
          file_size: number
          file_type: string
          filename: string
          id: string
          metadata: Json | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_size: number
          file_type: string
          filename: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      metadata_workflow_instances: {
        Row: {
          content_id: string | null
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          status: string | null
          updated_at: string | null
          workflow_id: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          status?: string | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          status?: string | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metadata_workflow_instances_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metadata_workflow_instances_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "metadata_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      metadata_workflow_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          default_values: Json | null
          fields: Json
          id: string
          validation_rules: Json | null
          version: number
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          default_values?: Json | null
          fields: Json
          id?: string
          validation_rules?: Json | null
          version: number
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          default_values?: Json | null
          fields?: Json
          id?: string
          validation_rules?: Json | null
          version?: number
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metadata_workflow_versions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "metadata_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      metadata_workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          default_values: Json | null
          description: string | null
          fields: Json
          id: string
          is_active: boolean | null
          linked_parts: Json | null
          name: string
          slug: string
          updated_at: string | null
          validation_rules: Json | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          default_values?: Json | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          linked_parts?: Json | null
          name: string
          slug: string
          updated_at?: string | null
          validation_rules?: Json | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          default_values?: Json | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          linked_parts?: Json | null
          name?: string
          slug?: string
          updated_at?: string | null
          validation_rules?: Json | null
          version?: number | null
        }
        Relationships: []
      }
      part_reviews: {
        Row: {
          cons: string[] | null
          content: string | null
          created_at: string
          helpful_votes: number | null
          id: string
          part_id: string | null
          pros: string[] | null
          rating: number | null
          title: string | null
          updated_at: string
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          cons?: string[] | null
          content?: string | null
          created_at?: string
          helpful_votes?: number | null
          id?: string
          part_id?: string | null
          pros?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          cons?: string[] | null
          content?: string | null
          created_at?: string
          helpful_votes?: number | null
          id?: string
          part_id?: string | null
          pros?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "part_reviews_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "printer_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_builds: {
        Row: {
          complexity_score: number | null
          created_at: string | null
          description: string
          id: string
          images: string[] | null
          mods_count: number | null
          parts_count: number | null
          processed_at: string | null
          status: string | null
          submitted_by: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          complexity_score?: number | null
          created_at?: string | null
          description: string
          id?: string
          images?: string[] | null
          mods_count?: number | null
          parts_count?: number | null
          processed_at?: string | null
          status?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          complexity_score?: number | null
          created_at?: string | null
          description?: string
          id?: string
          images?: string[] | null
          mods_count?: number | null
          parts_count?: number | null
          processed_at?: string | null
          status?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printer_builds_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_part_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "printer_part_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "printer_part_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_parts: {
        Row: {
          category_id: string | null
          community_score: number | null
          compatibility: Json | null
          cons: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          dimensions: Json | null
          id: string
          images: string[] | null
          manufacturer_id: string | null
          model_number: string | null
          name: string
          price_range: Json | null
          pros: string[] | null
          review_count: number | null
          slug: string
          specifications: Json | null
          status: Database["public"]["Enums"]["part_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          community_score?: number | null
          compatibility?: Json | null
          cons?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          manufacturer_id?: string | null
          model_number?: string | null
          name: string
          price_range?: Json | null
          pros?: string[] | null
          review_count?: number | null
          slug: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["part_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          community_score?: number | null
          compatibility?: Json | null
          cons?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          manufacturer_id?: string | null
          model_number?: string | null
          name?: string
          price_range?: Json | null
          pros?: string[] | null
          review_count?: number | null
          slug?: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["part_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "printer_parts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "printer_part_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printer_parts_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_override_active: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          custom_styles: Json | null
          display_name: string | null
          id: string
          is_active: boolean | null
          last_forum_activity: string | null
          last_login: string | null
          layout_preference: Json | null
          motion_enabled: boolean | null
          platform_preference: string | null
          platform_specific_settings: Json | null
          preferences: Json | null
          primary_role_id: string | null
          profile_completed: boolean | null
          social_links: Json | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          admin_override_active?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          custom_styles?: Json | null
          display_name?: string | null
          id: string
          is_active?: boolean | null
          last_forum_activity?: string | null
          last_login?: string | null
          layout_preference?: Json | null
          motion_enabled?: boolean | null
          platform_preference?: string | null
          platform_specific_settings?: Json | null
          preferences?: Json | null
          primary_role_id?: string | null
          profile_completed?: boolean | null
          social_links?: Json | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          admin_override_active?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          custom_styles?: Json | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          last_forum_activity?: string | null
          last_login?: string | null
          layout_preference?: Json | null
          motion_enabled?: boolean | null
          platform_preference?: string | null
          platform_specific_settings?: Json | null
          preferences?: Json | null
          primary_role_id?: string | null
          profile_completed?: boolean | null
          social_links?: Json | null
          theme_preference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_role_id_fkey"
            columns: ["primary_role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          action: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          subject: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          subject: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          subject?: string
        }
        Relationships: []
      }
      theme_components: {
        Row: {
          component_name: string
          context: Database["public"]["Enums"]["theme_context"]
          created_at: string | null
          description: string | null
          id: string
          styles: Json
          theme_id: string | null
          updated_at: string | null
        }
        Insert: {
          component_name: string
          context?: Database["public"]["Enums"]["theme_context"]
          created_at?: string | null
          description?: string | null
          id?: string
          styles: Json
          theme_id?: string | null
          updated_at?: string | null
        }
        Update: {
          component_name?: string
          context?: Database["public"]["Enums"]["theme_context"]
          created_at?: string | null
          description?: string | null
          id?: string
          styles?: Json
          theme_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_components_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_tokens: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          fallback_value: string | null
          id: string
          theme_id: string | null
          token_name: string
          token_value: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          fallback_value?: string | null
          id?: string
          theme_id?: string | null
          token_name: string
          token_value: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          fallback_value?: string | null
          id?: string
          theme_id?: string | null
          token_name?: string
          token_value?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_tokens_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_versions: {
        Row: {
          component_tokens: Json | null
          created_at: string | null
          created_by: string | null
          design_tokens: Json
          id: string
          metadata: Json | null
          theme_id: string | null
          version: number
        }
        Insert: {
          component_tokens?: Json | null
          created_at?: string | null
          created_by?: string | null
          design_tokens: Json
          id?: string
          metadata?: Json | null
          theme_id?: string | null
          version: number
        }
        Update: {
          component_tokens?: Json | null
          created_at?: string | null
          created_by?: string | null
          design_tokens?: Json
          id?: string
          metadata?: Json | null
          theme_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "theme_versions_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          cache_key: string | null
          cached_styles: Json | null
          component_tokens: Json | null
          composition_rules: Json | null
          context: Database["public"]["Enums"]["theme_context"]
          created_at: string | null
          created_by: string | null
          description: string | null
          design_tokens: Json
          id: string
          is_default: boolean | null
          is_system: boolean | null
          name: string
          parent_theme_id: string | null
          preview_url: string | null
          published_at: string | null
          status: Database["public"]["Enums"]["theme_status"]
          updated_at: string | null
          version: number | null
        }
        Insert: {
          cache_key?: string | null
          cached_styles?: Json | null
          component_tokens?: Json | null
          composition_rules?: Json | null
          context?: Database["public"]["Enums"]["theme_context"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          design_tokens: Json
          id?: string
          is_default?: boolean | null
          is_system?: boolean | null
          name: string
          parent_theme_id?: string | null
          preview_url?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["theme_status"]
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          cache_key?: string | null
          cached_styles?: Json | null
          component_tokens?: Json | null
          composition_rules?: Json | null
          context?: Database["public"]["Enums"]["theme_context"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          design_tokens?: Json
          id?: string
          is_default?: boolean | null
          is_system?: boolean | null
          name?: string
          parent_theme_id?: string | null
          preview_url?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["theme_status"]
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_parent_theme_id_fkey"
            columns: ["parent_theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      active_users_count: {
        Row: {
          count: number | null
          total_count: number | null
        }
        Relationships: []
      }
      build_profiles: {
        Row: {
          avatar_url: string | null
          complexity_score: number | null
          created_at: string | null
          description: string | null
          display_name: string | null
          id: string | null
          images: string[] | null
          mods_count: number | null
          parts_count: number | null
          processed_at: string | null
          status: string | null
          submitted_by: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printer_builds_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parts_count: {
        Row: {
          count: number | null
        }
        Relationships: []
      }
      reviews_count: {
        Row: {
          count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_is_super_admin_for_policy: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      ensure_theme_token_structure: {
        Args: { data: Json }
        Returns: Json
      }
      get_api_key_requirements: {
        Args: { provider: string }
        Returns: Json
      }
      get_effective_theme: {
        Args: { theme_id: string }
        Returns: Json
      }
      get_theme_inheritance_chain: {
        Args: { theme_id: string }
        Returns: {
          id: string
          level: number
        }[]
      }
      is_admin_or_super_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      jsonb_deep_merge: {
        Args: { a: Json; b: Json }
        Returns: Json
      }
      map_roles_to_permissions: {
        Args: { roles: Database["public"]["Enums"]["user_role"][] }
        Returns: {
          permission: string
          subject: string
          action: string
        }[]
      }
      merge_theme_styles: {
        Args: { base_styles: Json; override_styles: Json }
        Returns: Json
      }
      refresh_materialized_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_activity_status: {
        Args: { new: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: boolean
      }
      validate_api_key_format: {
        Args: { key_text: string; provider: string }
        Returns: boolean
      }
    }
    Enums: {
      api_key_type:
        | "openai"
        | "stability"
        | "replicate"
        | "custom"
        | "zapier"
        | "pinecone"
        | "anthropic"
        | "gemini"
        | "openrouter"
      content_status: "draft" | "review" | "published" | "archived"
      content_type: "guide" | "tutorial" | "part-desc" | "build-log" | "news"
      part_status: "draft" | "published" | "archived"
      tenant_tier: "free" | "starter" | "pro" | "enterprise"
      theme_context: "site" | "admin" | "chat" | "app" | "training"
      theme_status: "draft" | "published" | "archived"
      user_role:
        | "super_admin"
        | "admin"
        | "maker"
        | "builder"
        | "user"
        | "moderator"
        | "editor"
        | "guest"
      workflow_field_type:
        | "string"
        | "textarea"
        | "number"
        | "boolean"
        | "date"
        | "array"
        | "relation"
        | "file"
        | "select"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      api_key_type: [
        "openai",
        "stability",
        "replicate",
        "custom",
        "zapier",
        "pinecone",
        "anthropic",
        "gemini",
        "openrouter",
      ],
      content_status: ["draft", "review", "published", "archived"],
      content_type: ["guide", "tutorial", "part-desc", "build-log", "news"],
      part_status: ["draft", "published", "archived"],
      tenant_tier: ["free", "starter", "pro", "enterprise"],
      theme_context: ["site", "admin", "chat", "app", "training"],
      theme_status: ["draft", "published", "archived"],
      user_role: [
        "super_admin",
        "admin",
        "maker",
        "builder",
        "user",
        "moderator",
        "editor",
        "guest",
      ],
      workflow_field_type: [
        "string",
        "textarea",
        "number",
        "boolean",
        "date",
        "array",
        "relation",
        "file",
        "select",
      ],
    },
  },
} as const
