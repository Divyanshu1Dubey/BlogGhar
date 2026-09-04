'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AdSenseContextType {
  client: string | undefined;
  isEnabled: boolean;
}

const AdSenseContext = createContext<AdSenseContextType>({
  client: undefined,
  isEnabled: false,
});

export function AdSenseProvider({ children }: { children: ReactNode }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const isEnabled = !!client;

  return (
    <AdSenseContext.Provider value={{ client, isEnabled }}>
      {children}
    </AdSenseContext.Provider>
  );
}

export function useAdSense() {
  return useContext(AdSenseContext);
}
