import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class JobModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
    static forRoot(options: {
        redisConfig?: {
            port?: number;
            host?: string;
            db?: number;
            password?: string;
        };
        queueProcessorNames: string[];
    }): DynamicModule;
}
