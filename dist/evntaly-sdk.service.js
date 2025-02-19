"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvntalySDKService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
/**
 * EvntalySDKService provides methods for tracking events, identifying users,
 * and checking usage limits against the Evntaly service.
 */
let EvntalySDKService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EvntalySDKService = _classThis = class {
        constructor() {
            this.BASE_URL = 'https://evntaly.com/prod';
            /**
             * Developer secret, used to authorize requests.
             */
            this.developerSecret = null;
            /**
             * Project token, used to authorize or reference a project.
             */
            this.projectToken = null;
            /**
             * Indicates whether tracking is enabled or disabled.
             */
            this.trackingEnabled = true;
        }
        /**
         * Initialize the SDK with the developer secret and project token.
         * @param developerSecret - The developer's secret key.
         * @param projectToken - The project's token.
         */
        init(developerSecret, projectToken) {
            this.developerSecret = developerSecret;
            this.projectToken = projectToken;
            console.log('Evntaly SDK initialized with secret and token.');
        }
        /**
         * Calls the Evntaly check-limit endpoint to verify usage limits.
         * @returns A promise that resolves to a boolean indicating if the limit allows further requests.
         */
        async checkLimit() {
            try {
                if (!this.developerSecret) {
                    throw new Error('Developer secret not set. Please call init() first.');
                }
                const url = `${this.BASE_URL}/api/v1/account/check-limits/${this.developerSecret}`;
                const response = await axios_1.default.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const { limitReached } = response.data;
                return limitReached;
            }
            catch (error) {
                console.error('checkLimit error:', error);
                return false;
            }
        }
        /**
         * Tracks an event by sending a POST request to Evntaly.
         * @param eventData - The event payload to be tracked.
         *
         * Only sends the request if `trackingEnabled` is true AND checkLimit() returns true.
         */
        async track(eventData) {
            var _a, _b;
            try {
                if (!this.trackingEnabled) {
                    console.log('Tracking is disabled. Event not sent.');
                    return;
                }
                const limitReached = await this.checkLimit();
                if (limitReached) {
                    console.log('checkLimit returned false. Event not sent.');
                    return;
                }
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
        /**
         * Identifies a user by sending a POST request to Evntaly.
         * @param userData - The user identification payload.
         */
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
        /**
         * Disables the tracking feature, preventing `track()` requests from being sent.
         */
        disableTracking() {
            this.trackingEnabled = false;
            console.log('Tracking disabled.');
        }
        /**
         * Enables the tracking feature, allowing `track()` requests if checkLimit() passes.
         */
        enableTracking() {
            this.trackingEnabled = true;
            console.log('Tracking enabled.');
        }
    };
    __setFunctionName(_classThis, "EvntalySDKService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EvntalySDKService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EvntalySDKService = _classThis;
})();
exports.EvntalySDKService = EvntalySDKService;
