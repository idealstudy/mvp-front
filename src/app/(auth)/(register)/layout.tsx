import { RegisterFormContextProvider } from '@/features/auth/components/RegisterFormContextProvider';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegisterFormContextProvider>{children}</RegisterFormContextProvider>;
}
