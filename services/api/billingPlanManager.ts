import { FormContextType } from '@rjsf/utils';
import { RJSFSchema } from '@rjsf/utils';
import { ApiManager } from './api-manager';
import { BillingPlan } from '@/types/billing_plan';

export class BillingPlanManager extends ApiManager {
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
} 