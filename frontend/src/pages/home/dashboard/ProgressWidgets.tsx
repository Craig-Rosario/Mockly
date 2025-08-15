import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Target,
    TrendingUp,
    Calendar,
    CheckCircle,
    Clock,
    BookOpen,
    Award,
    Zap,
    ArrowUp,
    ArrowDown
} from "lucide-react"
import { motion } from "framer-motion"

interface ProgressWidgetsProps {
    className?: string
}

export function ProgressWidgets({ className }: ProgressWidgetsProps) {
    const stats = [
        {
            title: "Applications Sent",
            value: 24,
            target: 30,
            change: "+3",
            changeType: "positive" as const,
            icon: Target,
            color: "bg-blue-500"
        },
        {
            title: "Interviews Scheduled",
            value: 8,
            target: 10,
            change: "+2",
            changeType: "positive" as const,
            icon: Calendar,
            color: "bg-green-500"
        },
        {
            title: "Skills Practiced",
            value: 15,
            target: 20,
            change: "+1",
            changeType: "positive" as const,
            icon: BookOpen,
            color: "bg-purple-500"
        },
        {
            title: "Mock Interviews",
            value: 5,
            target: 8,
            change: "0",
            changeType: "neutral" as const,
            icon: Award,
            color: "bg-orange-500"
        }
    ]

    const weeklyProgress = [
        { day: "Mon", applications: 2, interviews: 1 },
        { day: "Tue", applications: 3, interviews: 0 },
        { day: "Wed", applications: 1, interviews: 2 },
        { day: "Thu", applications: 4, interviews: 1 },
        { day: "Fri", applications: 2, interviews: 0 },
        { day: "Sat", applications: 1, interviews: 1 },
        { day: "Sun", applications: 0, interviews: 0 }
    ]

    const upcomingInterviews = [
        {
            company: "TechCorp",
            position: "Senior Frontend Developer",
            date: "Jan 20, 2024",
            time: "2:00 PM",
            type: "Technical"
        },
        {
            company: "StartupXYZ",
            position: "React Developer",
            date: "Jan 22, 2024",
            time: "10:00 AM",
            type: "Behavioral"
        },
        {
            company: "MegaCorp",
            position: "Full Stack Engineer",
            date: "Jan 25, 2024",
            time: "3:30 PM",
            type: "System Design"
        }
    ]

    const getChangeIcon = (changeType: "positive" | "negative" | "neutral") => {
        if (changeType === "positive") return <ArrowUp className="h-3 w-3 text-green-600" />
        if (changeType === "negative") return <ArrowDown className="h-3 w-3 text-red-600" />
        return <Clock className="h-3 w-3 text-gray-400" />
    }

    const getChangeColor = (changeType: "positive" | "negative" | "neutral") => {
        if (changeType === "positive") return "text-green-600"
        if (changeType === "negative") return "text-red-600"
        return "text-gray-500"
    }

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    const progress = (stat.value / stat.target) * 100

                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="relative overflow-hidden bg-gray-800 border-gray-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm ${getChangeColor(stat.changeType)}`}>
                                            {getChangeIcon(stat.changeType)}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                                            <span className="text-sm text-gray-400">/ {stat.target}</span>
                                        </div>
                                        <p className="text-sm text-gray-300">{stat.title}</p>
                                        <Progress
                                            value={progress}
                                            className="h-2 border border-gray-500 bg-gray-700 [&>div]:bg-white"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <TrendingUp className="h-5 w-5 text-blue-400" />
                                Weekly Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {weeklyProgress.map((day) => (
                                    <div key={day.day} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-300 w-12">{day.day}</span>
                                        <div className="flex-1 mx-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(day.applications / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400 w-8">{day.applications}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-green-400" />
                                            <span className="text-xs text-gray-300">{day.interviews}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    Applications
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Calendar className="h-3 w-3 text-green-400" />
                                    Interviews
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Calendar className="h-5 w-5 text-green-400" />
                                Upcoming Interviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingInterviews.map((interview, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        className="p-3 border border-gray-700 rounded-lg hover:shadow-sm transition-shadow bg-gray-700"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-medium text-white">{interview.company}</h4>
                                                <p className="text-sm text-gray-300">{interview.position}</p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${interview.type === "Technical"
                                                        ? "border-blue-200 text-blue-700 bg-blue-50"
                                                        : interview.type === "Behavioral"
                                                            ? "border-green-200 text-green-700 bg-green-50"
                                                            : "border-purple-200 text-purple-700 bg-purple-50"
                                                    }`}
                                            >
                                                {interview.type}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <span>{interview.date}</span>
                                            <span>{interview.time}</span>
                                        </div>
                                    </motion.div>
                                ))}
                                {upcomingInterviews.length === 0 && (
                                    <div className="text-center py-6">
                                        <Calendar className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">No upcoming interviews</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Zap className="h-5 w-5 text-yellow-400" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:shadow-md transition-all bg-gradient-to-br from-blue-900/30 to-blue-800/30 hover:from-blue-900/50 hover:to-blue-800/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">Practice Questions</h4>
                                        <p className="text-sm text-gray-300">Review common questions</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:shadow-md transition-all bg-gradient-to-br from-green-900/30 to-green-800/30 hover:from-green-900/50 hover:to-green-800/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <Award className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">Mock Interview</h4>
                                        <p className="text-sm text-gray-300">Start practice session</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:shadow-md transition-all bg-gradient-to-br from-purple-900/30 to-purple-800/30 hover:from-purple-900/50 hover:to-purple-800/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">Review Progress</h4>
                                        <p className="text-sm text-gray-300">Check your improvements</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
