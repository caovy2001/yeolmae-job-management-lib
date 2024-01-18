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
exports.JobController = void 0;
const common_1 = require("@nestjs/common");
const job_service_1 = require("./job.service");
const index_1 = require("./index");
let JobController = class JobController {
    constructor(jobService) {
        this.jobService = jobService;
    }
    async checkConnect() {
        return 'Successfully!';
    }
    async getList(filters) {
        return await this.jobService.getList({ filters });
    }
    async getById(processorName, jobId) {
        return await this.jobService.getJob({ processorName, jobId });
    }
    async executeJob(processorName, jobId, reExecute) {
        return await this.jobService.executeJob({
            processorName,
            jobId,
            reExecute,
        });
    }
    async removeJob(processorName, jobId) {
        return await this.jobService.removeJob({ processorName, jobId });
    }
    async destroyJob(processorName, jobId) {
        return await this.jobService.destroyJob({ jobId });
    }
    async getQueueProcessNames() {
        return await this.jobService.getQueueProcessNames();
    }
};
exports.JobController = JobController;
__decorate([
    (0, common_1.Post)('/check-connect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobController.prototype, "checkConnect", null);
__decorate([
    (0, common_1.Get)('get-list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.GetListJobFilter]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)('/:processorName/:jobId'),
    __param(0, (0, common_1.Param)('processorName')),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)('execute/:processorName/:jobId'),
    __param(0, (0, common_1.Param)('processorName')),
    __param(1, (0, common_1.Param)('jobId')),
    __param(2, (0, common_1.Query)('reExecute')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "executeJob", null);
__decorate([
    (0, common_1.Delete)('delete/:processorName/:jobId'),
    __param(0, (0, common_1.Param)('processorName')),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "removeJob", null);
__decorate([
    (0, common_1.Post)('destroy/:processorName/:jobId'),
    __param(0, (0, common_1.Param)('processorName')),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "destroyJob", null);
__decorate([
    (0, common_1.Get)('/get-queue-process-names'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobController.prototype, "getQueueProcessNames", null);
exports.JobController = JobController = __decorate([
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [job_service_1.JobService])
], JobController);
//# sourceMappingURL=job.controller.js.map