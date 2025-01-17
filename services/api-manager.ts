import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';
import { FormContextType, RJSFSchema } from '@rjsf/utils';

import { User } from '@/types/user';
import { Order } from '@/types/order';
import { Template, TemplatePeriodNotification } from '@/types/template';
import { OrdersGroup } from '@/types/orders_group';
import { BillingPlan } from '@/types/billing_plan';
import { TaskStatus } from '@/types/task'
import { OrdersCountPrice } from '@/types/statistic';

export class ApiManager {
    private api: AxiosInstance;
    private token: string | null = null;
    me: User | null = null;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Load token from local storage only in the browser
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }

        this.api.interceptors.request.use((config) => {
            if (this.token) {
                config.headers['Authorization'] = `Bearer ${this.token}`;
            }
            // if (config.data && typeof config.data === 'object') {
            //     config.data = Object.fromEntries(
            //         Object.entries(config.data).map(([key, value]) => [
            //             key,
            //             value === undefined ? null : value,
            //         ])
            //     );
            // }
            console.log(config)
            return config;
        });
        this.api.interceptors.response.use((response) => response, (error) => {
            if (error.response.status === 401) {
                redirect('/login');
            }
            if (error.response.status === 422) {
                const validationErrors = error.response.data.detail;
                if (Array.isArray(validationErrors)) {
                    return Promise.reject(validationErrors.map((err) => ({
                        location: err.loc.join('.'),
                        message: err.msg,
                        context: err.ctx || {},
                    })));
                }
            }

            return Promise.reject(error);
        });
    }


    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }
    removeToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
        }
    }

    getCurrentUser(): User | null {
        return this.me;
    }

    setCurrentUser(user: User | null) {
        this.me = user
    }

    // User endpoints
    async createUser(userData: FormContextType): Promise<User> {
        const response = await this.api.post<User>('/users/', userData);
        return response.data;
    }

    async getUsers(skip = 0, limit = 100): Promise<User[]> {
        const response = await this.api.get<User[]>(`/users/?skip=${skip}&limit=${limit}`);
        return response.data;
    }

    async getUserSchema(): Promise<RJSFSchema> {
        const response = await this.api.get<RJSFSchema>(`/users/schema`);
        return response.data;
    }

    async getUser(userId: number): Promise<User> {
        const response = await this.api.get<User>(`/users/${userId}`);
        return response.data;
    }

    async updateUser(userId: number, userData: FormContextType): Promise<User> {
        console.log(userData)
        const response = await this.api.patch<User>(`/users/${userId}`, userData);
        return response.data;
    }

    async deleteUser(userId: number): Promise<User> {
        const response = await this.api.delete<User>(`/users/${userId}`);
        return response.data;
    }

    async bindWhatsapp(userId: number): Promise<string> {
        const response = await this.api.post<string>(`/users/${userId}/bind_whatsapp`);
        return response.data
    }
    async getCode(userId: number): Promise<string> {
        const response = await this.api.post<string>(`/users/${userId}/whatsapp_code`);
        return response.data
    }
    async getQR(userId: number): Promise<string> {
        const response = await this.api.post<string>(`/users/${userId}/whatsapp_qr`);
        return response.data
    }

    // Template endpoints
    async getTemplateSchema(): Promise<RJSFSchema> {
        const response = await this.api.get<RJSFSchema>(`/templates/schema`);
        return response.data;
    }

    async getTemplateNotifiSchema(): Promise<RJSFSchema> {
        const response = await this.api.get<RJSFSchema>(`/templates/period_notification/schema`);
        return response.data;
    }

    async createTemplatePeriodNotification(userId: number, templateData: FormContextType): Promise<TemplatePeriodNotification> {
        const response = await this.api.post<TemplatePeriodNotification>(`/users/${userId}/period_notification/`, templateData);
        return response.data;
    }
    async createTemplate(userId: number, templateData: FormContextType): Promise<Template> {
        const response = await this.api.post<Template>(`/users/${userId}/templates/`, templateData);
        return response.data;
    }
    async deleteTemplate(templateId: number): Promise<Template> {
        const response = await this.api.delete<Template>(`/templates/${templateId}`);
        return response.data;
    }

    async getTemplates(userId: number): Promise<Template[]> {
        const response = await this.api.get<Template[]>(`/users/${userId}/templates/`);
        return response.data;
    }

    async getTemplate(templateId: number): Promise<Template> {
        const response = await this.api.get<Template>(`/templates/${templateId}/`);
        return response.data;
    }

    async updateTemplate(templateId: number, templateData: FormContextType): Promise<Template> {
        const response = await this.api.patch<Template>(`/templates/${templateId}`, templateData);
        return response.data;
    }

    // Order endpoints
    async createOrder(userId: number, orderData: Omit<Order, 'id' | 'user_id'>): Promise<Order> {
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

    // Orders groups endpoints
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
        const response = await this.api.delete<OrdersGroup>(`/orders_groups/${ordersGroupId}/`)
        return response.data
    }
    async sendOrdersGroup(ordersGroupId: number): Promise<string> {
        const response = await this.api.post<string>(`/orders_groups/${ordersGroupId}/send`);
        return response.data;
    }


    // Auth endpoints
    async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await this.api.post<{ access_token: string; token_type: string }>('/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        this.setToken(response.data.access_token);
        return response.data;
    }

    async register(userData: Omit<User, 'id'>): Promise<User> {
        const response = await this.api.post<User>('/register', userData);
        return response.data;
    }

    async getMe(): Promise<User> {
        const response = await this.api.get<User>('/users/me');
        if (typeof window !== 'undefined') {
            localStorage.setItem('role', response.data.role);
        }
        this.me = response.data;
        return response.data;
    }

    // Task endpoints
    async getTaskStatus(task_id: string): Promise<TaskStatus> {
        const response = await this.api.post(`/tasks/status/${task_id}`)
        return response.data
    }
    async stopTask(task_id: string): Promise<TaskStatus> {
        const response = await this.api.post(`/tasks/status/${task_id}/stop`)
        return response.data
    }

    // Billing plans
    async getBillingPlanSchema(): Promise<RJSFSchema> {
        const response = await this.api.get<RJSFSchema>(`/billing_plans/schema`);
        return response.data;
    }

    async getBillingPlan(userId: number): Promise<BillingPlan> {
        const response = await this.api.get<BillingPlan>(`/billing_plans/${userId}`);
        return response.data;
    }
    async getBillingPlans(skip = 0, limit = 100): Promise<BillingPlan[]> {
        const response = await this.api.get<BillingPlan[]>(`/billing_plans/?skip=${skip}&limit=${limit}`);
        return response.data;
    }

    async updateBillingPlan(userId: number, billingPlanData: Partial<BillingPlan>): Promise<BillingPlan> {
        const response = await this.api.patch<BillingPlan>(`/billing_plans/${userId}`, billingPlanData);
        return response.data;
    }
    async createBillingPlan(billingPlanData: FormContextType): Promise<BillingPlan> {
        const response = await this.api.post<BillingPlan>('/billing_plans/', billingPlanData);
        return response.data;
    }
    async deleteBillingPlan(userId: number): Promise<BillingPlan> {
        const response = await this.api.delete<BillingPlan>(`/billing_plans/${userId}`);
        return response.data;
    }


    // Stat endpoints
    async getOrdersCountPriceStatistics(user_id: number,
        startDate: number = Math.ceil(Date.now() / 1000) - 60 * 60 * 24 * 30,
        endDate: number = Math.ceil(Date.now() / 1000)): Promise<OrdersCountPrice[]> {
        const response = await this.api.post<OrdersCountPrice[]>(`/stat/orders?user_id=${user_id}`, {
            start_date: startDate,
            end_date: endDate,
        });
        return response.data;
    }

}