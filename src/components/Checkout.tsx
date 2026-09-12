import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, CreditCard, ShieldCheck, X } from "lucide-react";
import { CheckoutProps } from "./types";

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19);

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits;
};

const isValidExpiry = (value: string) => {
  const match = value.match(/^(\d{2}) \/ (\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  return month >= 1 && month <= 12;
};

export function Checkout({
  tries,
  setTries,
  close,
  error,
  success,
}: CheckoutProps) {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"form" | "loading" | "error" | "done">(
    "form",
  );
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [notice, setNotice] = useState("");
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
    const onEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && state !== "loading" && close("user_closed");
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [state, close]);

  useLayoutEffect(() => {
    const reportHeight = () => {
      const height = checkoutRef.current?.scrollHeight;
      if (height)
        window.parent.postMessage(
          { type: "dodo:resize", height },
          window.location.origin,
        );
    };

    reportHeight();
    const observer = new ResizeObserver(reportHeight);
    if (checkoutRef.current) observer.observe(checkoutRef.current);
    return () => observer.disconnect();
  }, [state, notice]);

  const pay = () => {
    const cardNumber = card.replace(/\s/g, "");
    if (!email.includes("@")) {
      setNotice("Enter a valid email address to continue.");
      return;
    }
    if (cardNumber.length !== 16) {
      setNotice("Enter a valid 16-digit card number to continue.");
      return;
    }
    if (!isValidExpiry(expiry)) {
      setNotice("Enter a valid expiry date in MM / YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setNotice("Enter a valid 3- or 4-digit CVC.");
      return;
    }
    setNotice("");
    setState("loading");
    setTimeout(() => {
      if (cardNumber === "4000000000000002") {
        setState("error");
        error("card_declined", "Your card was declined. Try another card.");
      } else if (cardNumber === "4000000000000341" && tries === 0) {
        setTries(1);
        setState("error");
        error(
          "processing_error",
          "We could not confirm that payment. Please try again.",
        );
      } else {
        setState("done");
      }
    }, 1200);
  };

  if (state === "done")
    return (
      <Overlay>
        <div
          ref={checkoutRef}
          className="flex flex-col items-center justify-center p-10 text-center"
        >
          <b className="grid h-16 w-16 place-items-center rounded-full bg-[#e3ff5c]">
            <Check size={31} />
          </b>
          <p className="mt-7 text-[11px] font-bold uppercase tracking-widest text-[#777772]">
            Payment complete
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-.06em]">
            You’re all set.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#6d6d68]">
            Your Stoneware Coffee Mug is on its way. A receipt has been sent to{" "}
            {email}.
          </p>
          <button
            onClick={() => success("cs_demo_8XK29F")}
            className="mt-8 w-full rounded-xl bg-[#181817] py-3.5 text-sm font-bold text-white"
          >
            Return to Common Goods
          </button>
        </div>
      </Overlay>
    );

  const errorText =
    card.replace(/\s/g, "") === "4000000000000002"
      ? "Your card was declined. Try another card."
      : "We could not confirm that payment. Your card has not been charged — please try again.";
  return (
    <Overlay>
      <div ref={checkoutRef}>
        <header className="flex items-center justify-between  px-6 py-5">
          <b className="flex items-center gap-2">
            <i className="grid h-7 w-9 place-items-center rounded-lg bg-[#181817] text-[#e3ff5c]">
              CG
            </i>
            Common Goods
          </b>
          <button
            ref={closeButton}
            onClick={() => close("user_closed")}
            disabled={state === "loading"}
            aria-label="Close checkout"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#f2f2ef] disabled:opacity-30"
          >
            <X size={20} />
          </button>
        </header>
        <div className="p-7">
          <div className="flex justify-between rounded-xl bg-[#f5f5f2] p-3">
            <span>
              <b className="block text-sm">Stoneware Coffee Mug</b>
              <small className="text-xs text-[#777772]">Common Goods</small>
            </span>
            <b>$32.00</b>
          </div>
          <label className="mb-2 mt-6 block text-xs font-bold">Email</label>
          <input
            className="field"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={state === "loading"}
          />
          <div className="mb-2 mt-5 flex justify-between text-xs font-bold">
            <span>Card information</span>
            <CreditCard size={16} />
          </div>
          <input
            className="field"
            value={card}
            inputMode="numeric"
            onChange={(event) => setCard(formatCardNumber(event.target.value))}
            placeholder="eg. 4242 4242 4242 4242"
            disabled={state === "loading"}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              className="field"
              value={expiry}
              inputMode="numeric"
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              placeholder="MM / YY"
              disabled={state === "loading"}
            />
            <input
              className="field"
              value={cvc}
              inputMode="numeric"
              onChange={(event) =>
                setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="CVC"
              disabled={state === "loading"}
            />
          </div>
          {(notice || state === "error") && (
            <p className="mt-4 rounded-xl border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs leading-5 text-[#a9473f]">
              {notice || errorText}
            </p>
          )}
          <button
            onClick={pay}
            disabled={state === "loading"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#181817] py-4 text-sm font-extrabold text-white disabled:bg-[#555]"
          >
            {state === "loading" ? (
              <>
                <i className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Confirming payment…
              </>
            ) : state === "error" ? (
              "Try payment again"
            ) : (
              "Pay $32.00"
            )}
          </button>
          <p className="mt-5 flex justify-center gap-1 text-center text-[10px] font-semibold text-[#85857f]">
            <ShieldCheck size={14} />
            Card details are encrypted and never shared with Common Goods.
          </p>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-white">
      <div className="w-full overflow-hidden bg-white">{children}</div>
    </div>
  );
}
