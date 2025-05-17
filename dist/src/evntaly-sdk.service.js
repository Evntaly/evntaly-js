"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvntalySDKService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const package_json_1 = require("../package.json");
let EvntalySDKService = class EvntalySDKService {
    constructor() {
        this.BASE_URL = 'https://app.evntaly.com/prod';
        this.developerSecret = null;
        this.projectToken = null;
        this.trackingEnabled = true;
    }
    init(developerSecret, projectToken) {
        this.developerSecret = developerSecret;
        this.projectToken = projectToken;
        console.log('Evntaly SDK initialized with secret and token.');
    }
    async checkLimit() {
        try {
            if (!this.developerSecret) {
                throw new Error('Developer secret not set. Please call init() first.');
            }
            const url = `${this.BASE_URL}/api/v1/account/check-limits/${this.developerSecret}`;
            console.info("🔍 Checking API usage limits...");
            const response = await axios_1.default.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const { limitReached } = response.data;
            console.info(`✅ API Limit Check: Limit Reached = ${limitReached}`);
            return !limitReached;
        }
        catch (error) {
            console.error("❌ checkLimit error:", error);
            return false;
        }
    }
    async track(eventData) {
        var _a, _b;
        try {
            if (!this.trackingEnabled) {
                console.log('Tracking is disabled. Event not sent.');
                return;
            }
            const canTrack = await this.checkLimit();
            if (!canTrack) {
                console.log('❌ Tracking limit reached. Event not sent.');
                return;
            }
            eventData['context']['sdkVersion'] = package_json_1.version;
            eventData['context']['sdkRuntime'] = process.version;
            eventData['context']['operatingSystem'] = process.platform;
            console.log(package_json_1.version, process.version, process.platform);
            const url = `${this.BASE_URL}/api/v1/register/event`;
            const response = await axios_1.default.post(url, eventData, {
                headers: {
                    'Content-Type': 'application/json',
                    'secret': (_a = this.developerSecret) !== null && _a !== void 0 ? _a : '',
                    'pat': (_b = this.projectToken) !== null && _b !== void 0 ? _b : ''
                }
            });
            console.log('Track event response:', response.data);
        }
        catch (error) {
            console.error('Track event error:', error);
        }
    }
    async identifyUser(userData) {
        var _a, _b;
        try {
            const url = `${this.BASE_URL}/api/v1/register/user`;
            const response = await axios_1.default.post(url, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'secret': (_a = this.developerSecret) !== null && _a !== void 0 ? _a : '',
                    'pat': (_b = this.projectToken) !== null && _b !== void 0 ? _b : ''
                }
            });
            console.log('Identify user response:', response.data);
        }
        catch (error) {
            console.error('Identify user error:', error);
        }
    }
    disableTracking() {
        this.trackingEnabled = false;
        console.log('Tracking disabled.');
    }
    enableTracking() {
        this.trackingEnabled = true;
        console.log('Tracking enabled.');
    }
};
exports.EvntalySDKService = EvntalySDKService;
exports.EvntalySDKService = EvntalySDKService = __decorate([
    (0, common_1.Injectable)()
], EvntalySDKService);
//# sourceMappingURL=evntaly-sdk.service.js.map