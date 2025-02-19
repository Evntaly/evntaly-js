/**
 * EvntalySDKService provides methods for tracking events, identifying users,
 * and checking usage limits against the Evntaly service.
 */
export declare class EvntalySDKService {
    private readonly BASE_URL;
    /**
     * Developer secret, used to authorize requests.
     */
    private developerSecret;
    /**
     * Project token, used to authorize or reference a project.
     */
    private projectToken;
    /**
     * Indicates whether tracking is enabled or disabled.
     */
    private trackingEnabled;
    /**
     * Initialize the SDK with the developer secret and project token.
     * @param developerSecret - The developer's secret key.
     * @param projectToken - The project's token.
     */
    init(developerSecret: string, projectToken: string): void;
    /**
     * Calls the Evntaly check-limit endpoint to verify usage limits.
     * @returns A promise that resolves to a boolean indicating if the limit allows further requests.
     */
    checkLimit(): Promise<boolean>;
    /**
     * Tracks an event by sending a POST request to Evntaly.
     * @param eventData - The event payload to be tracked.
     *
     * Only sends the request if `trackingEnabled` is true AND checkLimit() returns true.
     */
    track(eventData: any): Promise<void>;
    /**
     * Identifies a user by sending a POST request to Evntaly.
     * @param userData - The user identification payload.
     */
    identifyUser(userData: any): Promise<void>;
    /**
     * Disables the tracking feature, preventing `track()` requests from being sent.
     */
    disableTracking(): void;
    /**
     * Enables the tracking feature, allowing `track()` requests if checkLimit() passes.
     */
    enableTracking(): void;
}
