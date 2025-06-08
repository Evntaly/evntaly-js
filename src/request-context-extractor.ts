import axios from 'axios';

export interface RequestContext {
  ip?: string;
  userAgent?: string;
  referer?: string;
  method?: string;
  url?: string;
  host?: string;
  origin?: string;
  acceptLanguage?: string;
  acceptEncoding?: string;
  contentType?: string;
  xForwardedProto?: string;
  xForwardedHost?: string;
  xRequestedWith?: string;
  authorization?: string;
  cfIpCountry?: string;
  cfRay?: string;
  os?: string;
  osVersion?: string;
  location?: {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    timezone?: string;
    latitude?: number;
    longitude?: number;
  };
  [key: string]: any; // Allow for additional custom headers
}

/**
 * RequestContextExtractor provides methods for extracting request context
 * from Express/NestJS request objects, including OS detection and header parsing.
 */
export class RequestContextExtractor {
  /**
   * Normalize IP address to handle IPv6-mapped IPv4 and other common formats.
   * @param ip - The raw IP address string.
   * @returns Normalized IP address.
   */
  private static normalizeIP(ip: string): string {
    if (!ip) return ip;
    
    // Remove whitespace
    ip = ip.trim();
    
    // Handle IPv6-mapped IPv4 addresses (::ffff:192.168.1.1 -> 192.168.1.1)
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }
    
    // Handle IPv6 loopback (::1 -> 127.0.0.1)
    if (ip === '::1') {
      return '127.0.0.1';
    }
    
    // Remove brackets from IPv6 addresses
    if (ip.startsWith('[') && ip.endsWith(']')) {
      return ip.substring(1, ip.length - 1);
    }
    
    return ip;
  }

  /**
   * Resolve IP address to location information using IP geolocation service.
   * @param ip - The IP address to resolve.
   * @returns Promise with location information.
   */
  private static async resolveIPLocation(ip: string): Promise<RequestContext['location']> {
    try {
      // Skip local/private IP addresses
      if (!ip || 
          ip === '127.0.0.1' || 
          ip === '::1' || 
          ip.startsWith('192.168.') || 
          ip.startsWith('10.') || 
          ip.startsWith('172.')) {
        return {
          country: 'Local',
          countryCode: 'LOCAL',
          region: 'Local',
          city: 'Local'
        };
      }

      // Use ipapi.co for IP geolocation (free tier, no API key required)
      const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
        timeout: 3000, // 3 second timeout
        headers: {
          'User-Agent': 'evntaly-js-sdk'
        }
      });

      const data = response.data;
      
      return {
        country: data.country_name || undefined,
        countryCode: data.country_code || undefined,
        region: data.region || undefined,
        city: data.city || undefined,
        timezone: data.timezone || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined
      };
    } catch (error) {
      // Fallback: return basic info if geolocation fails
      return {
        country: 'Unknown',
        countryCode: 'UNKNOWN'
      };
    }
  }

  /**
   * Extract operating system and version from user agent string.
   * @param userAgent - The user agent string.
   * @returns Object with OS name and version.
   */
  private static extractOSFromUserAgent(userAgent: string): { os: string; version: string } {
    if (!userAgent) return { os: 'Unknown', version: 'Unknown' };

    const ua = userAgent.toLowerCase();

    // Mobile OS detection first (more specific)
    if (ua.includes('iphone') || ua.includes('ipod')) {
      const iosMatch = ua.match(/cpu iphone os (\d+)[_.](\d+)[_.]?(\d+)?/);
      if (iosMatch) {
        const version = `${iosMatch[1]}.${iosMatch[2]}${iosMatch[3] ? '.' + iosMatch[3] : ''}`;
        return { os: 'iOS', version };
      }
      return { os: 'iOS', version: 'Unknown' };
    }
    
    if (ua.includes('ipad')) {
      const iosMatch = ua.match(/cpu os (\d+)[_.](\d+)[_.]?(\d+)?/);
      if (iosMatch) {
        const version = `${iosMatch[1]}.${iosMatch[2]}${iosMatch[3] ? '.' + iosMatch[3] : ''}`;
        return { os: 'iOS', version };
      }
      return { os: 'iOS', version: 'Unknown' };
    }
    
    if (ua.includes('android')) {
      const androidMatch = ua.match(/android (\d+(?:\.\d+)*)/);
      if (androidMatch) {
        return { os: 'Android', version: androidMatch[1] };
      }
      return { os: 'Android', version: 'Unknown' };
    }

    // Desktop OS detection
    if (ua.includes('windows nt 10.0')) {
      return { os: 'Windows', version: '10/11' };
    }
    if (ua.includes('windows nt 6.3')) {
      return { os: 'Windows', version: '8.1' };
    }
    if (ua.includes('windows nt 6.2')) {
      return { os: 'Windows', version: '8' };
    }
    if (ua.includes('windows nt 6.1')) {
      return { os: 'Windows', version: '7' };
    }
    if (ua.includes('windows nt 6.0')) {
      return { os: 'Windows', version: 'Vista' };
    }
    if (ua.includes('windows nt 5.1') || ua.includes('windows xp')) {
      return { os: 'Windows', version: 'XP' };
    }
    if (ua.includes('windows')) {
      return { os: 'Windows', version: 'Unknown' };
    }

    // macOS detection with version extraction
    const macMatch = ua.match(/mac os x (\d+)[_.](\d+)[_.]?(\d+)?/);
    if (macMatch) {
      const majorVersion = parseInt(macMatch[1]);
      const minorVersion = parseInt(macMatch[2]);
      const patchVersion = macMatch[3] ? parseInt(macMatch[3]) : 0;
      
      const versionString = `${majorVersion}.${minorVersion}${patchVersion ? '.' + patchVersion : ''}`;
      
      // Map to macOS version names
      if (majorVersion === 10) {
        if (minorVersion >= 15) return { os: 'macOS', version: `${versionString} (Catalina)` };
        if (minorVersion === 14) return { os: 'macOS', version: `${versionString} (Mojave)` };
        if (minorVersion === 13) return { os: 'macOS', version: `${versionString} (High Sierra)` };
        if (minorVersion === 12) return { os: 'macOS', version: `${versionString} (Sierra)` };
        return { os: 'macOS', version: versionString };
      }
      if (majorVersion === 11) return { os: 'macOS', version: `${versionString} (Big Sur)` };
      if (majorVersion === 12) return { os: 'macOS', version: `${versionString} (Monterey)` };
      if (majorVersion === 13) return { os: 'macOS', version: `${versionString} (Ventura)` };
      if (majorVersion === 14) return { os: 'macOS', version: `${versionString} (Sonoma)` };
      if (majorVersion === 15) return { os: 'macOS', version: `${versionString} (Sequoia)` };
      
      return { os: 'macOS', version: versionString };
    }
    
    if (ua.includes('mac os x') || ua.includes('macos')) {
      return { os: 'macOS', version: 'Unknown' };
    }

    // Linux distributions with version detection
    if (ua.includes('ubuntu')) {
      const ubuntuMatch = ua.match(/ubuntu[\/\s](\d+(?:\.\d+)*)/);
      return { os: 'Ubuntu', version: ubuntuMatch ? ubuntuMatch[1] : 'Unknown' };
    }
    if (ua.includes('debian')) {
      return { os: 'Debian', version: 'Unknown' };
    }
    if (ua.includes('fedora')) {
      const fedoraMatch = ua.match(/fedora[\/\s](\d+)/);
      return { os: 'Fedora', version: fedoraMatch ? fedoraMatch[1] : 'Unknown' };
    }
    if (ua.includes('centos')) {
      const centosMatch = ua.match(/centos[\/\s](\d+(?:\.\d+)*)/);
      return { os: 'CentOS', version: centosMatch ? centosMatch[1] : 'Unknown' };
    }
    if (ua.includes('red hat')) {
      return { os: 'Red Hat', version: 'Unknown' };
    }
    if (ua.includes('linux')) {
      return { os: 'Linux', version: 'Unknown' };
    }

    // Other operating systems
    if (ua.includes('freebsd')) {
      const freebsdMatch = ua.match(/freebsd[\/\s](\d+(?:\.\d+)*)/);
      return { os: 'FreeBSD', version: freebsdMatch ? freebsdMatch[1] : 'Unknown' };
    }
    if (ua.includes('openbsd')) {
      return { os: 'OpenBSD', version: 'Unknown' };
    }
    if (ua.includes('netbsd')) {
      return { os: 'NetBSD', version: 'Unknown' };
    }
    if (ua.includes('sunos')) {
      return { os: 'Solaris', version: 'Unknown' };
    }

    return { os: 'Unknown', version: 'Unknown' };
  }

  /**
   * Extract request context from Express/NestJS request object.
   * @param req - The request object.
   * @param resolveLocation - Whether to resolve IP location (default: true).
   * @returns Promise with extracted request context.
   */
  static async extractRequestContext(req: any, resolveLocation: boolean = true): Promise<RequestContext> {
    const context: RequestContext = {};

    if (req && req.headers) {
      // Extract IP address with priority order and normalization
      let rawIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                  req.headers['x-real-ip'] ||
                  req.ip || 
                  req.connection?.remoteAddress || 
                  req.socket?.remoteAddress;

      // Normalize the IP address
      context.ip = this.normalizeIP(rawIP);

      // Extract standard headers
      context.userAgent = req.headers['user-agent'];
      context.referer = req.headers.referer || req.headers.referrer;
      context.host = req.headers.host;
      context.origin = req.headers.origin;
      context.acceptLanguage = req.headers['accept-language'];
      context.acceptEncoding = req.headers['accept-encoding'];
      context.contentType = req.headers['content-type'];
      
      // Extract OS and version from user agent
      if (context.userAgent) {
        const osInfo = this.extractOSFromUserAgent(context.userAgent);
        context.os = osInfo.os;
        context.osVersion = osInfo.version;
      }
      
      // Extract forwarded headers
      context.xForwardedProto = req.headers['x-forwarded-proto'];
      context.xForwardedHost = req.headers['x-forwarded-host'];
      context.xRequestedWith = req.headers['x-requested-with'];
      
      // Extract authorization (mask sensitive parts)
      if (req.headers.authorization) {
        const auth = req.headers.authorization;
        if (auth.startsWith('Bearer ')) {
          context.authorization = 'Bearer ***';
        } else if (auth.startsWith('Basic ')) {
          context.authorization = 'Basic ***';
        } else {
          context.authorization = '***';
        }
      }
      
      // Extract Cloudflare headers if present
      context.cfIpCountry = req.headers['cf-ipcountry'];
      context.cfRay = req.headers['cf-ray'];
      
      // Extract request details
      context.method = req.method;
      context.url = req.originalUrl || req.url;
      
      // Extract any custom headers that start with 'x-'
      Object.keys(req.headers).forEach(key => {
        if (key.startsWith('x-') && !context[key]) {
          const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
          context[camelKey] = req.headers[key];
        }
      });

      // Resolve IP location if requested and IP is available
      if (resolveLocation && context.ip) {
        try {
          context.location = await this.resolveIPLocation(context.ip);
        } catch (error) {
          // If location resolution fails, continue without location data
          context.location = {
            country: 'Unknown',
            countryCode: 'UNKNOWN'
          };
        }
      }
    }

    return context;
  }
} 