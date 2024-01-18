import { Job, Queue } from 'bull';
import { Repository } from 'typeorm';
import { BullJobEntity } from './entities/job.entity';
import { JobTimeType } from './constants/job-time-type.enum';
import { GetListJobFilter } from './filters/get-list-job.filter';
export declare class JobService {
    private readonly jobRepository;
    private readonly injectedQueues;
    constructor(jobRepository: Repository<BullJobEntity>, injectedQueues: {
        [key: string]: Queue;
    });
    private getQueueByProcessorName;
    createJob(jobData: {
        processorName: any;
        time: number;
        timeType: JobTimeType;
        jobId?: string;
        data?: any;
        jobName?: string;
    }): Promise<Job>;
    getJob(options: {
        processorName: string;
        jobId: string;
    }): Promise<Partial<BullJobEntity>>;
    executeJob(options: {
        processorName: string;
        jobId: string;
        reExecute: boolean;
    }): Promise<false | Job<any>>;
    removeJob(options: {
        processorName: string;
        jobId: string;
    }): Promise<boolean>;
    destroyJob(options: {
        jobId: string;
    }): Promise<boolean>;
    getList(options: {
        filters: GetListJobFilter;
    }): Promise<{
        data: BullJobEntity[];
        length: number;
    }>;
    syncJobs(): Promise<boolean>;
    getQueueProcessNames(): Promise<string[]>;
}
