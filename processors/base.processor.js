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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProcessor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const job_entity_1 = require("../entities/job.entity");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const job_logger_1 = require("../job.logger");
class BaseProcessor {
    constructor() { }
    async onActive(job) {
        common_1.Logger.log(`Processing job ${job.id} ...`);
        await this.jobRepository.update({ jobId: job.id.toString(), isExecuted: false, isDestroyed: false }, { isExecuted: true });
    }
}
exports.BaseProcessor = BaseProcessor;
__decorate([
    (0, typeorm_1.InjectRepository)(job_entity_1.BullJobEntity),
    __metadata("design:type", typeorm_2.Repository)
], BaseProcessor.prototype, "jobRepository", void 0);
__decorate([
    (0, common_1.Inject)(job_logger_1.JobLogger),
    __metadata("design:type", job_logger_1.JobLogger)
], BaseProcessor.prototype, "jobLogger", void 0);
__decorate([
    (0, bull_1.OnQueueActive)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseProcessor.prototype, "onActive", null);
//# sourceMappingURL=base.processor.js.map