"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JobModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const job_controller_1 = require("./job.controller");
const job_service_1 = require("./job.service");
const bull_1 = require("@nestjs/bull");
const injected_queues_provider_1 = require("./providers/injected-queues.provider");
const base_processor_1 = require("./processors/base.processor");
const test_queue_processor_1 = require("./processors/test-queue.processor");
const job_entity_1 = require("./entities/job.entity");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const job_logger_1 = require("./job.logger");
let JobModule = JobModule_1 = class JobModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes('*');
    }
    static forRoot(options) {
        return {
            module: JobModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forFeature([job_entity_1.BullJobEntity]),
                bull_1.BullModule.forRoot({
                    redis: {
                        port: options.redisConfig?.port ?? 6379,
                        host: options.redisConfig?.host ?? 'localhost',
                        db: options.redisConfig?.db ?? 0,
                        password: options.redisConfig?.password ?? null,
                    },
                }),
                bull_1.BullModule.registerQueue({
                    name: 'test-queue',
                }),
                ...options.queueProcessorNames.map((queueName) => {
                    return bull_1.BullModule.registerQueue({
                        name: queueName,
                    });
                }),
            ],
            controllers: [job_controller_1.JobController],
            providers: [
                job_service_1.JobService,
                injected_queues_provider_1.InjectedQueuesProvider,
                job_logger_1.JobLogger,
                base_processor_1.BaseProcessor,
                test_queue_processor_1.TestQueueProcessor,
            ],
            exports: [
                job_service_1.JobService,
                injected_queues_provider_1.InjectedQueuesProvider,
                ...options.queueProcessorNames.map((queueName) => {
                    return bull_1.BullModule.registerQueue({
                        name: queueName,
                    });
                }),
                typeorm_1.TypeOrmModule.forFeature([job_entity_1.BullJobEntity]),
                job_logger_1.JobLogger,
            ],
        };
    }
};
exports.JobModule = JobModule;
exports.JobModule = JobModule = JobModule_1 = __decorate([
    (0, common_1.Module)({})
], JobModule);
//# sourceMappingURL=job.module.js.map