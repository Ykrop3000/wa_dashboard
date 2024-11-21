import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';

import { User } from '@/types/user';
import { Order } from '@/types/order';
import { Template } from '@/types/template';

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

        // Load token from local storage
        this.token = localStorage.getItem('token');

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
        localStorage.setItem('token', token);
    }

    getCurrentUser(): User | null {
        return this.me
    }

    // User endpoints
    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        const response = await this.api.post<User>('/users/', userData);
        return response.data;
    }

    async getUsers(skip = 0, limit = 100): Promise<User[]> {
        const response = await this.api.get<User[]>(`/users/?skip=${skip}&limit=${limit}`);
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
        localStorage.setItem('role', response.data.role)
        this.me = response.data
        return response.data;
    }
}