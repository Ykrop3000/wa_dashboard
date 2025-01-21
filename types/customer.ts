export interface Customer {
    id: number
    name: string
    phone: string
    first_name: string
    last_name: string
    total_spent?: number
    orders_count?: number
}