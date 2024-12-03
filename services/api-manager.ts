import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';
import { FormContextType, RJSFSchema } from '@rjsf/utils';

import { User } from '@/types/user';
import { Order } from '@/types/order';
import { Template, TemplatePeriodNotification } from '@/types/template';

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
            return config;
        });
        this.api.interceptors.response.use((response) => response, (error) => {
            if (error.response.status === 401) {
                redirect('/login');
            }
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

    async updateUser(userId: number, userData: Partial<User>): Promise<User> {
        const response = await this.api.put<User>(`/users/${userId}`, userData);
        return response.data;
    }

    async deleteUser(userId: number): Promise<User> {
        const response = await this.api.delete<User>(`/users/${userId}`);
        return response.data;
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

    async createTemplatePeriodNotification(userId: number, templateData: Omit<TemplatePeriodNotification, 'id' | 'user_id'>): Promise<TemplatePeriodNotification> {
        const response = await this.api.post<TemplatePeriodNotification>(`/users/${userId}/period_notification/`, templateData);
        return response.data;
    }
    async createTemplate(userId: number, templateData: Omit<Template, 'id' | 'user_id'>): Promise<Template> {
        const response = await this.api.post<Template>(`/users/${userId}/templates/`, templateData);
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

    async updateTemplate(templateId: number, templateData: Partial<Template>): Promise<User> {
        const response = await this.api.put<User>(`/templates/${templateId}`, templateData);
        return response.data;
    }

    // Order endpoints
    async createOrder(userId: number, orderData: Omit<Order, 'id' | 'user_id'>): Promise<Order> {
        const response = await this.api.post<Order>(`/users/${userId}/orders/`, orderData);
        return response.data;
    }

    async getOrders(userId: number, skip = 0, limit = 100): Promise<Order[]> {
        const response = await this.api.get<Order[]>(`/users/${userId}/orders/?skip=${skip}&limit=${limit}`);
        return response.data;
    }

    async getOrdersByCode(userId: number, code: string, skip = 0, limit = 100): Promise<Order[]> {
        const response = await this.api.get<Order[]>(`/users/${userId}/orders/?code=${code}&skip=${skip}&limit=${limit}`);
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
}