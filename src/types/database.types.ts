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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accessibility_settings: {
        Row: {
          font_scale: number
          high_contrast: boolean
          profile_id: string
          reduce_motion: boolean
          screen_reader_optimized: boolean
          updated_at: string
        }
        Insert: {
          font_scale?: number
          high_contrast?: boolean
          profile_id: string
          reduce_motion?: boolean
          screen_reader_optimized?: boolean
          updated_at?: string
        }
        Update: {
          font_scale?: number
          high_contrast?: boolean
          profile_id?: string
          reduce_motion?: boolean
          screen_reader_optimized?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessibility_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessibility_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          profile_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          profile_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          profile_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          accessibility_features: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_verified_inclusive: boolean
          logo_url: string | null
          name: string
          sector: string | null
          size: string | null
          website: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_verified_inclusive?: boolean
          logo_url?: string | null
          name: string
          sector?: string | null
          size?: string | null
          website?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_verified_inclusive?: boolean
          logo_url?: string | null
          name?: string
          sector?: string | null
          size?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          id: string
          member_role: Database["public"]["Enums"]["company_member_role"]
          profile_id: string
          show_pcd_badge: boolean
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          member_role?: Database["public"]["Enums"]["company_member_role"]
          profile_id: string
          show_pcd_badge?: boolean
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          member_role?: Database["public"]["Enums"]["company_member_role"]
          profile_id?: string
          show_pcd_badge?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      company_reviews: {
        Row: {
          accessibility_rating: number
          comment: string | null
          company_id: string
          created_at: string
          id: string
          is_anonymous: boolean
          profile_id: string
          rating: number
        }
        Insert: {
          accessibility_rating: number
          comment?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          profile_id: string
          rating: number
        }
        Update: {
          accessibility_rating?: number
          comment?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          profile_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"]
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"]
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
        }
        Relationships: [
          {
            foreignKeyName: "connections_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          profile_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          profile_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          profile_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          accessibility_features: string[] | null
          category: string | null
          description: string | null
          id: string
          is_free: boolean | null
          provider: string | null
          title: string
          url: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          category?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          provider?: string | null
          title: string
          url?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          category?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          provider?: string | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      educations: {
        Row: {
          course: string
          end_date: string | null
          id: string
          institution: string
          is_current: boolean | null
          level: string | null
          profile_id: string
          start_date: string | null
        }
        Insert: {
          course: string
          end_date?: string | null
          id?: string
          institution: string
          is_current?: boolean | null
          level?: string | null
          profile_id: string
          start_date?: string | null
        }
        Update: {
          course?: string
          end_date?: string | null
          id?: string
          institution?: string
          is_current?: boolean | null
          level?: string | null
          profile_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company_name: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          profile_id: string
          role_title: string
          start_date: string | null
        }
        Insert: {
          company_name: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          profile_id: string
          role_title: string
          start_date?: string | null
        }
        Update: {
          company_name?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          profile_id?: string
          role_title?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          accessibility_resources: string[] | null
          closes_at: string | null
          company_id: string
          created_at: string
          description: string
          id: string
          location_city: string | null
          location_state: string | null
          posted_by: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          salary_visible: boolean | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          type: Database["public"]["Enums"]["job_type"]
          work_mode: Database["public"]["Enums"]["work_mode"]
        }
        Insert: {
          accessibility_resources?: string[] | null
          closes_at?: string | null
          company_id: string
          created_at?: string
          description: string
          id?: string
          location_city?: string | null
          location_state?: string | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_visible?: boolean | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          type: Database["public"]["Enums"]["job_type"]
          work_mode: Database["public"]["Enums"]["work_mode"]
        }
        Update: {
          accessibility_resources?: string[] | null
          closes_at?: string | null
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          location_city?: string | null
          location_state?: string | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_visible?: boolean | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          type?: Database["public"]["Enums"]["job_type"]
          work_mode?: Database["public"]["Enums"]["work_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorships: {
        Row: {
          created_at: string
          id: string
          mentee_id: string
          mentor_id: string
          message: string | null
          status: Database["public"]["Enums"]["mentorship_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          mentee_id: string
          mentor_id: string
          message?: string | null
          status?: Database["public"]["Enums"]["mentorship_status"]
        }
        Update: {
          created_at?: string
          id?: string
          mentee_id?: string
          mentor_id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["mentorship_status"]
        }
        Relationships: [
          {
            foreignKeyName: "mentorships_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorships_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorships_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorships_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          profile_id: string
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          profile_id: string
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          profile_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_alt: string | null
          image_url: string | null
          profile_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url?: string | null
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          profile_id: string
          skill_id: string
        }
        Insert: {
          profile_id: string
          skill_id: string
        }
        Update: {
          profile_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessibility_needs: string[] | null
          accessibility_needs_other: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          deleted_at: string | null
          disability_types: string[] | null
          disability_types_other: string | null
          discloses_disability: boolean
          full_name: string
          headline: string | null
          id: string
          location_city: string | null
          location_state: string | null
          open_to_mentor: boolean
          open_to_work: boolean
          phone: string | null
          resume_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          scheduled_deletion_at: string | null
          updated_at: string
        }
        Insert: {
          accessibility_needs?: string[] | null
          accessibility_needs_other?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          disability_types?: string[] | null
          disability_types_other?: string | null
          discloses_disability?: boolean
          full_name: string
          headline?: string | null
          id: string
          location_city?: string | null
          location_state?: string | null
          open_to_mentor?: boolean
          open_to_work?: boolean
          phone?: string | null
          resume_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          scheduled_deletion_at?: string | null
          updated_at?: string
        }
        Update: {
          accessibility_needs?: string[] | null
          accessibility_needs_other?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          disability_types?: string[] | null
          disability_types_other?: string | null
          discloses_disability?: boolean
          full_name?: string
          headline?: string | null
          id?: string
          location_city?: string | null
          location_state?: string | null
          open_to_mentor?: boolean
          open_to_work?: boolean
          phone?: string | null
          resume_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          scheduled_deletion_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target_type"]
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["report_target_type"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          accessibility_needs: string[] | null
          avatar_url: string | null
          bio: string | null
          disability_types: string[] | null
          full_name: string | null
          headline: string | null
          id: string | null
          location_city: string | null
          location_state: string | null
          open_to_mentor: boolean | null
          open_to_work: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          accessibility_needs?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          disability_types?: never
          full_name?: string | null
          headline?: string | null
          id?: string | null
          location_city?: string | null
          location_state?: string | null
          open_to_mentor?: boolean | null
          open_to_work?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          accessibility_needs?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          disability_types?: never
          full_name?: string | null
          headline?: string | null
          id?: string | null
          location_city?: string | null
          location_state?: string | null
          open_to_mentor?: boolean | null
          open_to_work?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_company: {
        Args: {
          p_description?: string
          p_name: string
          p_sector?: string
          p_show_pcd_badge?: boolean
          p_size?: string
          p_website?: string
        }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_company_member: {
        Args: { target_company_id: string }
        Returns: boolean
      }
      is_company_owner: {
        Args: { target_company_id: string }
        Returns: boolean
      }
      profile_id_by_email: {
        Args: { p_company_id: string; p_email: string }
        Returns: string
      }
    }
    Enums: {
      application_status:
        | "enviada"
        | "em_analise"
        | "entrevista"
        | "aprovado"
        | "rejeitado"
      company_member_role: "dono" | "recrutador"
      connection_status: "pendente" | "aceita" | "recusada"
      job_status: "rascunho" | "aberta" | "encerrada"
      job_type: "CLT" | "PJ" | "Estagio" | "Jovem Aprendiz" | "Temporario"
      mentorship_status: "pendente" | "ativa" | "concluida"
      report_status: "pendente" | "em_analise" | "resolvido"
      report_target_type:
        | "post"
        | "company_review"
        | "profile"
        | "job"
        | "company"
      user_role: "usuario" | "admin"
      work_mode: "presencial" | "remoto" | "hibrido"
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
      application_status: [
        "enviada",
        "em_analise",
        "entrevista",
        "aprovado",
        "rejeitado",
      ],
      company_member_role: ["dono", "recrutador"],
      connection_status: ["pendente", "aceita", "recusada"],
      job_status: ["rascunho", "aberta", "encerrada"],
      job_type: ["CLT", "PJ", "Estagio", "Jovem Aprendiz", "Temporario"],
      mentorship_status: ["pendente", "ativa", "concluida"],
      report_status: ["pendente", "em_analise", "resolvido"],
      report_target_type: [
        "post",
        "company_review",
        "profile",
        "job",
        "company",
      ],
      user_role: ["usuario", "admin"],
      work_mode: ["presencial", "remoto", "hibrido"],
    },
  },
} as const
