import { ApiManager } from './api-manager';
import { TaskStatus } from '@/types/task';

export class TaskManager extends ApiManager {
    async getTaskStatus(task_id: string): Promise<TaskStatus> {
        const response = await this.api.post(`/tasks/status/${task_id}`)
        return response.data
    }
} 