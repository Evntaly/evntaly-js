export interface EventContext {
    sdkVersion: string;
    sdkRuntime?: string;
    operatingSystem?: string;
}
export declare class EvntalySDKService {
    private readonly BASE_URL;
    private developerSecret;
    private projectToken;
    private trackingEnabled;
    init(developerSecret: string, projectToken: string): void;
    checkLimit(): Promise<boolean>;
    track(eventData: any): Promise<void>;
    identifyUser(userData: any): Promise<void>;
    disableTracking(): void;
    enableTracking(): void;
}
