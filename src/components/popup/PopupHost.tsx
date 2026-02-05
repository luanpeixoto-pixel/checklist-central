import { DynamicPopup } from "@/components/DynamicPopup";
import { usePopupTriggers } from "@/hooks/usePopupTriggers";

export const PopupHost = () => {
  const { currentPopup, submitResponse, dismissPopup } = usePopupTriggers();

  if (!currentPopup) return null;

  return (
    <DynamicPopup
      popup={currentPopup.popup}
      onSubmit={submitResponse}
      onDismiss={dismissPopup}
    />
  );
};
