import { Job } from 'bull';
import { JobLogger } from '../job.logger';
export declare class BaseProcessor {
    private readonly jobRepository;
    protected jobLogger: JobLogger;
    constructor();
    protected onActive(job: Job): Promise<void>;
}
