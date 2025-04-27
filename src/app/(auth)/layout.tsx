import AuthBanner from '@/components/auth/banner';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthBanner />
      {children}
    </>
  );
}
