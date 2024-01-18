import { Provider } from '@nestjs/common';
import { Queue } from 'bull';
export declare const InjectedQueues = "InjectedQueues";
export declare const InjectedQueuesProvider: Provider<{
    [key: string]: Queue;
}>;
