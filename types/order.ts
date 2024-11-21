export interface Order {
    id: number;
    user_id: number;
    code: number
    status: string
    state: string
    phone?: string
    is_sended?: boolean
    // Add other order fields
} 