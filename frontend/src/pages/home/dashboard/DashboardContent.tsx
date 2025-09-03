import type React from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, Label as RechartsLabel } from "recharts"
import {
    LayoutDashboard,
    Calendar,
    Target,
    BarChart3,
    Plus,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
const DashboardContent: React.FC = () => {
    const navigate=useNavigate();
    const handleClick=()=>{
        navigate('/add-jobs/personal-details')
    }

    interface JobAnalysisData {
        name: string
        value: number
        color: string
    }
    interface Activity {
        action: string
        time: string
        type: "application" | "interview" | "update" | "followup"
    }
    const jobAnalysisData: JobAnalysisData[] = [
        { name: "Perfect Match", value: 35, color: "#10B981" },
        { name: "Good Match", value: 15, color: "#3B82F6" },
        { name: "Partial Match", value: 8, color: "#F59E0B" },
        { name: "Poor Match", value: 12, color: "#EF4444" },
    ]
    const recentActivities: Activity[] = [
        { action: "Applied to Senior Developer at TechCorp", time: "2 hours ago", type: "application" },
        { action: "Interview scheduled with StartupXYZ", time: "5 hours ago", type: "interview" },
        { action: "Resume updated with new skills", time: "1 day ago", type: "update" },
        { action: "Follow-up sent to Google recruiter", time: "2 days ago", type: "followup" },
    ]
    console.log("[v0] Rendering dashboard with job analysis data:", jobAnalysisData)

    return (
        <div className="flex-1 p-6 bg-black text-white overflow-auto">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-white">
                        Hi User
                    </h2>
                </div>
            </div>


            <Card className="mb-8 rounded-2xl shadow-lg p-6">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">

                        <div className="flex flex-col max-w-lg items-left">
                            <h3 className="text-2xl font-semibold text-white mb-2 ">
                                Job Management
                            </h3>
                            <p className="text-white/80">
                                Add new job applications or review your previous submissions
                            </p>
                        </div>


                        <Button className="mt-5 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 font-medium px-4 py-2 rounded-lg shadow-md  flex items-center"
                            onClick={handleClick}
                        >
                            <Plus className="w-4 h-4 mr-2 white" />
                            Add Job Application
                        </Button>
                    </div>
                </CardContent>
            </Card>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                <Card>
                    <CardHeader>
                        <CardTitle className="flex">
                            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                            Recent Job Analysis
                        </CardTitle>
                        <p className="text-gray-400 text-sm mt-1">Analysis of your job applications</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">

                            <ChartContainer
                                config={{
                                    perfect: { label: "Perfect Match", color: "#10B981" },
                                    good: { label: "Good Match", color: "#3B82F6" },
                                    partial: { label: "Partial Match", color: "#F59E0B" },
                                    poor: { label: "Poor Match", color: "#EF4444" },
                                }}
                                className="h-[250px] w-[250px]"
                            >
                                <PieChart>
                                    <Pie
                                        data={jobAnalysisData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={110}
                                        stroke="none"
                                        cx="50%"
                                        cy="50%"
                                    >
                                        {jobAnalysisData.map((item, idx) => (
                                            <Cell key={idx} fill={item.color} />
                                        ))}
                                        <RechartsLabel
                                            content={({ viewBox }) => {
                                                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                                                const total = jobAnalysisData.reduce((acc, curr) => acc + curr.value, 0)

                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        className="fill-gray-400 text-3xl font-bold"
                                                    >
                                                        {total}%
                                                    </text>
                                                )
                                            }}
                                        />
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                </PieChart>
                            </ChartContainer>

                            <div className="ml-15 space-y-3">
                                {jobAnalysisData.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-gray-300 flex-1">{item.name}</span>
                                        <span className="text-white font-semibold">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-white">This Week</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300 flex items-center">
                                    <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                                    Applications
                                </span>
                                <span className="text-blue-400 font-semibold">13/20</span>
                            </div>
                            <Progress value={65} className="[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                    Interviews
                                </span>
                                <span className="text-purple-400 font-semibold">8/10</span>
                            </div>
                            <Progress value={80} className="[&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-purple-600" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300 flex items-center">
                                    <Target className="w-4 h-4 mr-2 text-green-400" />
                                    Follow-ups
                                </span>
                                <span className="text-green-400 font-semibold">5/8</span>
                            </div>
                            <Progress value={62} className="[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">Common tasks to boost your job search</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-orange-400 hover:from-red-500/30 hover:to-orange-500/30 flex-col h-20 space-y-2"
                            >
                                <Target className="w-5 h-5 text-orange-400" />
                                <span className="text-orange-400 text-sm">Start Practice Session</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-cyan-400 hover:from-blue-500/30 hover:to-cyan-500/30 flex-col h-20 space-y-2"
                            >
                                <BarChart3 className="w-5 h-5 text-cyan-400" />
                                <span className="text-cyan-400 text-sm">View Analytics</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-emerald-400 hover:from-green-500/30 hover:to-emerald-500/30 flex-col h-20 space-y-2"
                            >
                                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                                <span className="text-emerald-400 text-sm">Browse Jobs</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-gradient-to-r from-purple-500/20 to-purple-400/20 border-purple-400 hover:from-purple-500/30 hover:to-purple-400/30 flex-col h-20 space-y-2"
                            >
                                <Calendar className="w-5 h-5 text-purple-500" />
                                <span className="text-purple-500 text-sm">AI Interview Online</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => {
                                const dotColors = {
                                    application: "bg-blue-400",
                                    interview: "bg-green-400",
                                    update: "bg-purple-400",
                                    followup: "bg-orange-400",
                                }

                                return (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${dotColors[activity.type]}`}></div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm">{activity.action}</p>
                                            <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
export default DashboardContent;