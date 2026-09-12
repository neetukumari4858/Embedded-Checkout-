export type CloseReason = "user_closed" | "payment_cancelled" | "completed";
export type Options = {
  productId: string;
  checkoutUrl?: string;
  onSuccess?: (x: { sessionId: string }) => void;
  onClose?: (x: { reason: CloseReason }) => void;
  onError?: (x: { code: string; message: string }) => void;
};
export const DodoCheckout = {
  open(options: Options) {
    if (!options.productId) throw new Error("productId is required");
    const frame = document.createElement("iframe");
    const checkoutUrl = options.checkoutUrl ?? "https://checkout.dodo.dev/pay";
    const url = new URL(checkoutUrl);
    url.searchParams.set("product", options.productId);
    frame.src = url.toString();
    frame.title = "Secure checkout";
    frame.allow = "payment *";
    const backdrop = document.createElement("div");
    backdrop.style.cssText =
      "position:fixed;inset:0;background:rgb(24 24 23 / 55%);backdrop-filter:blur(4px);z-index:2147483646";
    frame.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(480px,calc(100% - 24px));height:min(640px,calc(100% - 24px));border:0;border-radius:22px;box-shadow:0 25px 60px rgb(0 0 0 / 25%);z-index:2147483647";
    const receive = (event: MessageEvent) => {
      if (event.origin !== url.origin) return;
      const d = event.data || {};
      if (d.type === "dodo:resize" && Number.isFinite(d.height)) {
        frame.style.height = `min(${Math.ceil(d.height)}px,calc(100% - 24px))`;
      }
      if (d.type === "dodo:success")
        options.onSuccess?.({ sessionId: d.sessionId });
      if (d.type === "dodo:error")
        options.onError?.({
          code: d.code || "unknown",
          message: d.message || "Payment error",
        });
      if (d.type === "dodo:close") {
        options.onClose?.({ reason: d.reason || "user_closed" });
        backdrop.remove();
        frame.remove();
        window.removeEventListener("message", receive);
      }
    };
    window.addEventListener("message", receive);
    document.body.append(backdrop, frame);
  },
};
