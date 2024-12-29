import { ApiManager } from './api-manager';
import { OrdersGroup } from '@/types/orders_group'; // Assuming you have an OrdersGroup type defined
import { RJSFSchema } from '@rjsf/utils';

export class OrdersGroupManager extends ApiManager {
    async getOrdersGroupSchema(): Promise<RJSFSchema> {
        const response = await this.api.get<RJSFSchema>(`/orders_groups/schema`);
        return response.data;
    }

    async getOrdersGroupsByUser(userId: number, skip = 0, limit = 100): Promise<OrdersGroup[]> {
        const response = await this.api.get<OrdersGroup[]>(`/orders_groups/?skip=${skip}&limit=${limit}&user=${userId}`);
        return response.data;
    }

    async getOrdersGroup(ordersGroupId: number): Promise<OrdersGroup> {
        const response = await this.api.get<OrdersGroup>(`/orders_groups/${ordersGroupId}/`);
        return response.data;
    }

    async deleteOrdersGroup(ordersGroupId: number): Promise<OrdersGroup> {
        const response = await this.api.delete<OrdersGroup>(`/orders_groups/${ordersGroupId}/`);
        return response.data;
    }

    async sendOrdersGroup(ordersGroupId: number): Promise<string> {
        const response = await this.api.post<string>(`/orders_groups/${ordersGroupId}/send`);
        return response.data;
    }
} 