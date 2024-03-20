export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type OrderStatus = 'waiting' | 'ready' | 'finished'

export type Database = {
  public: {
    Tables: {
      Products: {
        Row: {
          id: number
          created_at: string
          Category: string | null
          Image: string | null
          Name: string
          Price: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          Category?: string | null
          Image?: string | null
          Name: string
          Price?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          Category?: string | null
          Image?: string | null
          Name?: string
          Price?: number | null
        }
        Relationships: []
      }

      Oders: {
        Row: {
          id: number
          created_at: string
          status: OrderStatus
          price: number | null
          customer_name?: string | null
          comment?: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          status?: OrderStatus
          price?: number | null
          customer_name?: string | null
          comment?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          status?: OrderStatus
          price?: number | null
          customer_name?: string | null
          comment?: string | null
        }
        Relationships: []
      }
      OrderItems: {
        Row: {
          id: number
          created_at: string
          order_id: number
          product_id: number
          quantity: number
          comment?: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          order_id?: number
          product_id?: number
          quantity?: number
          comment?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          order_id?: number
          product_id?: number
          quantity?: number
          comment?: string | null
        }
        Relationships: [
          {
            table: 'Orders'
            column: 'id'
            reference: 'order_id'
          },
          {
            table: 'Products'
            column: 'id'
            reference: 'product_id'
          },
        ]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
