import { useState } from "react"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardContent } from "./DashboardContent"
import { ProfileContent } from "./ProfileContent"
import { PreviousJobsContent } from "./PreviousJobsContent"

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      case "profile":
        return <ProfileContent />
      case "previous-jobs":
        return <PreviousJobsContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto bg-gray-900">
        {renderContent()}
      </main>
    </div>
  )
}
