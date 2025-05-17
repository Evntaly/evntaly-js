import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { version } from '../package.json';

export interface EventContext {
  sdkVersion: string;
  sdkRuntime?: string;
  operatingSystem?: string;
}

/**
 * EvntalySDKService provides methods for tracking events, identifying users,
 * and checking usage limits against the Evntaly service.
 */
@Injectable()
export class EvntalySDKService {
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
   * Initialize the SDK with the developer secret and project token.
   * @param developerSecret - The developer's secret key.
   * @param projectToken - The project's token.
   */
  init(developerSecret: string, projectToken: string): void {
    this.developerSecret = developerSecret;
    this.projectToken = projectToken;
    console.log('Evntaly SDK initialized with secret and token.');
  }

  /**
   * Calls the Evntaly check-limit endpoint to verify usage limits.
   * @returns A promise that resolves to a boolean indicating if the limit allows further requests.
   */
  async checkLimit(): Promise<boolean> {
    try {
      if (!this.developerSecret) {
        throw new Error('Developer secret not set. Please call init() first.');
      }

      const url = `${this.BASE_URL}/api/v1/account/check-limits/${this.developerSecret}`;
      console.info("🔍 Checking API usage limits...");

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const { limitReached } = response.data;
      console.info(`✅ API Limit Check: Limit Reached = ${limitReached}`);
      
      return !limitReached;
    } catch (error) {
      console.error("❌ checkLimit error:", error);
      return false;
    }
  }

  /**
   * Tracks an event by sending a POST request to Evntaly.
   * @param eventData - The event payload to be tracked.
   * 
   * Only sends the request if `trackingEnabled` is true AND checkLimit() returns true.
   */
  async track(eventData: any): Promise<void> {
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
      
      // Add context with dynamic information
      eventData.context = {
        sdkVersion: version,
        sdkRuntime: `nodejs ${process.version}`,
        operatingSystem: process.platform
      };

      const url = `${this.BASE_URL}/api/v1/register/event`;
      const response = await axios.post(url, eventData, {
        headers: {
          'Content-Type': 'application/json',
          'secret': this.developerSecret ?? '',
          'pat': this.projectToken ?? ''
        }
      });

      console.log('Track event response:', response.data);
    } catch (error) {
      console.error('Track event error:', error);
    }
  }

  /**
   * Identifies a user by sending a POST request to Evntaly.
   * @param userData - The user identification payload.
   */
  async identifyUser(userData: any): Promise<void> {
    try {
      const url = `${this.BASE_URL}/api/v1/register/user`;
      const response = await axios.post(url, userData, {
        headers: {
          'Content-Type': 'application/json',
          'secret': this.developerSecret ?? '',
          'pat': this.projectToken ?? ''
        }
      });

      console.log('Identify user response:', response.data);
    } catch (error) {
      console.error('Identify user error:', error);
    }
  }

  /**
   * Disables the tracking feature, preventing `track()` requests from being sent.
   */
  disableTracking(): void {
    this.trackingEnabled = false;
    console.log('Tracking disabled.');
  }

  /**
   * Enables the tracking feature, allowing `track()` requests if checkLimit() passes.
   */
  enableTracking(): void {
    this.trackingEnabled = true;
    console.log('Tracking enabled.');
  }
}