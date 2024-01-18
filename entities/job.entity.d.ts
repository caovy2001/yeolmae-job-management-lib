export declare class BullJobEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    processorName: string;
    jobId: string;
    jobName: string;
    executeTime: Date;
    data: any;
    isExecuted: boolean;
    isDestroyed: boolean;
    logs?: string;
}
