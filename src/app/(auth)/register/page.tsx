import type { Metadata } from "next";

import { RegisterScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}
