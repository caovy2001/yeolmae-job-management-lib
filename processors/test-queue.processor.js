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
exports.TestQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const base_processor_1 = require("./base.processor");
let TestQueueProcessor = class TestQueueProcessor extends base_processor_1.BaseProcessor {
    constructor() {
        super();
    }
    async test(job) {
        try {
            await job.log('TEST JOB');
            let a = { b: 'c' };
            let d = a['e'].f;
        }
        catch (e) {
            this.jobLogger.log(job.id, e.stack);
        }
    }
};
exports.TestQueueProcessor = TestQueueProcessor;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestQueueProcessor.prototype, "test", null);
exports.TestQueueProcessor = TestQueueProcessor = __decorate([
    (0, bull_1.Processor)('test-queue'),
    __metadata("design:paramtypes", [])
], TestQueueProcessor);
//# sourceMappingURL=test-queue.processor.js.map