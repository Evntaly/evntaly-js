import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { version } from '../package.json';
import { RequestContext, RequestContextExtractor } from './request-context-extractor';

export interface EventContext {
  sdkVersion: string;
  sdkRuntime?: string;
  runtimeVersion?: string;
}

/**
 * EvntalySDKService provides methods for tracking events, identifying users,
 * and checking usage limits against the Evntaly service.
 * This is a singleton service - use EvntalySDKService.getInstance() to get the instance.
 */
@Injectable()
export class EvntalySDKService {
  private static instance: EvntalySDKService | null = null;
  private readonly BASE_URL = 'https://app.evntaly.com/prod';

  /**
   * Developer secret, used to authorize requests.
   */
  private developerSecret: string | null = null;

  /**
   * Project token, used to authorize or reference a project.
   */
  private projectToken: string | null = null;

  /**
   * Indicates whether tracking is enabled or disabled.
   */
  private trackingEnabled = true;

  /**
   * Indicates whether the SDK has been initialized.
   */
  private initialized = false;

  /**
   * Indicates whether verbose logging is enabled.
   */
  private verboseLogging = false;

  /**
   * Private constructor to prevent direct instantiation.
   * Use EvntalySDKService.getInstance() instead.
   */
  private constructor() {}

  /**
   * Get the singleton instance of EvntalySDKService.
   * @returns The singleton instance of EvntalySDKService.
   */
  static getInstance(): EvntalySDKService {
    if (!EvntalySDKService.instance) {
      EvntalySDKService.instance = new EvntalySDKService();
    }
    return EvntalySDKService.instance;
  }

  /**
   * Log message if verbose logging is enabled.
   * @param message - The message to log.
   * @param level - The log level ('log', 'info', 'warn', 'error').
   * @param args - Additional arguments to log.
   */
  private log(message: string, level: 'log' | 'info' | 'warn' | 'error' = 'log', ...args: any[]): void {
    if (this.verboseLogging) {
      console[level](message, ...args);
    }
  }

  /**
   * Initialize the SDK with the developer secret and project token.
   * Can only be called once. Subsequent calls will be ignored.
   * @param developerSecret - The developer's secret key.
   * @param projectToken - The project's token.
   * @param options - Optional configuration options.
   * @param options.verbose - Enable verbose logging (default: false).
   */
  init(developerSecret: string, projectToken: string, options: { verbose?: boolean } = {}): void {
    if (this.initialized) {
      this.log('Evntaly SDK is already initialized. Ignoring subsequent init() calls.', 'warn');
      return;
    }

    this.developerSecret = developerSecret;
    this.projectToken = projectToken;
    this.verboseLogging = options.verbose ?? false;
    this.initialized = true;
    this.log('Evntaly SDK initialized with secret and token.');
  }

  /**
   * Check if the SDK has been initialized.
   * @returns True if the SDK has been initialized, false otherwise.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Enable or disable verbose logging.
   * @param enabled - Whether to enable verbose logging.
   */
  setVerboseLogging(enabled: boolean): void {
    this.verboseLogging = enabled;
    this.log(`Verbose logging ${enabled ? 'enabled' : 'disabled'}.`);
  }

  /**
   * Check if verbose logging is enabled.
   * @returns True if verbose logging is enabled, false otherwise.
   */
  isVerboseLoggingEnabled(): boolean {
    return this.verboseLogging;
  }

  /**
   * Extract request context from Express/NestJS request object.
   * @param req - The request object.
   * @param resolveLocation - Whether to resolve IP location (default: true).
   * @returns Promise with extracted request context.
   */
  async extractRequestContext(req: any, resolveLocation: boolean = true): Promise<RequestContext> {
    return await RequestContextExtractor.extractRequestContext(req, resolveLocation);
  }

  /**
   * Calls the Evntaly check-limit endpoint to verify usage limits.
   * @returns A promise that resolves to a boolean indicating if the limit allows further requests.
   */
  async checkLimit(): Promise<boolean> {
    try {
      if (!this.initialized || !this.developerSecret) {
        this.log('Developer secret not set. Please call init() first.', 'error');
        return false;
      }

      const url = `${this.BASE_URL}/api/v1/account/check-limits/${this.developerSecret}`;
      this.log("🔍 Checking API usage limits...", 'info');

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const { limitReached } = response.data;
      this.log(`✅ API Limit Check: Limit Reached = ${limitReached}`, 'info');
      
      return !limitReached;
    } catch (error) {
      this.log("❌ checkLimit error:", 'error', error);
      return false;
    }
  }

  /**
   * Tracks an event by sending a POST request to Evntaly.
   * @param eventData - The event payload to be tracked.
   * @param req - Optional request object to extract context from.
   * @param options - Optional configuration.
   * @param options.resolveLocation - Whether to resolve IP location (default: true).
   * 
   * Only sends the request if `trackingEnabled` is true AND checkLimit() returns true.
   */
  async track(eventData: any, req?: any, options: { resolveLocation?: boolean } = {}): Promise<void> {
    try {
      if (!this.initialized) {
        this.log('SDK not initialized. Please call init() first.', 'error');
        return;
      }

      if (!this.trackingEnabled) {
        this.log('Tracking is disabled. Event not sent.');
        return;
      }

      const canTrack = await this.checkLimit();
      if (!canTrack) {
        this.log('❌ Tracking limit reached. Event not sent.');
        return;
      }
      
      // Add context with dynamic information
      eventData.context = {
        sdkVersion: version,
        sdkRuntime: `Nodejs`,
        runtimeVersion: process.version,
      };

      // Add request context if req object is provided
      if (req) {
        const resolveLocation = options.resolveLocation ?? true;
        this.log(`🌍 Extracting request context${resolveLocation ? ' with location resolution' : ''}...`, 'info');
        const requestContext = await this.extractRequestContext(req, resolveLocation);
        eventData.requestContext = requestContext;
        
        if (requestContext.location) {
          this.log(`📍 Location resolved: ${requestContext.location.city}, ${requestContext.location.country}`, 'info');
        }
      }

      const url = `${this.BASE_URL}/api/v1/register/event`;
      const response = await axios.post(url, eventData, {
        headers: {
          'Content-Type': 'application/json',
          'secret': this.developerSecret ?? '',
          'pat': this.projectToken ?? ''
        }
      });

      this.log('Track event response:', 'log', response.data);
    } catch (error) {
      this.log('Track event error:', 'error', error);
    }
  }

  /**
   * Identifies a user by sending a POST request to Evntaly.
   * @param userData - The user identification payload.
   * @param req - Optional request object to extract context from.
   * @param options - Optional configuration.
   * @param options.resolveLocation - Whether to resolve IP location (default: true).
   */
  async identifyUser(userData: any, req?: any, options: { resolveLocation?: boolean } = {}): Promise<void> {
    try {
      if (!this.initialized) {
        this.log('SDK not initialized. Please call init() first.', 'error');
        return;
      }

      // Add request context if req object is provided
      if (req) {
        const resolveLocation = options.resolveLocation ?? true;
        this.log(`🌍 Extracting request context${resolveLocation ? ' with location resolution' : ''}...`, 'info');
        const requestContext = await this.extractRequestContext(req, resolveLocation);
        userData.requestContext = requestContext;
        
        if (requestContext.location) {
          this.log(`📍 Location resolved: ${requestContext.location.city}, ${requestContext.location.country}`, 'info');
        }
      }

      const url = `${this.BASE_URL}/api/v1/register/user`;
      const response = await axios.post(url, userData, {
        headers: {
          'Content-Type': 'application/json',
          'secret': this.developerSecret ?? '',
          'pat': this.projectToken ?? ''
        }
      });

      this.log('Identify user response:', 'log', response.data);
    } catch (error) {
      this.log('Identify user error:', 'error', error);
    }
  }

  /**
   * Disables the tracking feature, preventing `track()` requests from being sent.
   */
  disableTracking(): void {
    this.trackingEnabled = false;
    this.log('Tracking disabled.');
  }

  /**
   * Enables the tracking feature, allowing `track()` requests if checkLimit() passes.
   */
  enableTracking(): void {
    this.trackingEnabled = true;
    this.log('Tracking enabled.');
  }
}