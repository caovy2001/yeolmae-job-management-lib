"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobUtil = void 0;
class JobUtil {
    static generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
exports.JobUtil = JobUtil;
//# sourceMappingURL=job.utils.js.map