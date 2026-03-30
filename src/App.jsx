import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import QRScanner from "./pages/QRScanner";
import ValidationSuccess from "./pages/ValidationSuccess";
import ScanHistory from "./pages/ScanHistory";
import Settings from "./pages/Settings";

// Screens: "dashboard" | "scanner" | "validation" | "history" | "settings"
export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "dashboard") setScreen("dashboard");
    else if (tab === "history") setScreen("history");
    else if (tab === "settings") setScreen("settings");
  };

  const handleScan = () => setScreen("scanner");

  const handleScanSuccess = () => setScreen("validation");

  const handleBack = () => {
    setScreen("dashboard");
    setActiveTab("dashboard");
  };

  if (screen === "scanner") {
    return <QRScanner onClose={handleBack} onSuccess={handleScanSuccess} />;
  }

  if (screen === "validation") {
    return (
      <ValidationSuccess
        onBack={handleBack}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  }

  if (screen === "history") {
    return <ScanHistory activeTab={activeTab} onTabChange={handleTabChange} />;
  }

  if (screen === "settings") {
    return <Settings activeTab={activeTab} onTabChange={handleTabChange} />;
  }

  return (
    <Dashboard
      onScan={handleScan}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}
