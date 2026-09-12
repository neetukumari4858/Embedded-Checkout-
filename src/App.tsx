import { HostedCheckout } from "./components/HostedCheckout";
import { Storefront } from "./components/Storefront";

export default function App() {
  const isHostedCheckout = new URLSearchParams(window.location.search).has(
    "checkout_preview",
  );
  return isHostedCheckout ? <HostedCheckout /> : <Storefront />;
}
