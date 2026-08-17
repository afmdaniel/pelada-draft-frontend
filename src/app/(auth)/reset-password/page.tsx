"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { ResetPasswordScreen } from "@/components/auth/auth-screen";

function ResetPasswordWithToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  return <ResetPasswordScreen token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordWithToken />
    </Suspense>
  );
}
