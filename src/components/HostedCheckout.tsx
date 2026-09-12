import { useState } from "react";
import { Checkout } from "./Checkout";

/** Checkout app running inside the iframe inserted by DodoCheckout.open(). */
export function HostedCheckout() {
  const [tries, setTries] = useState(0);
  const send = (data: Record<string, string>) =>
    window.parent.postMessage(data, window.location.origin);

  return (
    <Checkout
      tries={tries}
      setTries={setTries}
      close={(reason) => send({ type: "dodo:close", reason })}
      error={(code, message) => send({ type: "dodo:error", code, message })}
      success={(sessionId) => {
        send({ type: "dodo:success", sessionId });
        send({ type: "dodo:close", reason: "completed" });
      }}
    />
  );
}
