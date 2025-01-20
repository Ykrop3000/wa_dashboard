
export interface OrdersCountPrice {
    date: string
    orders_count: number
    price: number
}

export interface AvgPrice {
    avg_price: number
}

export enum GroupStatuses {
    completed = "Выдан",
    cancelled = "Отменён",
    returned = "Возвращён",
}
