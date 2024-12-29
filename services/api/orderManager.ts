import { FormContextType } from '@rjsf/utils';
import { ApiManager } from './api-manager';
import { Order } from '@/types/order';

export class OrderManager extends ApiManager {
    async createOrder(userId: number, orderData: FormContextType): Promise<Order> {
        const response = await this.api.post<Order>(`/users/${userId}/orders/`, orderData);
        return response.data;
    }

    async getOrders(userId: number, skip = 0, limit = 100, group: number | string | null = null): Promise<Order[]> {
        let url = `/orders/?skip=${skip}&limit=${limit}&user_id=${userId}`
        url = group ? url + `&group_id=${group}` : url
        const response = await this.api.get<Order[]>(url);
        return response.data;
    }

    async getOrderByCode(userId: number, code: string, skip = 0, limit = 100): Promise<Order[]> {
        const response = await this.api.get<Order[]>(`/orders/code/${code}?skip=${skip}&limit=${limit}&user_id=${userId}`);
        return response.data;
    }
} 