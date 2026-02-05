/**
 * Supabase database type definitions.
 * Matches the schema in supabase/migrations/00000000000001_contacts_leads.sql
 */
export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          organization: string | null;
          service: string;
          message: string;
          source: string;
          ghl_contact_id: string | null;
          page_url: string | null;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          organization?: string | null;
          service: string;
          message: string;
          source: string;
          ghl_contact_id?: string | null;
          page_url?: string | null;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          organization?: string | null;
          service?: string;
          message?: string;
          source?: string;
          ghl_contact_id?: string | null;
          page_url?: string | null;
          ip_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          type: string;
          name: string;
          email: string;
          phone: string | null;
          source: string;
          ghl_contact_id: string | null;
          extra: Record<string, unknown> | null;
          page_url: string | null;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          name: string;
          email: string;
          phone?: string | null;
          source: string;
          ghl_contact_id?: string | null;
          extra?: Record<string, unknown> | null;
          page_url?: string | null;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          source?: string;
          ghl_contact_id?: string | null;
          extra?: Record<string, unknown> | null;
          page_url?: string | null;
          ip_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
