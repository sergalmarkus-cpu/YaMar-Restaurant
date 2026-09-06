import InvoicesManager from "./components/InvoicesManager";

export const metadata = {
  title: "Facturas - YaMar Admin",
  description:
    "Consulta y gestión de facturas y recibos del establecimiento",
};

export default function InvoicesPage() {
  return <InvoicesManager />;
}