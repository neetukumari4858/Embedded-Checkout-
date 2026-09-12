# Tiny Embeddable Checkout

A small hosted checkout demo built with React and TypeScript. The storefront uses
the SDK exactly as an external site would: it calls `DodoCheckout.open()` and
receives success, error, and close callbacks without handling card data.

## Deployed Link:- 
https://neetu-embedded-checkout.netlify.app/

## Run it

```bash
npm install
npm start
```
## Technology Used

```bash
ReactJs
Typescript
Javascript
Tailwind CSS
```
## Recorded Video:-

https://github.com/user-attachments/assets/db0ca4ea-2a51-4cfe-b20b-06751106c260


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

## Questions Asked:-

d) Two decisions I went back and forth on  :-

- Iframe vs. new tab:-I chose an iframe so the user stays on the merchant website while keeping card details isolated from the host page.
- Close after payment failure vs. keep open:- I chose to keep the checkout open so users can easily retry the payment.

e) What I’d explore next  

- Integrate a real payment provider and backend.
