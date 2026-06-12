"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { LoginScreen } from "@/components/auth/auth-screen";

function LoginWithRedirect() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? undefined;
  return <LoginScreen redirectTo={redirectTo} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginWithRedirect />
    </Suspense>
  );
}
