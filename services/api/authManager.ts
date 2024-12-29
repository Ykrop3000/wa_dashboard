import { ApiManager } from './api-manager';
import { User } from '@/types/user'; // Assuming you have a User type defined

export class AuthManager extends ApiManager {
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