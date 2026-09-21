# Easy Express website and DLC store

The React site keeps the existing PlayFab title (`164227`) account flow and adds an optional decoration DLC storefront. Real-money ownership is never granted by the browser.

## Local checks

```sh
npm install
npm run lint
npm run build
```

Copy `.env.example` to the deployment environment. Never use a `VITE_` prefix for PayMongo or PlayFab server secrets; those values are bundled into client JavaScript.

## Production setup

1. Configure `PAYMONGO_SECRET_KEY`, `PAYMONGO_DLC_WEBHOOK_SECRET`, `PLAYFAB_TITLE_SECRET_KEY` (or legacy `PLAYFAB_SECRET_KEY`), `PLAYFAB_TITLE_ID`, and `SITE_URL` as server-only Vercel environment variables.
2. Register `POST /api/dlc/paymongo-webhook` for PayMongo's `checkout_session.payment.paid` event.
3. Deploy and run a test purchase for each pack before announcing the store broadly.
5. Verify that the webhook writes `DLC_ENTITLEMENTS` to PlayFab User Read-Only Data and an idempotent `DLC_ORDER_*` record to User Internal Data.
6. Only after that end-to-end test should checkout be described as live.

`GET /api/dlc/owned` and `POST /api/dlc/checkout` authenticate the caller's PlayFab session ticket on the server. Checkout records are stored in PlayFab User Internal Data, and the signed PayMongo webhook is the only path that calls `processVerifiedPurchase` and grants an entitlement.
