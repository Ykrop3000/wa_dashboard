import { ApiManager } from '@/services/api-manager';
export const apiManager = new ApiManager(process.env.NEXT_PUBLIC_API_URL || 'http://45.88.104.179:3000/api/v1'); 