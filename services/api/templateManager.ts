import { FormContextType } from '@rjsf/utils';
import { RJSFSchema } from '@rjsf/utils';
import { ApiManager } from './api-manager';
import { Template, TemplatePeriodNotification } from '@/types/template';

export class TemplateManager extends ApiManager {
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
} 