import { createContext, useContext, type ReactNode } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { PopupHost } from "@/components/popup/PopupHost";

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

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
      <PopupHost />
    </AnalyticsContext.Provider>
  );
};
