import KitchenHeader from "./components/KitchenHeader";
import KitchenStats from "./components/KitchenStats";
import KitchenBoard from "./components/KitchenBoard";

export default function KitchenPage() {
  return (
    <div className="space-y-6">

      <KitchenHeader />

      <KitchenStats />

      <KitchenBoard />

    </div>
  );
}