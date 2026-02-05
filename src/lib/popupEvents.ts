const POPUP_TRIGGER_EVENT = "popup-trigger-event";

interface PopupTriggerDetail {
  eventName: string;
}

const createPopupTriggerEvent = (eventName: string) =>
  new CustomEvent<PopupTriggerDetail>(POPUP_TRIGGER_EVENT, {
    detail: { eventName },
  });

export const emitPopupTriggerEvent = (eventName: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(createPopupTriggerEvent(eventName));
};

export const subscribeToPopupTriggerEvents = (
  handler: (eventName: string) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => undefined;

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<PopupTriggerDetail>;
    const eventName = customEvent.detail?.eventName;
    if (!eventName) return;
    handler(eventName);
  };

  window.addEventListener(POPUP_TRIGGER_EVENT, listener as EventListener);
  return () => {
    window.removeEventListener(POPUP_TRIGGER_EVENT, listener as EventListener);
  };
};
