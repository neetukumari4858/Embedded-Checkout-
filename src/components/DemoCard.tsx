import { ArrowRight } from "lucide-react";
import { CheckoutEvent } from "./types";

type DemoCardProps = { events: CheckoutEvent[]; onOpen: () => void };

export function DemoCard({ events, onOpen }: DemoCardProps) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-[#dcdcd6] bg-white shadow-[0_22px_60px_rgba(24,24,20,.08)]">
      <div className="flex items-center justify-between border-b border-[#ebebe7] px-6 py-4">
        <span className="mono text-[11px] font-medium">YOUR STORE</span>
        <b className="rounded bg-[#f2f2ef] px-2 py-1 text-[10px] text-[#777772]">
          LIVE DEMO
        </b>
      </div>
      <div className="p-7">
        <div className="flex gap-5">
          <img
            className="h-[100px] w-[88px] rounded-xl bg-[#e5e6dc] object-cover"
            src="/stoneware-mug.svg"
            alt="Terracotta stoneware coffee mug"
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#85857f]">
              Common Goods
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-[-.04em]">
              Stoneware Coffee Mug
            </h2>
            <p className="mt-1 text-sm text-[#777772]">Terracotta · 12 fl oz</p>
            <p className="mt-4 text-lg font-extrabold">$32.00</p>
          </div>
        </div>
        <button
          onClick={onOpen}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e3ff5c] py-4 text-sm font-extrabold"
        >
          Buy now <ArrowRight size={16} />
        </button>
        <div className="mt-7 rounded-xl bg-[#171717] p-4">
          <div className="mb-3 flex justify-between mono text-[10px] text-[#a8a8a3]">
            <span>CALLBACK EVENTS</span>
            <span>{events.length ? "LIVE" : "WAITING..."}</span>
          </div>
          <div className="h-[90px] space-y-2 overflow-auto">
            {events.length ? (
              events.map((event, index) => (
                <p
                  key={index}
                  className={`mono text-[10px] ${event.kind === "success" ? "text-[#e3ff5c]" : event.kind === "error" ? "text-[#ff9b91]" : "text-[#bdc9ff]"}`}
                >
                  <span className="mr-2 text-[#777772]">{event.time}</span>
                  {event.text}
                </p>
              ))
            ) : (
              <p className="mono pt-7 text-center text-[10px] text-[#74746e]">
                Click “Buy now” to begin.
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
