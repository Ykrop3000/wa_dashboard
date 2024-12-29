import { ApiManager } from '@/services/api/api-manager';
import { FormContextType, RJSFSchema } from '@rjsf/utils';
import { User } from '@/types/user';

export class UserManager extends ApiManager {
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
} 