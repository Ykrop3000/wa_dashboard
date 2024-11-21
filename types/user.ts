import { Template } from '@/types/template';
import { Order } from '@/types/order';

export interface User {
    id: number;
    name: string;
    phone: string;
    username: string;
    role: string;

    // Notification time range
    start_notification_time?: number;
    end_notification_time?: number;

    // Categories
    include_category?: string[];
    exclude_category?: string[];

    // Telegram fields
    telegram_id?: number;
    telegram_password?: string;

    // Kaspi fields
    kaspi_username?: string;
    kaspi_password?: string;
    kaspi_api_key?: string;

    // Green-api fields
    green_api_instance_id?: string;
    green_api_instance_token?: string;
    green_api_url?: string;
    green_api_media_url?: string;

    // Status fields
    authorized?: boolean;
    disable?: boolean;
    test?: boolean;

    // Additional fields
    limit_messages_per_day?: number;
    count_messages_sent?: number;

    // Relationships
    message_templates?: Template[];
    orders?: Order[];
}

// For creating a new user
export interface CreateUserDto {
    name: string;
    phone: string;
    username: string;
    role: string;
    password: string;
    include_category?: string[];
    exclude_category?: string[];
    telegram_password?: string;
    kaspi_username?: string;
    kaspi_password?: string;
    kaspi_api_key?: string;
    green_api_instance_id?: string;
    green_api_instance_token?: string;
    green_api_url?: string;
    green_api_media_url?: string;
}

// For updating a user
export interface UpdateUserDto extends Partial<CreateUserDto> {
    authorized?: boolean;
    disable?: boolean;
    test?: boolean;
    start_notification_time?: number;
    end_notification_time?: number;
}

// Response type
export interface UserResponse {
    success: boolean;
    data: User;
    message?: string;
}

// List response type
export interface UserListResponse {
    success: boolean;
    data: User[];
    total: number;
    message?: string;
} 