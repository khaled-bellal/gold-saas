import { useState } from "react";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { StoreProvider } from "./context/StoreContext";
import { Overview } from "./components/dashboard/Overview";
import { Inventory } from "./components/dashboard/Inventory";
import { Sales } from "./components/dashboard/Sales";
import { SettingsModule } from "./components/dashboard/Settings";
import { Analytics } from "./components/dashboard/Analytics";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <StoreProvider>
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === "dashboard" && <Overview />}
        {activeTab === "inventory" && <Inventory />}
        {activeTab === "sales" && <Sales />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "settings" && <SettingsModule />}
      </DashboardLayout>
    </StoreProvider>
  );
}