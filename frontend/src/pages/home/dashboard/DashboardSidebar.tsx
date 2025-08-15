import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  User,
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  TrendingUp,
  Target
} from "lucide-react"
import { motion } from "framer-motion"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      badge: null
    },
    {
      id: "previous-jobs",
      label: "Previous Jobs",
      icon: Briefcase,
      badge: "12"
    }
  ]

  const quickStats = [
    { label: "Applications", value: "24", icon: Target, color: "bg-blue-500" },
    { label: "Interviews", value: "8", icon: TrendingUp, color: "bg-green-500" }
  ]

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 flex flex-col"
    >

      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Mockly
          </h1>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 shadow-sm border border-gray-700">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-400 truncate">
              Software Engineer
            </p>
          </div>
        </div>
      </div>

      <Separator className="mx-6" />

      <div className="flex-1 px-6 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-11 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            )
          })}
        </nav>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 shadow-sm border border-gray-700"
                >
                  <div
                    className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700">
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700">
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </motion.div>
  )
}
