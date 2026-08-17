import type { Metadata } from "next";

import { ForgotPasswordScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
