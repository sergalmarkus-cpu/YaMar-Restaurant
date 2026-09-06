import SalesAnalyticsView from "./components/SalesAnalyticsView";

export const metadata = {
  title: "Analíticas de ventas - YaMar Admin",
  description:
    "Análisis de ventas, pedidos, clientes y ticket medio del establecimiento",
};

export default function AnalyticsPage() {
  return <SalesAnalyticsView />;
}