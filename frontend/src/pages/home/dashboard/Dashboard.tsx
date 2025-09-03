import type React from "react"
import { useState } from "react"
import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInset,
} from "@/components/ui/sidebar"

import DashboardContent from "./DashboardContent"
import ProfileContent from "./ProfileContent"
import PreviousJobsContent from "./PreviousJobsContent"
import {
    LayoutDashboard,
    User,
    Briefcase,
    LogOut,
} from "lucide-react"

export const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "previous-jobs">("dashboard")

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" className="bg-gray-900 text-gray-200 border-r border-gray-700">
                <SidebarHeader className="p-6 flex flex-col items-center space-y-4">
                    <h1 className="text-2xl font-bold text-white bg-clip-text">
                        <span className="hidden group-data-[state=expanded]:block">MOCKLY</span>
                        <span className="block group-data-[state=collapsed]:block group-data-[state=expanded]:hidden">M</span>
                    </h1>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center bg-gray-700 rounded-full transition-all duration-300
        group-data-[state=expanded]:w-14 group-data-[state=expanded]:h-14
        group-data-[state=collapsed]:w-10 group-data-[state=collapsed]:h-10">
                            <User className="w-7 h-7 text-gray-200 hidden group-data-[state=expanded]:block" />
                            <span className="text-sm font-semibold text-white hidden group-data-[state=collapsed]:block">JD</span>
                        </div>

                        <span className="mt-2 text-gray-300 text-sm font-medium hidden group-data-[state=expanded]:block">
                            John Doe
                        </span>
                    </div>
                </SidebarHeader>


                <SidebarContent className="mt-6 pl-2">
                    <SidebarMenu className="space-y-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setActiveTab("dashboard")}
                                isActive={activeTab === "dashboard"}
                                className={`px-5 py-3 text-base rounded-none transition-colors ${activeTab === "dashboard"
                                    ? "bg-gradient-to-br from-[#0b4173] to-[#92caff] text-white shadow-md"
                                    : "hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <LayoutDashboard className="w-6 h-6" />
                                <span>Dashboard</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setActiveTab("profile")}
                                isActive={activeTab === "profile"}
                                className={`px-5 py-3 text-base rounded-none transition-colors ${activeTab === "profile"
                                    ? "bg-gradient-to-br from-[#0b4173] to-[#92caff] text-white shadow-md"
                                    : "hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <User className="w-6 h-6" />
                                <span>Profile</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setActiveTab("previous-jobs")}
                                isActive={activeTab === "previous-jobs"}
                                className={`px-5 py-3 text-base rounded-none transition-colors ${activeTab === "previous-jobs"
                                    ? "bg-gradient-to-br from-[#0b4173] to-[#92caff] text-white shadow-md"
                                    : "hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <Briefcase className="w-6 h-6" />
                                <span>Previous Jobs</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="p-4 mt-auto">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="px-5 py-3 text-base rounded-none hover:bg-gray-800 hover:text-white transition-colors">
                                <LogOut className="w-6 h-6" />
                                <span>Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-black">
                    <SidebarTrigger />
                    <h2 className="text-lg font-semibold text-white capitalize">{activeTab}</h2>
                </div>

                <main className="flex-1 bg-black p-6">
                    {activeTab === "dashboard" && <DashboardContent />}
                    {activeTab === "profile" && <ProfileContent />}
                    {activeTab === "previous-jobs" && <PreviousJobsContent />}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Dashboard
