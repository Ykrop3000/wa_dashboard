import { User } from '@/types/user';
import axios, { AxiosInstance } from 'axios';

export class ApiManager {
    protected api: AxiosInstance;
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
    }

    // Token management methods

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
}