import PaymentsManager from "./components/PaymentsManager";

export const metadata = {
  title:
    "Cobros - YaMar Admin",

  description:
    "Gestión de cobros y estados de pago del establecimiento",
};

export default function PaymentsPage() {
  return (
    <PaymentsManager />
  );
}