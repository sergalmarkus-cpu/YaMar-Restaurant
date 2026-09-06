import AdminLayout from "./components/AdminLayout";
import AdminAuthGuard from "./components/AdminAuthGuard";

export const metadata = {
  title:
    "YaMar - Panel de Administración",

  description:
    "Sistema Integral de Gestión del Servicio de Sala",
};

export default function Layout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminAuthGuard>
  );
}