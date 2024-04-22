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
      CafeCards: {
        Row: {
          created_at: string
          id: number
          price: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          price: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          price?: number
          user_id?: string | null
        }
        Relationships: []
      }
      issues: {
        Row: {
          id: number
          tags: string[] | null
          title: string | null
        }
        Insert: {
          id: number
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          id?: number
          tags?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
      OrderItems: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          order_id: number
          product_id: number
          product_name: string
          product_price: number
          quantity: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          order_id: number
          product_id: number
          product_name: string
          product_price: number
          quantity: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          order_id?: number
          product_id?: number
          product_name?: string
          product_price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_OrderItems_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_OrderItems_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Products"
            referencedColumns: ["id"]
          },
        ]
      }
      Orders: {
        Row: {
          categories: string[]
          comment: string | null
          created_at: string
          customer_name: string | null
          id: number
          payment_method: string
          price: number
          product_ids: string[]
          status: Database["public"]["Enums"]["order_status"]
          table_number: string | null
          user_id: string | null
        }
        Insert: {
          categories: string[]
          comment?: string | null
          created_at?: string
          customer_name?: string | null
          id?: number
          payment_method: string
          price: number
          product_ids: string[]
          status: Database["public"]["Enums"]["order_status"]
          table_number?: string | null
          user_id?: string | null
        }
        Update: {
          categories?: string[]
          comment?: string | null
          created_at?: string
          customer_name?: string | null
          id?: number
          payment_method?: string
          price?: number
          product_ids?: string[]
          status?: Database["public"]["Enums"]["order_status"]
          table_number?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Products: {
        Row: {
          category: string
          created_at: string
          deleted: boolean | null
          id: number
          image: string | null
          method: string | null
          name: string
          price: number
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          deleted?: boolean | null
          id?: number
          image?: string | null
          method?: string | null
          name: string
          price: number
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          deleted?: boolean | null
          id?: number
          image?: string | null
          method?: string | null
          name?: string
          price?: number
          user_id?: string | null
        }
        Relationships: []
      }
      Test: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
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
      order_status: "waiting" | "processing" | "ready" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
