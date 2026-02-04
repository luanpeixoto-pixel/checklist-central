import { createContext, useContext, type ReactNode } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePopupTriggers } from "@/hooks/usePopupTriggers";
import { DynamicPopup } from "./DynamicPopup";

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
  const { currentPopup, submitResponse, dismissPopup } = usePopupTriggers();

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
      {currentPopup && (
        <DynamicPopup
          popup={currentPopup.popup}
          onSubmit={submitResponse}
          onDismiss={dismissPopup}
        />
      )}
    </AnalyticsContext.Provider>
  );
};
