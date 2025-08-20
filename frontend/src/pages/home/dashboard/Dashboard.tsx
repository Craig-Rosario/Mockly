"use client"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"
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
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import {
    LayoutDashboard,
    User,
    Briefcase,
    FileText,
    Calendar,
    Target,
    Upload,
    LogOut,
    Settings,
    BarChart3,
    Clock,
    CheckCircle,
    Plus,
} from "lucide-react"

const COLORS = [
    "#10B981", // emerald-500
    "#3B82F6", // blue-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#8B5CF6", // purple-500
    "#EC4899", // pink-500
    "#06B6D4", // cyan-500
]

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

// Mock data
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


const ProfileContent = () => (
    <div className="flex-1 p-6 bg-black text-white overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Hi Cheryl !
                </h2>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md">
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
            </Button>
        </div>

        {/* Basic User Details */}
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center text-lg text-white">
                    <User className="w-5 h-5 mr-2 text-cyan-400" />
                    Basic User Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                        MD
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white">Mockly Doe</h4>
                        <p className="text-purple-400 font-medium">Senior Software Engineer</p>
                        <p className="text-gray-300 mt-1">San Francisco, CA</p>
                        <p className="text-gray-300 mt-1">mockly.doe@email.com</p>

                        <div className="mt-4">
                            <h5 className="text-white font-medium flex items-center mb-2">
                                <FileText className="w-4 h-4 mr-2 text-yellow-400" />
                                Bio/Designation
                            </h5>
                            <p className="text-gray-300 text-sm">
                                Experienced software engineer with 5+ years in full-stack development. Passionate about building scalable
                                applications and mentoring junior developers.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Resume Section */}
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center text-lg text-white">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Resume
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-medium">John_Doe_Resume.pdf</p>
                            <p className="text-gray-400 text-sm flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-blue-400" />
                                Last updated: 2 days ago
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            className="bg-gray-900 border border-gray-700 text-white"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            View Resume
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            Update Resume
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Resume Performance */}
            <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center text-white text-lg">
                        <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
                        Overall Resume Performance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Overall Score</span>
                            <span className="text-green-400 font-semibold">85%</span>
                        </div>
                        <Progress value={85} className="[&>div]:bg-green-400" />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Confidence Level</span>
                            <span className="text-blue-400 font-semibold">78%</span>
                        </div>
                        <Progress value={78} className="[&>div]:bg-blue-400" />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Completion Rate</span>
                            <span className="text-purple-400 font-semibold">92%</span>
                        </div>
                        <Progress value={92} className="[&>div]:bg-purple-400" />
                    </div>
                </CardContent>
            </Card>

            {/* AI Interview Performance */}
            <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center text-white text-lg">
                        <Target className="w-5 h-5 mr-2 text-blue-400" />
                        Overall AI Interview Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-white">127</div>
                        <p className="text-gray-400">Total Attempts</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-xl font-bold text-cyan-400">84%</div>
                            <p className="text-gray-400 text-sm">Accuracy Rate</p>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-orange-400">2.3 min</div>
                            <p className="text-gray-400 text-sm">Avg Time</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MCQ Performance */}
            <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center text-white text-lg">
                        <CheckCircle className="w-5 h-5 mr-2 text-purple-400" />
                        Overall MCQ Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white">Good</div>
                        <p className="text-gray-400">Performance Level</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-xl font-bold text-pink-400">23</div>
                            <p className="text-gray-400 text-sm">Test Result</p>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-green-400">76%</div>
                            <p className="text-gray-400 text-sm">Success Rate</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
)

const PreviousJobsContent = () => {
    return (
        <div className="flex-1 p-6 bg-black text-white overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Hi User
                    </h2>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">47</div>
                        <p className="text-gray-400">Total Applications</p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">23</div>
                        <p className="text-gray-400">Total Interviews</p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">15</div>
                        <p className="text-gray-400">Total MCQ Tests</p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">76%</div>
                        <p className="text-gray-400">Avg Match</p>
                    </CardContent>
                </Card>
            </div>

            {/* Previous Jobs Analysis */}
            <div className="mt-25">
                <div className="space-y-5">
                    {/* First Grid (Jobs 1 & 2) */}
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job 1 - Senior Software Engineer */}
                            <Card className="">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Senior Software Engineer</h4>
                                        <div className="flex items-center text-gray-400 text-sm mt-1">
                                            <Briefcase className="w-4 h-4 mr-1" />
                                            <span>TechCorp Inc</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">📍 San Francisco, CA</p>
                                    </div>
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Interview</span>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: 92 },
                                                            { name: "Remaining", value: 8 },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={20}
                                                        outerRadius={30}
                                                        startAngle={90}
                                                        endAngle={450}
                                                        dataKey="value"
                                                        stroke="none" 
                                                    >
                                                        <Cell fill="#10b981" />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-green-400 text-xs font-bold">92%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Profile Match</p>
                                            <p className="text-green-400 font-semibold">92%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Mar 16, 2024</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-500 text-gray-300 hover:bg-gray-700">
                                            Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Job 2 - Full Stack Developer */}
                            <Card className="">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Full Stack Developer</h4>
                                        <div className="flex items-center text-gray-400 text-sm mt-1">
                                            <Briefcase className="w-4 h-4 mr-1" />
                                            <span>StartupXYZ</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">📍 Remote</p>
                                    </div>
                                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Applied</span>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: 78 },
                                                            { name: "Remaining", value: 22 },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={20}
                                                        outerRadius={30}
                                                        startAngle={90}
                                                        endAngle={450}
                                                        dataKey="value"
                                                        stroke="none" 
                                                    >
                                                        <Cell fill="#3b82f6" />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-blue-400 text-xs font-bold">78%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Profile Match</p>
                                            <p className="text-blue-400 font-semibold">78%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Mar 16, 2024</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-500 text-gray-300 hover:bg-gray-700">
                                            Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>

                    {/* Second Grid (Jobs 3 & 4) */}
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job 3 - Frontend Engineer */}
                            <Card className="">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Frontend Engineer</h4>
                                        <div className="flex items-center text-gray-400 text-sm mt-1">
                                            <Briefcase className="w-4 h-4 mr-1" />
                                            <span>Design Studios</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">📍 New York, NY</p>
                                    </div>
                                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">Offer</span>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: 85 },
                                                            { name: "Remaining", value: 15 },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={20}
                                                        outerRadius={30}
                                                        startAngle={90}
                                                        endAngle={450}
                                                        dataKey="value"
                                                        stroke="none" 
                                                    >
                                                        <Cell fill="#10b981" />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-green-400 text-xs font-bold">85%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Profile Match</p>
                                            <p className="text-green-400 font-semibold">85%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Mar 10, 2024</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-500 text-gray-300 hover:bg-gray-700">
                                            Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Job 4 - Backend Developer */}
                            <Card className="">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Backend Developer</h4>
                                        <div className="flex items-center text-gray-400 text-sm mt-1">
                                            <Briefcase className="w-4 h-4 mr-1" />
                                            <span>InfraTech Systems</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">📍 Austin, TX</p>
                                    </div>
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Rejected</span>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: 65 },
                                                            { name: "Remaining", value: 35 },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={20}
                                                        outerRadius={30}
                                                        startAngle={90}
                                                        endAngle={450}
                                                        dataKey="value"
                                                        stroke="none" 
                                                    >
                                                        <Cell fill="#3b82f6" />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-blue-400 text-xs font-bold">65%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Profile Match</p>
                                            <p className="text-blue-400 font-semibold">65%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Mar 8, 2024</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-500 text-gray-300 hover:bg-gray-700">
                                            Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>

                    {/* Third Grid (Jobs 5 & 6) */}
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job 5 - DevOps Engineer */}
                            <Card className="">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">DevOps Engineer</h4>
                                        <div className="flex items-center text-gray-400 text-sm mt-1">
                                            <Briefcase className="w-4 h-4 mr-1" />
                                            <span>CloudTech</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">📍 Seattle, WA</p>
                                    </div>
                                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Applied</span>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: 88 },
                                                            { name: "Remaining", value: 12 },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={20}
                                                        outerRadius={30}
                                                        startAngle={90}
                                                        endAngle={450}
                                                        dataKey="value"
                                                        stroke="none" 
                                                    >
                                                        <Cell fill="#10b981" />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-green-400 text-xs font-bold">88%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Profile Match</p>
                                            <p className="text-green-400 font-semibold">88%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Mar 5, 2024</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-500 text-gray-300 hover:bg-gray-700">
                                            Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Job 6 - Product Engineer */}
                            <Card className="">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Product Engineer</h4>
                                        <div className="flex items-center text-gray-400 text-sm mt-1">
                                            <Briefcase className="w-4 h-4 mr-1" />
                                            <span>InnovateLab</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">📍 Los Angeles, CA</p>
                                    </div>
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Interview</span>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: 72 },
                                                            { name: "Remaining", value: 28 },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={20}
                                                        outerRadius={30}
                                                        startAngle={90}
                                                        endAngle={450}
                                                        dataKey="value"
                                                        stroke="none" 
                                                    >
                                                        <Cell fill="#3b82f6" />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-blue-400 text-xs font-bold">72%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Profile Match</p>
                                            <p className="text-blue-400 font-semibold">72%</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Mar 3, 2024</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-500 text-gray-300 hover:bg-gray-700">
                                            Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </div>
            </div>

        </div>
    )
}

const DashboardContent: React.FC = () => {
    console.log("[v0] Rendering dashboard with job analysis data:", jobAnalysisData)

    return (
        <div className="flex-1 p-6 bg-black text-white overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Hi User
                    </h2>
                </div>
            </div>

            {/* Job Management Card */}
            <Card className="mb-8 rounded-2xl shadow-lg p-6">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        {/* Left Content */}
                        <div className="flex flex-col max-w-lg items-left">
                            <h3 className="text-2xl font-semibold text-white mb-2 ">
                                Job Management
                            </h3>
                            <p className="text-white/80">
                                Add new job applications or review your previous submissions
                            </p>
                        </div>

                        {/* Button */}
                        <Button className="mt-5 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 font-medium px-4 py-2 rounded-lg shadow-md  flex items-center">
                            <Plus className="w-4 h-4 mr-2 white" />
                            Add Job Application
                        </Button>
                    </div>
                </CardContent>
            </Card>


            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Job Analysis */}
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
                            {/* Chart with center label */}
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
                                        strokeWidth={5}
                                        cx="50%"
                                        cy="50%"
                                    >
                                        {jobAnalysisData.map((item, idx) => (
                                            <Cell key={idx} fill={item.color} />
                                        ))}

                                        {/* Center label with % */}
                                        <Label
                                            position="center"
                                            content={({ viewBox }) => {
                                                if (!viewBox) return null
                                                const total = jobAnalysisData.reduce(
                                                    (acc, curr) => acc + curr.value,
                                                    0
                                                )
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        className="fill-white text-2xl font-bold"
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

                            {/* Legend on the right */}
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

                {/* This Week */}
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

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
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

                {/* Recent Activity */}
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

export const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "previous-jobs">("dashboard")

    return (
        <SidebarProvider>
            {/* Sidebar */}
            <Sidebar collapsible="icon" className="bg-gray-900 text-gray-200 border-r border-gray-700">
                {/* Header with logo */}
                <SidebarHeader className="p-6 flex flex-col items-center space-y-4">
                    {/* Logo that changes */}
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        <span className="hidden group-data-[state=expanded]:block">MOCKLY</span>
                        <span className="block group-data-[state=collapsed]:block group-data-[state=expanded]:hidden">M</span>
                    </h1>

                    {/* User Icon & Name */}
                    <div className="flex flex-col items-center">
                        {/* Avatar changes size when collapsed */}
                        <div className="flex items-center justify-center bg-gray-700 rounded-full transition-all duration-300
        group-data-[state=expanded]:w-14 group-data-[state=expanded]:h-14
        group-data-[state=collapsed]:w-10 group-data-[state=collapsed]:h-10">
                            {/* Show full User icon when expanded, initials when collapsed */}
                            <User className="w-7 h-7 text-gray-200 hidden group-data-[state=expanded]:block" />
                            <span className="text-sm font-semibold text-white hidden group-data-[state=collapsed]:block">JD</span>
                        </div>

                        {/* Full name (only visible when expanded) */}
                        <span className="mt-2 text-gray-300 text-sm font-medium hidden group-data-[state=expanded]:block">
                            John Doe
                        </span>
                    </div>
                </SidebarHeader>


                {/* Navigation */}
                <SidebarContent className="mt-6 pl-2">
                    <SidebarMenu className="space-y-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setActiveTab("dashboard")}
                                isActive={activeTab === "dashboard"}
                                className={`px-5 py-3 text-base rounded-none transition-colors ${activeTab === "dashboard"
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
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
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
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
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                                    : "hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <Briefcase className="w-6 h-6" />
                                <span>Previous Jobs</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>

                {/* Footer */}
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

            {/* Main Content */}
            <SidebarInset>
                {/* Top bar with trigger */}
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
