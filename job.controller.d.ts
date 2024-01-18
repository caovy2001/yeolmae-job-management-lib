import { JobService } from './job.service';
import { GetListJobFilter } from './index';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    checkConnect(): Promise<string>;
    getList(filters: GetListJobFilter): Promise<{
        data: import("./index").BullJobEntity[];
        length: number;
    }>;
    getById(processorName: string, jobId: string): Promise<Partial<import("./index").BullJobEntity>>;
    executeJob(processorName: string, jobId: string, reExecute: boolean): Promise<false | import("bull").Job<any>>;
    removeJob(processorName: string, jobId: string): Promise<boolean>;
    destroyJob(processorName: string, jobId: string): Promise<boolean>;
    getQueueProcessNames(): Promise<string[]>;
}
