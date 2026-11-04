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
      admin_activity: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          staff_email: string
          staff_id: string | null
          staff_role: string
          summary: string
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          staff_email: string
          staff_id?: string | null
          staff_role: string
          summary: string
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          staff_email?: string
          staff_id?: string | null
          staff_role?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_profiles: {
        Row: {
          agency_name: string
          commission_rate: number
          created_at: string
          id: string
          total_earnings: number
          user_id: string
        }
        Insert: {
          agency_name: string
          commission_rate?: number
          created_at?: string
          id?: string
          total_earnings?: number
          user_id: string
        }
        Update: {
          agency_name?: string
          commission_rate?: number
          created_at?: string
          id?: string
          total_earnings?: number
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          airline: string | null
          billing_address: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          cabin_class: string | null
          fare_provider: string | null
          captured_at: string | null
          captured_by: string | null
          click_id: string | null
          created_at: string
          currency: string
          depart_date: string | null
          destination: string
          guest_email: string | null
          guest_phone: string | null
          id: string
          lead_name: string | null
          origin: string
          pnr: string | null
          promo_code: string | null
          promo_discount: number
          return_date: string | null
          source: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          user_id: string | null
          utm_source: string | null
          verification_remarks: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          airline?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          cabin_class?: string | null
          fare_provider?: string | null
          captured_at?: string | null
          captured_by?: string | null
          click_id?: string | null
          created_at?: string
          currency?: string
          depart_date?: string | null
          destination: string
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          lead_name?: string | null
          origin: string
          pnr?: string | null
          promo_code?: string | null
          promo_discount?: number
          return_date?: string | null
          source?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          user_id?: string | null
          utm_source?: string | null
          verification_remarks?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          airline?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          cabin_class?: string | null
          fare_provider?: string | null
          captured_at?: string | null
          captured_by?: string | null
          click_id?: string | null
          created_at?: string
          currency?: string
          depart_date?: string | null
          destination?: string
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          lead_name?: string | null
          origin?: string
          pnr?: string | null
          promo_code?: string | null
          promo_discount?: number
          return_date?: string | null
          source?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          user_id?: string | null
          utm_source?: string | null
          verification_remarks?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      card_reveal_audit: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          remarks: string
          staff_email: string
          staff_id: string | null
          staff_role: string
          vaulted_card_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          remarks: string
          staff_email: string
          staff_id?: string | null
          staff_role: string
          vaulted_card_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          remarks?: string
          staff_email?: string
          staff_id?: string | null
          staff_role?: string
          vaulted_card_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_reveal_audit_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_reveal_audit_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_reveal_audit_vaulted_card_id_fkey"
            columns: ["vaulted_card_id"]
            isOneToOne: false
            referencedRelation: "vaulted_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      corporate_leads: {
        Row: {
          admin_notes: string | null
          company: string
          contact_name: string
          created_at: string
          crm_status: string
          email: string
          group_size: string | null
          id: string
          monthly_spend: string | null
          notes: string | null
          phone: string | null
          routes: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          company: string
          contact_name: string
          created_at?: string
          crm_status?: string
          email: string
          group_size?: string | null
          id?: string
          monthly_spend?: string | null
          notes?: string | null
          phone?: string | null
          routes?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          company?: string
          contact_name?: string
          created_at?: string
          crm_status?: string
          email?: string
          group_size?: string | null
          id?: string
          monthly_spend?: string | null
          notes?: string | null
          phone?: string | null
          routes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          airline: string
          cabin_class: string
          created_at: string
          currency: string
          destination: string
          expires_at: string | null
          id: string
          origin: string
          price: number
        }
        Insert: {
          airline: string
          cabin_class?: string
          created_at?: string
          currency?: string
          destination: string
          expires_at?: string | null
          id?: string
          origin: string
          price: number
        }
        Update: {
          airline?: string
          cabin_class?: string
          created_at?: string
          currency?: string
          destination?: string
          expires_at?: string | null
          id?: string
          origin?: string
          price?: number
        }
        Relationships: []
      }
      fare_interest_clicks: {
        Row: {
          airline: string | null
          clicked_at: string
          destination: string
          id: string
          interest_type: string
          origin: string
        }
        Insert: {
          airline?: string | null
          clicked_at?: string
          destination: string
          id?: string
          interest_type?: string
          origin: string
        }
        Update: {
          airline?: string | null
          clicked_at?: string
          destination?: string
          id?: string
          interest_type?: string
          origin?: string
        }
        Relationships: []
      }
      fare_leads: {
        Row: {
          admin_notes: string | null
          cabin: string | null
          company: string | null
          created_at: string
          crm_status: string
          destination: string | null
          email: string
          full_name: string | null
          id: string
          lead_type: string
          notes: string | null
          origin: string | null
          phone: string | null
          travel_month: string | null
        }
        Insert: {
          admin_notes?: string | null
          cabin?: string | null
          company?: string | null
          created_at?: string
          crm_status?: string
          destination?: string | null
          email: string
          full_name?: string | null
          id?: string
          lead_type: string
          notes?: string | null
          origin?: string | null
          phone?: string | null
          travel_month?: string | null
        }
        Update: {
          admin_notes?: string | null
          cabin?: string | null
          company?: string | null
          created_at?: string
          crm_status?: string
          destination?: string | null
          email?: string
          full_name?: string | null
          id?: string
          lead_type?: string
          notes?: string | null
          origin?: string | null
          phone?: string | null
          travel_month?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      passengers: {
        Row: {
          booking_id: string
          created_at: string
          dob: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          passport_no: string | null
          title: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          dob?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          passport_no?: string | null
          title?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          dob?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          passport_no?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passengers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          id: string
          method: string | null
          status: string
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string
          id?: string
          method?: string | null
          status?: string
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          id?: string
          method?: string | null
          status?: string
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          loyalty_tier: Database["public"]["Enums"]["loyalty_tier"]
          wallet_credits: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          loyalty_tier?: Database["public"]["Enums"]["loyalty_tier"]
          wallet_credits?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          loyalty_tier?: Database["public"]["Enums"]["loyalty_tier"]
          wallet_credits?: number
        }
        Relationships: []
      }
      provider_searches: {
        Row: {
          adults: number
          cabin: string | null
          created_at: string
          depart_date: string
          destination: string
          fares: number
          id: string
          message: string | null
          ms: number
          origin: string
          provider: string
          return_date: string | null
          search_id: string
          status: string
        }
        Insert: {
          adults?: number
          cabin?: string | null
          created_at?: string
          depart_date: string
          destination: string
          fares?: number
          id?: string
          message?: string | null
          ms?: number
          origin: string
          provider: string
          return_date?: string | null
          search_id: string
          status: string
        }
        Update: {
          adults?: number
          cabin?: string | null
          created_at?: string
          depart_date?: string
          destination?: string
          fares?: number
          id?: string
          message?: string | null
          ms?: number
          origin?: string
          provider?: string
          return_date?: string | null
          search_id?: string
          status?: string
        }
        Relationships: []
      }
      provider_switches: {
        Row: {
          paused: boolean
          paused_at: string | null
          paused_by: string | null
          paused_until: string | null
          provider: string
          reason: string | null
          updated_at: string
        }
        Insert: {
          paused?: boolean
          paused_at?: string | null
          paused_by?: string | null
          paused_until?: string | null
          provider: string
          reason?: string | null
          updated_at?: string
        }
        Update: {
          paused?: boolean
          paused_at?: string | null
          paused_by?: string | null
          paused_until?: string | null
          provider?: string
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          airline_penalty: number
          airline_reference: string | null
          booking_id: string
          closed_by: string | null
          created_at: string
          currency: string
          fare_paid: number
          filed_at: string | null
          id: string
          non_refundable_taxes: number
          notes: string | null
          paid_at: string | null
          reason: string | null
          refund_amount: number
          requested_by: string
          service_fee: number
          status: string
          updated_at: string
        }
        Insert: {
          airline_penalty?: number
          airline_reference?: string | null
          booking_id: string
          closed_by?: string | null
          created_at?: string
          currency?: string
          fare_paid: number
          filed_at?: string | null
          id?: string
          non_refundable_taxes?: number
          notes?: string | null
          paid_at?: string | null
          reason?: string | null
          refund_amount: number
          requested_by: string
          service_fee?: number
          status?: string
          updated_at?: string
        }
        Update: {
          airline_penalty?: number
          airline_reference?: string | null
          booking_id?: string
          closed_by?: string | null
          created_at?: string
          currency?: string
          fare_paid?: number
          filed_at?: string | null
          id?: string
          non_refundable_taxes?: number
          notes?: string | null
          paid_at?: string | null
          reason?: string | null
          refund_amount?: number
          requested_by?: string
          service_fee?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      route_fare_cache: {
        Row: {
          airline: string | null
          cabin_class: string
          currency: string | null
          destination: string
          expires_at: string
          fetched_at: string
          id: string
          origin: string
          price: number | null
          search_count: number
        }
        Insert: {
          airline?: string | null
          cabin_class?: string
          currency?: string | null
          destination: string
          expires_at?: string
          fetched_at?: string
          id?: string
          origin: string
          price?: number | null
          search_count?: number
        }
        Update: {
          airline?: string | null
          cabin_class?: string
          currency?: string | null
          destination?: string
          expires_at?: string
          fetched_at?: string
          id?: string
          origin?: string
          price?: number | null
          search_count?: number
        }
        Relationships: []
      }
      rate_limit_counters: {
        Row: { hits: number; key: string; window_started: string }
        Insert: { hits?: number; key: string; window_started?: string }
        Update: { hits?: number; key?: string; window_started?: string }
        Relationships: []
      }
      search_guard_blocks: {
        Row: {
          country: string | null
          id: string
          occurred_at: string
          path: string
          reason: string
        }
        Insert: {
          country?: string | null
          id?: string
          occurred_at?: string
          path: string
          reason: string
        }
        Update: {
          country?: string | null
          id?: string
          occurred_at?: string
          path?: string
          reason?: string
        }
        Relationships: []
      }
      site_events: {
        Row: {
          country: string | null
          detail: Json | null
          event_type: string
          id: string
          occurred_at: string
          path: string | null
          route: string | null
          visit_id: string
          visitor_id: string
        }
        Insert: {
          country?: string | null
          detail?: Json | null
          event_type: string
          id?: string
          occurred_at?: string
          path?: string | null
          route?: string | null
          visit_id: string
          visitor_id: string
        }
        Update: {
          country?: string | null
          detail?: Json | null
          event_type?: string
          id?: string
          occurred_at?: string
          path?: string | null
          route?: string | null
          visit_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      staff_users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_login_at: string | null
          password_hash: string
          password_salt: string
          role: Database["public"]["Enums"]["staff_role"]
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          password_hash: string
          password_salt: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          password_hash?: string
          password_salt?: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Relationships: []
      }
      tickets: {
        Row: {
          base_fare: number
          booking_id: string
          commission: number
          created_at: string
          id: string
          pnr_code: string | null
          supplier: string | null
          ticket_number: string | null
        }
        Insert: {
          base_fare?: number
          booking_id: string
          commission?: number
          created_at?: string
          id?: string
          pnr_code?: string | null
          supplier?: string | null
          ticket_number?: string | null
        }
        Update: {
          base_fare?: number
          booking_id?: string
          commission?: number
          created_at?: string
          id?: string
          pnr_code?: string | null
          supplier?: string | null
          ticket_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vaulted_cards: {
        Row: {
          booking_id: string | null
          brand: string | null
          cardholder_name: string | null
          ciphertext: string
          created_at: string
          exp_month: string | null
          exp_year: string | null
          id: string
          iv: string
          last4: string | null
          verification_request_id: string | null
        }
        Insert: {
          booking_id?: string | null
          brand?: string | null
          cardholder_name?: string | null
          ciphertext: string
          created_at?: string
          exp_month?: string | null
          exp_year?: string | null
          id?: string
          iv: string
          last4?: string | null
          verification_request_id?: string | null
        }
        Update: {
          booking_id?: string | null
          brand?: string | null
          cardholder_name?: string | null
          ciphertext?: string
          created_at?: string
          exp_month?: string | null
          exp_year?: string | null
          id?: string
          iv?: string
          last4?: string | null
          verification_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaulted_cards_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaulted_cards_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          admin_notes: string | null
          booking_id: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          expires_at: string
          id: string
          id_back_path: string | null
          id_front_path: string | null
          reviewed_at: string | null
          selfie_path: string | null
          status: string
          submitted_at: string | null
          token: string
        }
        Insert: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          expires_at?: string
          id?: string
          id_back_path?: string | null
          id_front_path?: string | null
          reviewed_at?: string | null
          selfie_path?: string | null
          status?: string
          submitted_at?: string | null
          token: string
        }
        Update: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          expires_at?: string
          id?: string
          id_back_path?: string | null
          id_front_path?: string | null
          reviewed_at?: string | null
          selfie_path?: string | null
          status?: string
          submitted_at?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      next_booking_reference: { Args: never; Returns: string }
      rate_limit_hit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number }
        Returns: boolean
      }
      search_guard_summary: {
        Args: { p_since: string; p_until: string }
        Returns: Json
      }
      visitor_summary: {
        Args: { p_since: string; p_until: string }
        Returns: Json
      }
      visitor_recent: {
        Args: { p_limit: number; p_search: string | null; p_since: string; p_until: string }
        Returns: {
          actions: number
          booked: boolean
          country: string | null
          first_seen: string
          landing: string | null
          last_seen: string
          searched: boolean
          visitor_id: string
          visits: number
        }[]
      }
      provider_search_stats: {
        Args: { since: string }
        Returns: {
          avg_ms: number
          failed: number
          fares_returned: number
          last_error: string | null
          last_error_at: string | null
          last_fares_at: string | null
          lookups: number
          provider: string
          with_fares: number
        }[]
      }
    }
    Enums: {
      app_role: "customer" | "agent" | "admin"
      booking_status: "pending" | "issued" | "cancelled" | "refunded"
      loyalty_tier: "silver" | "gold" | "platinum"
      staff_role: "agent" | "manager" | "superadmin"
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
      app_role: ["customer", "agent", "admin"],
      booking_status: ["pending", "issued", "cancelled", "refunded"],
      loyalty_tier: ["silver", "gold", "platinum"],
      staff_role: ["agent", "manager", "superadmin"],
    },
  },
} as const
