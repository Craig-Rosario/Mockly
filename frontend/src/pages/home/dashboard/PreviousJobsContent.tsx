import {
    Card,
    CardHeader,
    CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import {
    Briefcase,
    FileText,
    Calendar,
    Target,
    CheckCircle,
} from "lucide-react"
const PreviousJobsContent = () => {
    return (
        <div className="flex-1 p-6 bg-black text-white overflow-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Hi User
                    </h2>
                </div>
            </div>

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

            <div className="mt-25">
                <div className="space-y-5">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Perfect Match</span>
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
                                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Good Match</span>
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

                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Perfect Match</span>
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
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Poor Match</span>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: 55 },
                                                            { name: "Remaining", value: 45 },
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
                                                <span className="text-blue-400 text-xs font-bold">55%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Profile Match</p>
                                            <p className="text-blue-400 font-semibold">55%</p>
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
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Perfect Match</span>
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
                                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Good Match</span>
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

export default PreviousJobsContent