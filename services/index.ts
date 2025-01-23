import { ApiManager } from '@/services/api-manager';
export const apiManager = new ApiManager(process.env.NEXT_PUBLIC_API_URL || 'http://67.220.71.130:3000/api/v1'); 