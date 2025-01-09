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
      AppData: {
        Row: {
          created_at: string
          description: string | null
          id: number
          key: string
          last_edit: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          key?: string
          last_edit?: string
          value?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          key?: string
          last_edit?: string
          value?: string
        }
        Relationships: []
      }
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
      Expense: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          price: number
          purchase_date: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          price: number
          purchase_date?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          price?: number
          purchase_date?: string
        }
        Relationships: []
      }
      Inventory: {
        Row: {
          category: string
          comment: string | null
          created_at: string
          deleted: boolean
          id: number
          name: string
          quantity: number
          unit: string
          warning: number | null
        }
        Insert: {
          category: string
          comment?: string | null
          created_at?: string
          deleted?: boolean
          id?: number
          name: string
          quantity?: number
          unit: string
          warning?: number | null
        }
        Update: {
          category?: string
          comment?: string | null
          created_at?: string
          deleted?: boolean
          id?: number
          name?: string
          quantity?: number
          unit?: string
          warning?: number | null
        }
        Relationships: []
      }
      InventoryCategories: {
        Row: {
          category: string
          created_at: string
          id: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      OrderItems: {
        Row: {
          comment: string | null
          created_at: string
          extras: Json[]
          finished: boolean
          id: number
          option: Json | null
          order_id: number
          product_id: number
          product_name: string
          product_price: number
          quantity: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          extras?: Json[]
          finished?: boolean
          id?: number
          option?: Json | null
          order_id: number
          product_id: number
          product_name: string
          product_price: number
          quantity: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          extras?: Json[]
          finished?: boolean
          id?: number
          option?: Json | null
          order_id?: number
          product_id?: number
          product_name?: string
          product_price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: 'public_OrderItems_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'Orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_OrderItems_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'Products'
            referencedColumns: ['id']
          },
        ]
      }
      Orders: {
        Row: {
          categories: string[]
          comment: string | null
          created_at: string
          custom_price: boolean
          customer_name: string | null
          id: number
          order_number: string
          payment_method: string
          price: number
          product_ids: string[]
          status: Database['public']['Enums']['order_status']
          table_number: string | null
          user_id: string | null
        }
        Insert: {
          categories: string[]
          comment?: string | null
          created_at?: string
          custom_price?: boolean
          customer_name?: string | null
          id?: number
          order_number: string
          payment_method: string
          price: number
          product_ids: string[]
          status: Database['public']['Enums']['order_status']
          table_number?: string | null
          user_id?: string | null
        }
        Update: {
          categories?: string[]
          comment?: string | null
          created_at?: string
          custom_price?: boolean
          customer_name?: string | null
          id?: number
          order_number?: string
          payment_method?: string
          price?: number
          product_ids?: string[]
          status?: Database['public']['Enums']['order_status']
          table_number?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Printers: {
        Row: {
          categories: string[]
          created_at: string
          id: number
          ip: string
          name: string
          port: string
          print_for: string[]
        }
        Insert: {
          categories: string[]
          created_at?: string
          id?: number
          ip: string
          name: string
          port: string
          print_for?: string[]
        }
        Update: {
          categories?: string[]
          created_at?: string
          id?: number
          ip?: string
          name?: string
          port?: string
          print_for?: string[]
        }
        Relationships: []
      }
      ProductCategories: {
        Row: {
          category: string
          created_at: string
          id: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      Products: {
        Row: {
          advertisement: boolean
          category: string
          consumption: Json[] | null
          created_at: string
          deleted: boolean | null
          description: string | null
          extras: Json[]
          id: number
          image: string | null
          images: string[] | null
          method: string | null
          name: string
          only_advertisement_screen: boolean
          options: Json[]
          paused: boolean
          price: number
          short_description: string | null
          show_consumption: boolean
          stock: number | null
          user_id: string | null
        }
        Insert: {
          advertisement?: boolean
          category: string
          consumption?: Json[] | null
          created_at?: string
          deleted?: boolean | null
          description?: string | null
          extras?: Json[]
          id?: number
          image?: string | null
          images?: string[] | null
          method?: string | null
          name: string
          only_advertisement_screen?: boolean
          options?: Json[]
          paused?: boolean
          price: number
          short_description?: string | null
          show_consumption?: boolean
          stock?: number | null
          user_id?: string | null
        }
        Update: {
          advertisement?: boolean
          category?: string
          consumption?: Json[] | null
          created_at?: string
          deleted?: boolean | null
          description?: string | null
          extras?: Json[]
          id?: number
          image?: string | null
          images?: string[] | null
          method?: string | null
          name?: string
          only_advertisement_screen?: boolean
          options?: Json[]
          paused?: boolean
          price?: number
          short_description?: string | null
          show_consumption?: boolean
          stock?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      Profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      Test: {
        Row: {
          age: number | null
          created_at: string
          id: number
          info: Json | null
          name: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          id?: number
          info?: Json | null
          name?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          id?: number
          info?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      UserActions: {
        Row: {
          action: Json
          created_at: string
          email: string
          id: number
          name: string | null
          short_description: string
          user_id: string | null
        }
        Insert: {
          action: Json
          created_at?: string
          email: string
          id?: number
          name?: string | null
          short_description: string
          user_id?: string | null
        }
        Update: {
          action?: Json
          created_at?: string
          email?: string
          id?: number
          name?: string | null
          short_description?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      get_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          raw_user_meta_data: Json
        }[]
      }
      update_single_user: {
        Args: {
          user_id: string
          name: string
          user_role: string
        }
        Returns: undefined
      }
    }
    Enums: {
      order_status: 'waiting' | 'processing' | 'ready' | 'finished'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
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
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
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
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
