import { BullJobEntity } from './entities/job.entity';
import { Repository } from 'typeorm';
import { JobId } from 'bull';
export declare class JobLogger {
    private readonly jobRepository;
    constructor(jobRepository: Repository<BullJobEntity>);
    log(jobId: string | JobId, message: string): Promise<void>;
}
