export interface Template {
    id: number;
    user_id: number;
    state: string;
    status: string,
    template: string;
    // Add other template fields
}
export interface TemplatePeriodNotification extends Template {
    start: number
    end: number
} 