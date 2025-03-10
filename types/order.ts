import { Customer } from "./customer";

export interface Order {
    id: number;
    user_id: number
    code: number
    status: string
    state: string
    state_status: string
    phone?: string
    is_sended?: boolean
    created_at?: Date;

    review_id?: number
    customer?: Customer
} 