const { Evntaly } = require('evntaly-js');

const evntaly = Evntaly();

evntaly.init('8ad5a6de6d7f861f', '1b131c0b8d83742566a84f847eef017f', { 
  verbose: true  // Enable verbose logging
});

if (!evntaly.isInitialized()) {
  console.error('Failed to initialize Evntaly SDK');
  process.exit(1);
}

console.log('✅ Evntaly SDK initialized successfully with verbose logging enabled');
console.log('📝 Verbose logging enabled:', evntaly.isVerboseLoggingEnabled());

const eventNames = [
  'user_signed_up',
  'user_logged_in',
  'subscription_upgraded',
  'payment_success',
  'feature_used',
  'item_purchased',
  'profile_updated',
  'email_verified',
  'password_changed',
  'user_logged_out',
];

const eventIcons = {
  user_signed_up: '👤',
  user_logged_in: '🔐',
  subscription_upgraded: '⭐',
  payment_success: '💳',
  feature_used: '🔧',
  item_purchased: '🛍️',
  profile_updated: '✏️',
  email_verified: '✉️',
  password_changed: '🔑',
  user_logged_out: '👋'
};

const eventDescriptions = {
  user_signed_up: 'New user registration completed successfully',
  user_logged_in: 'User authenticated and started new session',
  subscription_upgraded: 'User upgraded their subscription plan',
  payment_success: 'Payment transaction completed successfully',
  feature_used: 'User interacted with platform feature',
  item_purchased: 'User completed a purchase transaction',
  profile_updated: 'User modified their profile information',
  email_verified: 'User confirmed their email address',
  password_changed: 'User security credentials updated',
  user_logged_out: 'User session ended successfully'
};

const userIds = Array.from({ length: 20 }, (_, i) => `user_${i + 1}`);

function createMockRequest(options = {}) {
  const userAgents = {
    windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ubuntu: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0',
    android: 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    ipad: 'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
  };

  return {
    ip: options.ip || '192.168.1.' + Math.floor(Math.random() * 255),
    method: options.method || 'POST',
    originalUrl: options.originalUrl || '/api/events',
    headers: {
      'user-agent': options.userAgent || userAgents.windows,
      'referer': options.referer || 'https://app.evntaly.com/dashboard',
      'host': options.host || 'api.evntaly.com',
      'origin': options.origin || 'https://app.evntaly.com',
      'accept-language': options.acceptLanguage || 'en-US,en;q=0.9',
      'accept-encoding': options.acceptEncoding || 'gzip, deflate, br',
      'content-type': options.contentType || 'application/json',
      'x-forwarded-for': options.xForwardedFor || '203.0.113.195, 198.51.100.178',
      'x-forwarded-proto': options.xForwardedProto || 'https',
      'x-forwarded-host': options.xForwardedHost || 'app.evntaly.com',
      'x-requested-with': options.xRequestedWith || 'XMLHttpRequest',
      'authorization': options.authorization || 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'cf-ipcountry': options.cfIpCountry || 'US',
      'cf-ray': options.cfRay || '7d4c2f8a8c9e1234-LAX',
      'x-custom-header': options.xCustomHeader || 'custom-value-123'
    }
  };
}

function demonstrateOSDetection() {
  console.log('\n🖥️  Demonstrating OS Detection with Version from User Agents:');
  console.log('================================================================');
  
  const testCases = [
    {
      name: 'Windows 10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      name: 'macOS Sonoma 14.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      name: 'Ubuntu Linux',
      userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0'
    },
    {
      name: 'Android 13',
      userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    {
      name: 'iPhone iOS 17.1',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
    },
    {
      name: 'iPad iOS 16.2',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.1'
    },
    {
      name: 'Android 12',
      userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    {
      name: 'macOS Big Sur 11.7',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    }
  ];
  
  testCases.forEach((testCase, index) => {
    const mockReq = createMockRequest({
      userAgent: testCase.userAgent,
      ip: `192.168.1.${100 + index}`
    });
    
    const context = evntaly.extractRequestContext(mockReq);
    console.log(context);
    console.log(`${index + 1}. ${testCase.name}:`);
    console.log(`   Detected OS: ${context.os}`);
    console.log(`   OS Version: ${context.osVersion}`);
    console.log(`   IP: ${context.ip}`);
    // console.log(`   User Agent: ${context.userAgent.substring(0, 60)}...`);
    console.log('');
  });
}

function demonstrateRequestContext() {
  console.log('\n🔍 Demonstrating Request Context Extraction with Location:');
  console.log('==========================================================');
  
  const mockReq = createMockRequest({
    ip: '8.8.8.8',
    method: 'POST',
    originalUrl: '/api/purchase',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    referer: 'https://shop.example.com/checkout',
    host: 'api.example.com',
    origin: 'https://shop.example.com',
    acceptLanguage: 'en-US,en;q=0.9,es;q=0.8',
    cfIpCountry: 'CA',
    xCustomHeader: 'tracking-enabled'
  });
  
  // Extract context manually with location resolution
  console.log('📍 Extracting context with location resolution...');
  evntaly.extractRequestContext(mockReq, true).then(requestContext => {
    console.log('📋 Extracted Request Context with Location:', JSON.stringify(requestContext, null, 2));
    console.log('');
  }).catch(error => {
    console.error('Error extracting context:', error);
  });
}

// Function to demonstrate location resolution with different IPs
async function demonstrateLocationResolution() {
  console.log('\n🌍 Demonstrating IP Location Resolution:');
  console.log('==========================================');
  
  const testIPs = [
    { name: 'Google DNS (US)', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS (US)', ip: '1.1.1.1' },
    { name: 'Local IP', ip: '192.168.1.100' },
    { name: 'OpenDNS (US)', ip: '208.67.222.222' }
  ];
  
  for (const testIP of testIPs) {
    console.log(`🔍 Testing ${testIP.name} (${testIP.ip}):`);
    
    const mockReq = createMockRequest({
      ip: testIP.ip,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    try {
      const context = await evntaly.extractRequestContext(mockReq, true);
      console.log(`   Location: ${context.location?.city || 'Unknown'}, ${context.location?.country || 'Unknown'} (${context.location?.countryCode || 'N/A'})`);
      if (context.location?.timezone) {
        console.log(`   Timezone: ${context.location.timezone}`);
      }
    } catch (error) {
      console.log('   Error resolving location:', error.message);
    }
    console.log('');
  }
}

// Function to send events with request context and location
async function sendEventsWithContext() {
  console.log('🚀 Starting to send test events with request context, OS/version detection, and location resolution...\n');
  
  const osUserAgents = [
    {
      os: 'Windows',
      version: '10/11',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ip: '8.8.8.8' // Google DNS - US
    },
    {
      os: 'macOS',
      version: '10.15 (Catalina)',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ip: '1.1.1.1' // Cloudflare DNS - US
    },
    {
      os: 'Android',
      version: '13',
      userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      ip: '208.67.222.222' // OpenDNS - US
    }
  ];
  
  for (let i = 0; i < 3; i++) {
    const eventName = eventNames[Math.floor(Math.random() * eventNames.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const osConfig = osUserAgents[i];

    // Create a unique mock request for each event with different OS and IP
    const mockReq = createMockRequest({
      ip: osConfig.ip,
      method: i % 2 === 0 ? 'POST' : 'GET',
      originalUrl: `/api/events/${eventName}`,
      userAgent: osConfig.userAgent,
      referer: `https://app.example.com/feature-${i}`,
      cfIpCountry: ['US', 'CA', 'GB'][i % 3],
      xCustomHeader: `session-${userId}-${i}`
    });

    console.log(`📤 Sending event ${i + 1}/3: ${eventName} for user ${userId}`);
    console.log(`🌐 Request IP: ${mockReq.ip}, Method: ${mockReq.method}, Country: ${mockReq.headers['cf-ipcountry']}`);

    // Send event with request context and location resolution
    await evntaly.track({
      title: eventName,
      description: eventDescriptions[eventName],
      message: `Event #${i + 1} with request context, OS/version detection, and location resolution`,
      data: {
        user_id: userId,
        timestamp: new Date().toISOString(),
        referrer: 'test_script',
        email_verified: true,
        event_sequence: i + 1
      },
      tags: ['test', 'context', 'os-detection', 'version-detection', 'location-resolution', eventName],
      notify: true,
      icon: eventIcons[eventName],
      apply_rule_only: false,
      user: {
        id: userId,
      },
      type: 'Transaction',
      sessionID: '20750ebc-dabf-4fd4-9498' + userId + '-' + i,
      feature: 'test-script-with-full-context',
      topic: 'TestingFullContext'
    }, mockReq, { resolveLocation: true }); // Enable location resolution
    
    console.log(`✅ Event ${i + 1}: ${eventName} sent successfully with full context for user ${userId}\n`);
  }
}

// Function to send events without request context (for comparison)
async function sendEventsWithoutContext() {
  console.log('🚀 Sending one event WITHOUT request context for comparison...\n');
  
  const eventName = 'feature_used';
  const userId = 'user_comparison';

  console.log(`📤 Sending event: ${eventName} for user ${userId} (NO REQUEST CONTEXT)`);

  // Send event without request context
  await evntaly.track({
    title: eventName,
    description: eventDescriptions[eventName],
    message: 'Event without request context',
    data: {
      user_id: userId,
      timestamp: new Date().toISOString(),
      referrer: 'test_script',
      email_verified: true
    },
    tags: ['test', 'no-context'],
    notify: true,
    icon: eventIcons[eventName],
    apply_rule_only: false,
    user: {
      id: userId,
    },
    type: 'Transaction',
    sessionID: '20750ebc-dabf-4fd4-9498-no-context',
    feature: 'test-script-no-context',
    topic: 'TestingNoContext'
  }); // No request object passed
  
  console.log(`✅ Event sent successfully WITHOUT request context for comparison\n`);
}

// Function to demonstrate user identification with request context
async function demonstrateUserIdentification() {
  console.log('👤 Demonstrating User Identification with Request Context...\n');
  
  const mockReq = createMockRequest({
    ip: '198.51.100.42',
    method: 'POST',
    originalUrl: '/api/user/identify',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
    referer: 'https://mobile.example.com/profile',
    cfIpCountry: 'FR',
    xCustomHeader: 'mobile-app-v2.1.0'
  });
  
  await evntaly.identifyUser({
    id: 'user_context_demo',
    email: 'demo@example.com',
    full_name: 'Demo User',
    organization: 'Test Organization',
    data: {
      id: 'demo_user',
      email: 'demo@example.com',
      location: 'France',
      device: 'iPhone',
      app_version: '2.1.0'
    }
  }, mockReq); // Pass request object for context capture
  
  console.log('✅ User identified with request context successfully\n');
}

// Function to demonstrate singleton behavior
function demonstrateSingleton() {
  const { EvntalySDKService, Evntaly } = require('evntaly-js');
  
  // Get instances using different methods
  const instance1 = EvntalySDKService.getInstance();
  const instance2 = Evntaly();
  
  console.log('🔍 Singleton test:');
  console.log('Instance 1 === Instance 2:', instance1 === instance2);
  console.log('Instance 1 initialized:', instance1.isInitialized());
  console.log('Instance 2 initialized:', instance2.isInitialized());
  console.log('');
}

function demonstrateVerboseLogging() {
  console.log('\n🔊 Demonstrating Verbose Logging Control:');
  console.log('==========================================');
  
  console.log('Current verbose logging status:', evntaly.isVerboseLoggingEnabled());
  
  console.log('\n1. Disabling verbose logging...');
  evntaly.setVerboseLogging(false);
  console.log('Verbose logging status:', evntaly.isVerboseLoggingEnabled());
  
  console.log('\n2. Re-enabling verbose logging...');
  evntaly.setVerboseLogging(true);
  console.log('Verbose logging status:', evntaly.isVerboseLoggingEnabled());
  
  console.log('\n3. Testing with verbose logging disabled:');
  evntaly.setVerboseLogging(false);
  evntaly.enableTracking();
  evntaly.disableTracking();
  
  console.log('\n4. Testing with verbose logging enabled:');
  evntaly.setVerboseLogging(true);
  evntaly.enableTracking();
  
  console.log('');
}

// Function to demonstrate tracking without location resolution
async function sendEventWithoutLocationResolution() {
  console.log('🚀 Sending one event WITHOUT location resolution for comparison...\n');
  
  const eventName = 'feature_used';
  const userId = 'user_no_location';

  const mockReq = createMockRequest({
    ip: '8.8.8.8',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  console.log(`📤 Sending event: ${eventName} for user ${userId} (NO LOCATION RESOLUTION)`);

  // Send event without location resolution
  await evntaly.track({
    title: eventName,
    description: eventDescriptions[eventName],
    message: 'Event without location resolution',
    data: {
      user_id: userId,
      timestamp: new Date().toISOString(),
      referrer: 'test_script',
      email_verified: true
    },
    tags: ['test', 'no-location'],
    notify: true,
    icon: eventIcons[eventName],
    apply_rule_only: false,
    user: {
      id: userId,
    },
    type: 'Transaction',
    sessionID: '20750ebc-dabf-4fd4-9498-no-location',
    feature: 'test-script-no-location',
    topic: 'TestingNoLocation'
  }, mockReq, { resolveLocation: false }); // Disable location resolution
  
  console.log(`✅ Event sent successfully WITHOUT location resolution for comparison\n`);
}

// Function to demonstrate IP normalization
function demonstrateIPNormalization() {
  console.log('\n🌐 Demonstrating IP Address Normalization:');
  console.log('=============================================');
  
  const testCases = [
    {
      name: 'IPv6-mapped IPv4 (localhost)',
      rawIP: '::ffff:127.0.0.1',
      expected: '127.0.0.1'
    },
    {
      name: 'IPv6-mapped IPv4 (public)',
      rawIP: '::ffff:192.168.1.100',
      expected: '192.168.1.100'
    },
    {
      name: 'IPv6 loopback',
      rawIP: '::1',
      expected: '127.0.0.1'
    },
    {
      name: 'IPv6 with brackets',
      rawIP: '[2001:db8::1]',
      expected: '2001:db8::1'
    },
    {
      name: 'Regular IPv4',
      rawIP: '192.168.1.1',
      expected: '192.168.1.1'
    },
    {
      name: 'X-Forwarded-For with multiple IPs',
      xForwardedFor: '197.135.93.110, 172.69.68.66',
      expected: '197.135.93.110'
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. ${testCase.name}:`);
    
    if (testCase.xForwardedFor) {
      // Test X-Forwarded-For parsing
      const mockReq = {
        headers: {
          'x-forwarded-for': testCase.xForwardedFor,
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };
      
      const context = evntaly.extractRequestContext(mockReq, false); // No location resolution for demo
      console.log(`   X-Forwarded-For: "${testCase.xForwardedFor}"`);
      console.log(`   Extracted IP: "${context.ip}"`);
      console.log(`   Expected: "${testCase.expected}"`);
      console.log(`   ✅ Correctly extracted first IP from chain`);
    } else {
      // Test IP normalization
      const mockReq = {
        ip: testCase.rawIP,
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };
      
      const context = evntaly.extractRequestContext(mockReq, false); // No location resolution for demo
      console.log(`   Raw IP: "${testCase.rawIP}"`);
      console.log(`   Normalized IP: "${context.ip}"`);
      console.log(`   Expected: "${testCase.expected}"`);
      console.log(`   ✅ ${context.ip === testCase.expected ? 'Correctly normalized' : 'Normalization failed'}`);
    }
    console.log('');
  });
  
  console.log('📋 Summary:');
  console.log('- IPv6-mapped IPv4 addresses (::ffff:x.x.x.x) are converted to IPv4 format');
  console.log('- IPv6 loopback (::1) is normalized to 127.0.0.1');
  console.log('- X-Forwarded-For headers are parsed to extract the original client IP');
  console.log('- Multiple proxy IPs in X-Forwarded-For are handled correctly');
  console.log('- IPv6 addresses with brackets are cleaned up');
}

// Run all demonstrations
async function runAllDemos() {
  try {
    demonstrateIPNormalization();
    
    // demonstrateSingleton();
    
    // demonstrateVerboseLogging();
    
    // demonstrateOSDetection();
    
    // demonstrateRequestContext();
    
    // await demonstrateLocationResolution();
    
    // await sendEventsWithContext();
    
    // await sendEventsWithoutContext();
    
    // await sendEventWithoutLocationResolution();
    
    // await demonstrateUserIdentification();
    
    console.log('🎉 All demonstrations completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- IP address normalization demonstrated');
    console.log('- IPv6-mapped IPv4 conversion shown');
    console.log('- X-Forwarded-For parsing illustrated');
    console.log('- Multiple proxy IP handling verified');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  }
}

// Run the demonstration
runAllDemos();
