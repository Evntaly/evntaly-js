const { EvntalySDKService } = require('evntaly-js');

const evntaly = new EvntalySDKService();
evntaly.init('8ad5a6de6d7f861f', '1b131c0b8d83742566a84f847eef017f');

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

// Array of sample users
const userIds = Array.from({ length: 20 }, (_, i) => `user_${i + 1}`);

// Function to send events
async function sendEvents() {
  for (let i = 0; i < 2; i++) {
    const eventName = eventNames[Math.floor(Math.random() * eventNames.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];


    // Send event with details
    await evntaly.track(
        {
            title: eventName,
            description: eventDescriptions[eventName],
            message: 'Order #12345',
            data: {
              user_id: userId,
              timestamp: new Date().toISOString(),
              referrer: 'social_media',
              email_verified: true
            },
            tags: [],
            notify: true,
            icon: eventIcons[eventName],
            apply_rule_only: false,
            user: {
              id: userId,
            },
            type: 'Transaction',
            sessionID: '20750ebc-dabf-4fd4-9498' + userId,
            feature: 'test-script',
            topic: 'Script'
          }
    );
    console.log(`Event ${i + 1}: ${eventName} sent for user ${userId}`);
  }

  console.log('All events sent successfully!');
}

sendEvents().catch(console.error);
