export { EvntalySDKService } from './evntaly-sdk.service';
export { RequestContext, RequestContextExtractor } from './request-context-extractor';
import { EvntalySDKService } from './evntaly-sdk.service';

/**
 * Get the singleton instance of EvntalySDKService.
 * @returns The singleton instance of EvntalySDKService.
 */
export const Evntaly = () => {
  return EvntalySDKService.getInstance();
};