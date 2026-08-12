import { useEffect } from "react";
import { PubSubService, ToastService } from "services";

export function useEventSubscriber() {
  useEffect(() => {
    const handleError = (payload: string | Api.EventMessage) => {
      if (typeof payload === "string") {
        ToastService.error(payload);
      } else {
        ToastService.error(payload.messages, payload.title);
      }
    };

    PubSubService.subscribe("@event/api-error", handleError);
    PubSubService.subscribe("@event/api-not-ok", handleError);

    return () => {
      PubSubService.unsubscribe("@event/api-error", handleError);
      PubSubService.unsubscribe("@event/api-not-ok", handleError);
    };
  }, []);
}
