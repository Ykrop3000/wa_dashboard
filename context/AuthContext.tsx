import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiManager } from '@/services';
import { User } from '@/types/user';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<User>;
    logout: () => void;
    register: (userData: Omit<User, 'id'>) => Promise<void>;
    getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUser = await apiManager.getMe();
                setUser(currentUser);
            } catch (error) {
                logout()
                router.push('/login')
                console.error('Failed to fetch current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    const login = async (username: string, password: string) => {
        await apiManager.login(username, password);
        const currentUser = await apiManager.getMe();
        setUser(currentUser);
        return currentUser
    };

    const logout = () => {
        apiManager.removeToken();
        setUser(null);
        router.push('/login')
    };

    const register = async (userData: Omit<User, 'id'>) => {
        await apiManager.register(userData);
    };

    const getCurrentUser = async () => {
        const currentUser = await apiManager.getCurrentUser();
        setUser(currentUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, getCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 