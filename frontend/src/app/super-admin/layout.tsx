import SuperAdminLayout from '@/components/layout/SuperAdminLayout';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Super Admin | Meys',
  description: 'Panel de control principal del sistema',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" />
      <SuperAdminLayout>{children}</SuperAdminLayout>
    </>
  );
}
