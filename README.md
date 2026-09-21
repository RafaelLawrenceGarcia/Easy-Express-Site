# Easy Express website and DLC store

The React site keeps the existing PlayFab title (`164227`) account flow and adds an optional decoration DLC storefront. Real-money ownership is never granted by the browser.

## Local checks

```sh
npm install
npm run lint
npm run build
```

Copy `.env.example` to the deployment environment. Never use a `VITE_` prefix for Stripe or PlayFab server secrets; those values are bundled into client JavaScript.

## Production setup

1. Create one Stripe Price for each pack and configure the three `STRIPE_PRICE_*` variables.
2. Configure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PLAYFAB_TITLE_SECRET_KEY`, `PLAYFAB_TITLE_ID`, and `SITE_URL` as server-only Vercel environment variables.
3. Register `POST /api/dlc/stripe-webhook` for Stripe's `checkout.session.completed` event.
4. Deploy and run a test-mode purchase for each pack.
5. Verify that the webhook writes `DLC_ENTITLEMENTS` to PlayFab User Read-Only Data and an idempotent `DLC_ORDER_*` record to User Internal Data.
6. Only after that end-to-end test should checkout be described as live.

`GET /api/dlc/owned` and `POST /api/dlc/checkout` authenticate the caller's PlayFab session ticket on the server. The signed Stripe webhook is the only path that calls `processVerifiedPurchase` and grants an entitlement.
