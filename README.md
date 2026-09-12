# Tiny Embeddable Checkout

A small hosted checkout demo built with React and TypeScript. The storefront uses
the SDK exactly as an external site would: it calls `DodoCheckout.open()` and
receives success, error, and close callbacks without handling card data.

## Run it

```bash
npm install
npm start
```

## How the pieces talk

1. `src/sdk/dodo-checkout.ts` is the host-side SDK. `open()` validates the
   product, creates an iframe URL, and mounts it above the current page. Only
   one checkout can be active; opening another closes the previous one with
   `reason: "replaced"`.
2. `src/components/HostedCheckout.tsx` is the checkout app inside that iframe.
   The demo routes to it with `?checkout_preview=1`; a deployed integration
   would point `checkoutUrl` at the separately hosted checkout app.
3. The iframe sends `postMessage` events for resize, errors, success, and close.
   The SDK accepts messages only from the configured checkout origin and iframe,
   then maps them to `onSuccess`, `onError`, and `onClose`.
4. `src/components/Storefront.tsx` is the integration example. Its callback
   log makes each SDK event visible, while the checkout keeps all card fields
   inside the iframe.

## Try the fake cards

Use any valid-looking email, expiry, and CVC:

| Card number | Result |
| --- | --- |
| `4242 4242 4242 4242` | Succeeds |
| `4000 0000 0000 0002` | Declines |
| `4000 0000 0000 0341` | Fails once, then succeeds on retry |
