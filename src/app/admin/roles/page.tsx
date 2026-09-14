import RolesManager from "./components/RolesManager";

export const metadata = {
  title: "Roles - YaMar Admin",
  description:
    "Consulta los roles y la distribución del personal del establecimiento",
};

export default function RolesPage() {
  return <RolesManager />;
}