import PaymentMethodsManager from "./components/PaymentMethodsManager";

export const metadata = {
  title:
    "Métodos de pago - YaMar Admin",
  description:
    "Configuración de métodos de pago del establecimiento",
};

export default function PaymentMethodsPage() {
  return (
    <PaymentMethodsManager />
  );
}