"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./entities/job.entity");
const job_time_type_enum_1 = require("./constants/job-time-type.enum");
const uuid_1 = require("uuid");
const job_utils_1 = require("./utils/job.utils");
const injected_queues_provider_1 = require("./providers/injected-queues.provider");
const job_error_const_1 = require("./constants/job-error.const");
let JobService = class JobService {
    constructor(jobRepository, injectedQueues) {
        this.jobRepository = jobRepository;
        this.injectedQueues = injectedQueues;
    }
    getQueueByProcessorName(options) {
        return this.injectedQueues[options.processorName];
    }
    async createJob(jobData) {
        const queue = this.getQueueByProcessorName({
            processorName: jobData.processorName,
        });
        if (!queue) {
            throw new Error(job_error_const_1.JobErrorConsts.PROCESSOR_NAME_NOT_FOUND);
        }
        const jobId = jobData.jobId ? jobData.jobId : (0, uuid_1.v4)();
        const _countExist = await this.jobRepository
            .createQueryBuilder('job')
            .where('job.jobId = :jobId', { jobId })
            .getCount();
        if (_countExist > 0) {
            throw new Error(job_error_const_1.JobErrorConsts.JOB_ID_EXISTED);
        }
        let delayTime = 0;
        if (jobData.timeType === job_time_type_enum_1.JobTimeType.DELAY) {
            delayTime = jobData.time;
        }
        else {
            delayTime = jobData.time - new Date().getTime();
            if (delayTime < 0) {
                delayTime = 0;
            }
        }
        let job = null;
        if (jobData.jobName) {
            job = await queue.add(jobData.jobName, jobData.data, {
                delay: delayTime,
                removeOnComplete: false,
                removeOnFail: false,
                jobId: jobId,
            });
        }
        else {
            job = await queue.add(jobData.data, {
                delay: delayTime,
                removeOnComplete: false,
                removeOnFail: false,
                jobId: jobId,
            });
        }
        const jobEntity = {
            id: null,
            createdAt: new Date(job.opts.timestamp),
            updatedAt: new Date(job.opts.timestamp),
            processorName: jobData.processorName,
            jobId: jobId,
            jobName: jobData.jobName ? jobData.jobName : '__default__',
            executeTime: new Date(job.opts.timestamp + job.opts.delay),
            data: jobData.data,
            isExecuted: delayTime !== 0 ? false : true,
            isDestroyed: false,
        };
        await this.jobRepository.save(jobEntity);
        return job;
    }
    async getJob(options) {
        const processorName = options.processorName;
        const jobId = options.jobId;
        const queue = this.getQueueByProcessorName({ processorName });
        if (!queue) {
            throw new Error(job_error_const_1.JobErrorConsts.PROCESSOR_NAME_NOT_FOUND);
        }
        let job = await queue.getJob(jobId);
        let jobEntity = await this.jobRepository
            .createQueryBuilder('job')
            .select()
            .where('job.jobId = :jobId', { jobId })
            .getOne();
        if (!job && !jobEntity) {
            throw new Error(job_error_const_1.JobErrorConsts.JOB_NOT_FOUND);
        }
        if (job) {
            const currentTimeLong = new Date().getTime();
            return {
                jobId: job.id,
                processorName: processorName,
                jobName: job.name,
                executeTime: new Date(job.timestamp + job.opts.delay),
                data: job.data,
                isExecuted: currentTimeLong < job.timestamp + job.opts.delay,
            };
        }
        return jobEntity;
    }
    async executeJob(options) {
        const processorName = options.processorName;
        const jobId = options.jobId;
        const reExecute = options.reExecute !== null ? options.reExecute : false;
        const jobEntity = await this.jobRepository
            .createQueryBuilder('job')
            .select()
            .where('job.jobId = :jobId', { jobId })
            .getOne();
        if (!jobEntity) {
            return false;
        }
        if (jobEntity.isExecuted && !reExecute) {
            throw new Error('Job executed');
        }
        const queue = this.getQueueByProcessorName({ processorName });
        if (!reExecute) {
            await queue.removeJobs(jobId);
            await this.jobRepository.delete({ id: jobEntity.id });
        }
        return await this.createJob({
            processorName: processorName,
            jobName: jobEntity.jobName,
            time: 0,
            timeType: job_time_type_enum_1.JobTimeType.DELAY,
            data: jobEntity.data,
            jobId: reExecute
                ? jobEntity.jobId + `-re-execute-${job_utils_1.JobUtil.generateRandomString(4)}`
                : jobEntity.jobId,
        });
    }
    async removeJob(options) {
        const processorName = options.processorName;
        const jobId = options.jobId;
        const jobEntity = await this.jobRepository
            .createQueryBuilder('job')
            .select()
            .where('job.jobId = :jobId', { jobId })
            .getOne();
        if (!jobEntity) {
            throw new Error(job_error_const_1.JobErrorConsts.JOB_NOT_FOUND);
        }
        const queue = this.getQueueByProcessorName({ processorName });
        await queue.removeJobs(jobId);
        await this.jobRepository.delete({ id: jobEntity.id });
        return true;
    }
    async destroyJob(options) {
        const jobId = options.jobId;
        const jobEntity = await this.jobRepository
            .createQueryBuilder('job')
            .select()
            .where('job.jobId = :jobId', { jobId })
            .getOne();
        if (!jobEntity) {
            throw new Error(job_error_const_1.JobErrorConsts.JOB_NOT_FOUND);
        }
        if (jobEntity.isExecuted) {
            throw new Error(job_error_const_1.JobErrorConsts.JOB_EXECUTED);
        }
        await this.jobRepository.update({ id: jobEntity.id }, { isDestroyed: true });
        return true;
    }
    async getList(options) {
        const filters = options.filters;
        let queryBuilder = this.jobRepository
            .createQueryBuilder('job')
            .orderBy('job.executeTime', 'DESC')
            .select();
        if (filters.processorName) {
            queryBuilder.andWhere('(job.processorName = :processorName)', {
                processorName: filters.processorName,
            });
        }
        if (filters.isExecuted != null) {
            queryBuilder.andWhere('(job.isExecuted = :isExecuted)', {
                isExecuted: filters.isExecuted === 'true' ? 1 : 0,
            });
        }
        if (filters.isDestroyed != null) {
            queryBuilder.andWhere('(job.isDestroyed = :isDestroyed)', {
                isDestroyed: filters.isDestroyed === 'true' ? 1 : 0,
            });
        }
        if (filters.keyword) {
            queryBuilder.andWhere('(job.data LIKE :keyword OR job.logs LIKE :keyword OR job.jobId LIKE :keyword OR job.jobName LIKE :keyword)', {
                keyword: `%${filters.keyword}%`,
            });
        }
        const { limit, offset } = filters;
        let _count = await queryBuilder.getCount();
        if (_count == 0) {
            return {
                data: [],
                length: 0,
            };
        }
        queryBuilder.skip(Number(offset) || 0).take(Number(limit) || 10);
        let data = await queryBuilder.getMany();
        return {
            data,
            length: _count,
        };
    }
    async syncJobs() {
        for (let queueName of Object.keys(this.injectedQueues)) {
            const queue = this.getQueueByProcessorName({ processorName: queueName });
            const jobs = await queue.getDelayed();
            for (const job of jobs) {
                const jobEntity = await this.jobRepository
                    .createQueryBuilder('job')
                    .where('jobId = :jobId', { jobId: job.id })
                    .getOne();
                if (!jobEntity) {
                    const jobEntity = {
                        id: null,
                        createdAt: new Date(job.timestamp),
                        updatedAt: new Date(job.timestamp),
                        processorName: queueName,
                        jobId: job.id,
                        jobName: job.name,
                        executeTime: new Date(job.timestamp + job.opts.delay),
                        data: job.data,
                        isExecuted: new Date(job.timestamp + job.opts.delay) > new Date()
                            ? false
                            : true,
                        isDestroyed: false,
                    };
                    await this.jobRepository.save(jobEntity);
                }
            }
        }
        return true;
    }
    async getQueueProcessNames() {
        return Object.keys(this.injectedQueues);
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.BullJobEntity)),
    __param(1, (0, common_1.Inject)(injected_queues_provider_1.InjectedQueues)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], JobService);
//# sourceMappingURL=job.service.js.map