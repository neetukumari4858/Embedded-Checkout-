export type CheckoutEvent = {
  kind: "success" | "close" | "error";
  text: string;
  time: string;
};

export type CheckoutProps = {
  tries: number;
  setTries: (value: number) => void;
  close: (reason: string) => void;
  error: (code: string, message: string) => void;
  success: (sessionId: string) => void;
};
