import { createContext, useContext, type ReactNode } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePopupEngine } from "@/hooks/usePopupEngine";
import { PopupCenter } from "@/components/popup/PopupCenter";

interface AnalyticsContextValue {
  track: (eventName: string, metadata?: Record<string, unknown>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export const useTrack = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useTrack must be used within AnalyticsProvider");
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const { track } = useAnalytics();
  const { currentPopup, dismissPopup, clickPopup, submitPopupInput } = usePopupEngine();

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
      <PopupCenter
        popup={currentPopup}
        onDismiss={dismissPopup}
        onClick={clickPopup}
        onInputSubmit={submitPopupInput}
      />
    </AnalyticsContext.Provider>
  );
};
