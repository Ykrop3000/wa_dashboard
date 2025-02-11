import { ApiManager } from '@/services/api-manager';
// 'http://67.220.71.130:3000/api/v1'
export const apiManager = new ApiManager(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'); 