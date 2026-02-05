import { PopupCenter } from "@/components/popup/PopupCenter";
import { usePopupEngine } from "@/hooks/usePopupEngine";

export const PopupHost = () => {
  const { currentPopup, dismissPopup, clickPopup, submitPopupInput } = usePopupEngine();

  return (
    <PopupCenter
      popup={currentPopup}
      onDismiss={dismissPopup}
      onClick={clickPopup}
      onInputSubmit={submitPopupInput}
    />
  );
};
