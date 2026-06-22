"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VelixClient = void 0;
const axios_1 = __importDefault(require("axios"));
class VelixClient {
    constructor(config) {
        this.http = axios_1.default.create({
            baseURL: config.apiUrl,
            timeout: config.timeout ?? 10000,
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
}
exports.VelixClient = VelixClient;
