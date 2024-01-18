import { BaseProcessor } from './base.processor';
import { Job } from 'bull';
export declare class TestQueueProcessor extends BaseProcessor {
    constructor();
    test(job: Job): Promise<void>;
}
