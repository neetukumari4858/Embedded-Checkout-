import { useRef, useState } from "react";
import { ChevronRight, LockKeyhole } from "lucide-react";
import { DodoCheckout } from "../sdk/dodo-checkout";
import { DemoCard } from "./DemoCard";
import { CheckoutEvent } from "./types";

const timestamp = () => new Date().toLocaleTimeString("en", { hour12: false });

export function Storefront() {
  const [events, setEvents] = useState<CheckoutEvent[]>([]);
  const buyButton = useRef<HTMLButtonElement>(null);
  const addEvent = (kind: CheckoutEvent["kind"], text: string) =>
    setEvents((items) => [{ kind, text, time: timestamp() }, ...items]);

  const openCheckout = () =>
    DodoCheckout.open({
      productId: "prod_stoneware_mug",
      checkoutUrl: `${window.location.origin}${window.location.pathname}?checkout_preview=1`,
      onSuccess: ({ sessionId }) =>
        addEvent("success", `onSuccess({ sessionId: '${sessionId}' })`),
      onError: ({ code, message }) =>
        addEvent(
          "error",
          `onError({ code: '${code}', message: '${message}' })`,
        ),
      onClose: ({ reason }) => {
        addEvent("close", `onClose({ reason: '${reason}' })`);
        setTimeout(() => buyButton.current?.focus(), 0);
      },
    });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f5]">
      <div className="pointer-events-none fixed inset-0 opacity-[.13]" />
      <nav className="relative mx-auto flex h-[78px] max-w-[1200px] items-center justify-between border-b border-[#e5e5df] px-6">
        <div className="flex items-center gap-2 font-extrabold tracking-[-.06em]">
          <i className="grid h-7 w-9 place-items-center rounded-lg bg-[#181817] text-[#e3ff5c]">
              CG
            </i>
          <span className="text-xl">Common Goods</span>
        </div>
        <span className="mono hidden text-[10px] text-[#777772] sm:block">
          COMMON GOODS STORE
        </span>
      </nav>
      <section className="relative mx-auto grid max-w-[1200px] gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1fr_540px] lg:pt-15">
        <div className="">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#deded9] bg-white px-3 py-1.5 text-xs font-bold">
            <i className="h-1.5 w-1.5 rounded-full bg-[#63c174]" />
            Payments, without the tab switch
          </div>
          <h1 className="mt-7 text-[48px] font-extrabold leading-[1.02] tracking-[-.07em] sm:text-[66px]">
            A checkout your
            <br />
            <em className="font-medium text-[#74746f]">customers trust.</em>
          </h1>
          <p className="mt-7 max-w-[490px] text-[16px] leading-7 text-[#686863]">
            A calm, focused payment experience that opens where your customer is
            — while card details stay protected in a secure checkout.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              ref={buyButton}
              onClick={openCheckout}
              className="flex items-center gap-2 rounded-xl bg-[#181817] px-5 py-3.5 text-sm font-bold text-white shadow-[0_6px_0_#cfcfca] transition hover:-translate-y-0.5"
            >
              Buy the mug <ChevronRight size={16} />
            </button>
            <span className="flex items-center gap-2 text-xs font-bold text-[#777772]">
              <LockKeyhole size={14} />
              Secure hosted checkout
            </span>
          </div>
          <div className="mt-16 grid max-w-[500px] grid-cols-3 border-t border-[#dcdcd6] pt-5 text-sm font-bold">
            <span>
              One script
              <small className="block text-[10px] font-normal text-[#777772]">
                drop it in
              </small>
            </span>
            <span>
              One function
              <small className="block text-[10px] font-normal text-[#777772]">
                open it
              </small>
            </span>
            <span>
              No card data
              <small className="block text-[10px] font-normal text-[#777772]">
                touches your app
              </small>
            </span>
          </div>
        </div>
        <DemoCard events={events} onOpen={openCheckout} />
      </section>
    </main>
  );
}
