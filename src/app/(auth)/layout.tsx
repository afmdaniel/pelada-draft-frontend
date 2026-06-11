import { Volleyball } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Volleyball className="size-5" />
        </span>
        <span className="font-heading text-xl font-semibold">Pelada Draft</span>
      </div>
      {children}
    </div>
  );
}
