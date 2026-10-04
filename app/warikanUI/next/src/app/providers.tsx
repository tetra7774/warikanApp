// app/providers.tsx
"use client";

// import { ChakraProvider } from "@chakra-ui/react";

import { system } from "@/thema/thema";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
// }

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
