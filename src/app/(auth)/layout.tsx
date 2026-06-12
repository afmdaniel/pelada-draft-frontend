export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-1 flex-col bg-background sm:border-x sm:border-line-soft">
      {children}
    </div>
  );
}
