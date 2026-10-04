"use client";

import { createContext, FC, ReactNode } from "react";
import { Session } from "next-auth";

type SessionProviderProps = {
  session: Session | null;
  children: ReactNode;
};

export const SessionContext = createContext<Session | null>(null);
export const SessionProvider: FC<SessionProviderProps> = ({
  session,
  children,
}) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
