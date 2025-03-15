
<p align="center">
  <img src="https://cdn.evntaly.com/Resources/og.png" alt="Evntaly Cover" width="100%">
</p>

<h3 align="center">Evntaly</h3>

<p align="center">
 An advanced event tracking and analytics platform designed to help developers capture, analyze, and react to user interactions efficiently.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/evntaly-js"><img src="https://img.shields.io/npm/v/evntaly-js.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/evntaly-js"><img src="https://img.shields.io/npm/dm/evntaly-js.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/evntaly-js"><img src="https://img.shields.io/npm/l/evntaly-js.svg" alt="license"></a>
</p>


# evntaly-js

**evntaly-js** is an SDK designed to seamlessly integrate with the Evntaly event tracking platform. It provides developers with a straightforward interface to initialize the SDK, track events, identify users, and manage tracking states within Node.js and NestJS applications.

## Features

- **Initialization**: Set up the SDK with your developer secret and project token.
- **Event Tracking**: Log events with detailed metadata.
- **User Identification**: Associate actions with specific users.
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
Or In TypeScript

```typescript
import { EvntalySDKService } from 'evntaly-js';

export class accountController {
  constructor(
    private readonly evntaly: EvntalySDKService,
  ) {
    this.evntaly.init('DEVELOPER_SECRET', 'PROJECT_TOKEN');
  }
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

