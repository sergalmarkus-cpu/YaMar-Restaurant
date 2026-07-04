import AdminLayout from './components/AdminLayout';

export const metadata = {
  title: 'YaMar - Panel de Administración',
  description: 'Sistema Integral de Gestión del Servicio de Sala',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}