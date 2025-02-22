# evntaly-js

**evntaly-js** is an SDK designed to seamlessly integrate with the Evntaly event tracking platform. It provides developers with a straightforward interface to initialize the SDK, track events, identify users, and manage tracking states within Node.js and NestJS applications.

## Features

- **Initialization**: Set up the SDK with your developer secret and project token.
- **Event Tracking**: Log events with detailed metadata.
- **User Identification**: Associate actions with specific users.
- **Usage Limits**: Check and respect API usage limits.
- **Tracking Control**: Enable or disable event tracking as needed.

## Installation

Install the package using npm:

```bash
npm install evntaly-js
```

## Usage

### Initialization

Before using the SDK, initialize it with your developer secret and project token.

```javascript
const { EvntalySDKService } = require('evntaly-js');

const evntaly = new EvntalySDKService();
evntaly.init('YOUR_DEVELOPER_SECRET', 'YOUR_PROJECT_TOKEN');
```

### Tracking Events

To track an event:

```javascript
evntaly.track({
  title: 'Payment Received',
  description: 'User completed a purchase',
  message: 'Order #12345',
  data: {
    user_id: '67890',
    timestamp: new Date().toISOString(),
    referrer: 'social_media',
    email_verified: true
  },
  tags: ['purchase', 'payment'],
  notify: true,
  icon: '💰',
  apply_rule_only: false,
  user: {
    id: '0f6934fd-99c0-41ca-84f4'
  },
  type: 'Transaction',
  sessionID: '20750ebc-dabf-4fd4-9498-443bf30d6095_bsd',
  feature: 'Checkout',
  topic: '@Sales'
});
```

### Identifying Users

To identify a user:

```javascript
evntaly.identifyUser({
  id: '0f6934fd-99c0-41ca-84f4',
  email: 'user@example.com',
  full_name: 'John Doe',
  organization: 'ExampleCorp',
  data: {
    id: 'JohnD',
    email: 'user@example.com',
    location: 'USA',
    salary: 75000,
    timezone: 'America/New_York'
  }
});
```

### Checking Usage Limits

Before tracking events, it's prudent to check if you're within your usage limits:

```javascript
const canTrack = await evntaly.checkLimit();
if (canTrack) {
  // Proceed with tracking
} else {
  console.warn('Usage limit reached. Event not tracked.');
}
```

### Enabling/Disabling Tracking

You can control event tracking globally:

```javascript
// Disable tracking
evntaly.disableTracking();

// Enable tracking
evntaly.enableTracking();
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

---

*Note: Replace placeholder values like `'YOUR_DEVELOPER_SECRET'` and `'YOUR_PROJECT_TOKEN'` with your actual Evntaly credentials.*

