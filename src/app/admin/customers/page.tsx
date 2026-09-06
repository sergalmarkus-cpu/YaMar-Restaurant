import CustomersList from "./components/CustomersList";

export const metadata = {
  title:
    "Clientes - YaMar Admin",

  description:
    "Clientes y actividad del establecimiento",
};

export default function CustomersPage() {
  return (
    <CustomersList />
  );
}