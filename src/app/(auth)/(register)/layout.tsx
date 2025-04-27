import { RegisterFormContextProvider } from '@/features/auth/components/register-form-context-provider';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegisterFormContextProvider>
      <main className="mx-auto max-w-[570px] px-4 pb-[180px]">{children}</main>
    </RegisterFormContextProvider>
  );
}
