import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider } from "../features/auth/context/AuthContext";
 
export function Providers({ children }: { children: ReactNode }) {
  return (
<BrowserRouter>
<AuthProvider>{children}</AuthProvider>
</BrowserRouter>
  );
}