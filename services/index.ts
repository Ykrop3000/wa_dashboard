import { ApiManager } from '@/services/api-manager';
export const apiManager = new ApiManager(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'); 