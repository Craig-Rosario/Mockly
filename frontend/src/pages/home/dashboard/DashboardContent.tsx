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
import { PieChart, Pie, Cell, Label as RechartsLabel, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
    BarChart3,
    Plus,
    FileText,
    CheckCircle,
    Target,
    Calendar,
    Star,
    Award,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import { jobApplicationApi } from "@/lib/api"

interface User {
    _id: string;
    name: string;
    email: string;
    clerkId: string;
}

interface JobApplication {
    _id: string;
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    company: string;
    location: string;
    workMode: string;
    status: string;
    appliedOn: string;
    mcqResults?: {
        score: number;
        totalQuestions: number;
        correctAnswers: number;
    };
    interviewResults?: {
        overallScore: number;
    };
    finalReport?: {
        metrics: {
            mcqScore: number;
            resumeScore: number;
            jobMatch: number;
            totalScore: number;
        };
        reportStatus: string;
    };
}

const DashboardContent: React.FC = () => {
    const { getToken } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                
                const userRes = await fetch("/api/users/current-user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await userRes.json();
                setUser(userData);

                const applications = await jobApplicationApi.getAllApplications(token || undefined);
                setJobApplications(applications);
            } catch (err) {
                console.log("Cannot fetch data:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [getToken]);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/add-jobs/personal-details')
    }

    const totalApplications = jobApplications.length;
    const totalMcqTests = jobApplications.filter(app => app.mcqResults).length;

    const getMatchPercentage = (application: JobApplication) => {
        if (application.finalReport?.metrics?.totalScore !== undefined) {
            const totalScore = application.finalReport.metrics.totalScore;
            return Math.max(0, Math.min(100, Math.round(totalScore)));
        }

        let score = 0;
        let total = 0;

        if (application.mcqResults) {
            score += (application.mcqResults.correctAnswers / application.mcqResults.totalQuestions) * 50;
            total += 50;
        }

        if (application.interviewResults) {
            score += application.interviewResults.overallScore * 0.5;
            total += 50;
        }

        if (total === 0) return Math.floor(Math.random() * 41) + 60;
        return Math.round((score / total) * 100);
    };

    const calculateJobAnalysisData = () => {
        const perfect = jobApplications.filter(app => getMatchPercentage(app) >= 85).length;
        const good = jobApplications.filter(app => getMatchPercentage(app) >= 70 && getMatchPercentage(app) < 85).length;
        const partial = jobApplications.filter(app => getMatchPercentage(app) >= 50 && getMatchPercentage(app) < 70).length;
        const poor = jobApplications.filter(app => getMatchPercentage(app) < 50).length;

        const total = perfect + good + partial + poor;
        
        if (total === 0) {
            return [
                { name: "Perfect Match", value: 35, color: "#10B981" },
                { name: "Good Match", value: 15, color: "#3B82F6" },
                { name: "Partial Match", value: 8, color: "#F59E0B" },
                { name: "Poor Match", value: 12, color: "#EF4444" },
            ];
        }

        return [
            { name: "Perfect Match", value: Math.round((perfect / total) * 100), color: "#10B981" },
            { name: "Good Match", value: Math.round((good / total) * 100), color: "#3B82F6" },
            { name: "Partial Match", value: Math.round((partial / total) * 100), color: "#F59E0B" },
            { name: "Poor Match", value: Math.round((poor / total) * 100), color: "#EF4444" },
        ];
    };

    const jobAnalysisData = calculateJobAnalysisData();

    const getRecentActivities = () => {
        const recentApps = jobApplications
            .sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime())
            .slice(0, 4);

        return recentApps.map(app => ({
            action: `Applied to ${app.jobTitle} at ${app.company}`,
            time: new Date(app.appliedOn).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }),
            type: "application" as const
        }));
    };

    const recentActivities = jobApplications.length > 0 ? getRecentActivities() : [
        { action: "Applied to Senior Developer at TechCorp", time: "2 hours ago", type: "application" as const },
        { action: "Resume updated with new skills", time: "1 day ago", type: "update" as const },
        { action: "Follow-up sent to Google recruiter", time: "2 days ago", type: "followup" as const },
    ];

    const applicationsThisWeek = jobApplications.filter(app => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(app.appliedOn) >= oneWeekAgo;
    }).length;

    const mcqTestsThisWeek = jobApplications.filter(app => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return app.mcqResults && new Date(app.appliedOn) >= oneWeekAgo;
    }).length;

    const avgMatchThisWeek = () => {
        const weekApps = jobApplications.filter(app => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(app.appliedOn) >= oneWeekAgo;
        });
        
        if (weekApps.length === 0) return 0;
        
        const total = weekApps.reduce((acc, app) => {
            const percentage = getMatchPercentage(app);
            return acc + (isNaN(percentage) ? 0 : percentage);
        }, 0);
        
        const average = Math.round(total / weekApps.length);
        return isNaN(average) ? 0 : average;
    };

    const pendingFollowups = jobApplications.filter(app => 
        app.status === 'applied' || app.status === 'interview'
    ).length;

    const bestMatchJob = () => {
        if (jobApplications.length === 0) return null;
        return jobApplications.reduce((best, app) => {
            const match = getMatchPercentage(app);
            return match > getMatchPercentage(best) ? app : best;
        });
    };

    const bestMatch = bestMatchJob();

    const weeklyActivityData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const result = days.map(day => ({ day, applications: 0 }));
        
        jobApplications.forEach(app => {
            const appDate = new Date(app.appliedOn);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            if (appDate >= oneWeekAgo) {
                const dayIndex = appDate.getDay();
                const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                result[adjustedIndex].applications++;
            }
        });
        
        return result;
    };

    if (loading) {
        return (
            <div className="flex-1 p-6 bg-black text-white overflow-auto">
                <div className="flex items-center justify-center h-64">
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 bg-black text-white overflow-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    {user ? (
                        <h2 className="text-3xl font-bold bg-clip-text text-white">
                            Hi {user.name}
                        </h2>
                    ) : (
                        <h2 className="text-3xl font-bold bg-clip-text text-white">Hi User</h2>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">{totalApplications}</div>
                        <p className="text-gray-400">Total Applications</p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">{totalMcqTests}</div>
                        <p className="text-gray-400">MCQ Tests</p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {(() => {
                                if (jobApplications.length === 0) return '0';
                                const total = jobApplications.reduce((acc, app) => {
                                    const percentage = getMatchPercentage(app);
                                    return acc + (isNaN(percentage) ? 0 : percentage);
                                }, 0);
                                const average = Math.round(total / jobApplications.length);
                                return isNaN(average) ? '0' : average.toString();
                            })()}%
                        </div>
                        <p className="text-gray-400">Avg Match</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-8">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col max-w-lg items-left">
                            <h3 className="text-2xl font-semibold text-white mb-2">
                                Job Management
                            </h3>
                            <p className="text-white/80">
                                Add new job applications or review your previous submissions
                            </p>
                        </div>

                        <Button className="mt-5 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 font-medium px-4 py-2 rounded-lg shadow-md flex items-center"
                            onClick={handleClick}
                        >
                            <Plus className="w-4 h-4 mr-2 white" />
                            Add Job Application
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="">
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
                                className="h-[250px] w-[250px] mx-auto"
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

                            <div className="ml-8 space-y-3">
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

                <Card className="">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => {
                                const dotColors = {
                                    application: "bg-blue-400",
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

            <Card className="">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-400" />
                        Weekly Performance Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="text-white font-semibold mb-4">Weekly Stats</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Applications</span>
                                        <span className="text-blue-400 font-bold">{applicationsThisWeek}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">MCQ Tests</span>
                                        <span className="text-purple-400 font-bold">{mcqTestsThisWeek}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Avg Match Rate</span>
                                        <span className="text-orange-400 font-bold">{avgMatchThisWeek()}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Pending Actions</span>
                                        <span className="text-red-400 font-bold">{pendingFollowups}</span>
                                    </div>
                                </div>
                            </div>

                            {bestMatch && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h4 className="text-white font-semibold mb-3 flex items-center">
                                        <Award className="w-4 h-4 mr-2 text-yellow-400" />
                                        Best Match
                                    </h4>
                                    <p className="text-white font-bold text-lg mb-1">{bestMatch.jobTitle}</p>
                                    <p className="text-gray-300 text-sm mb-3">{bestMatch.company}</p>
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                                        <span className="text-white font-bold">{getMatchPercentage(bestMatch)}% Match</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-3 bg-gray-800 rounded-lg p-4 flex flex-col">
                            <h4 className="text-white font-semibold mb-4">Daily Activity</h4>
                            <div className="h-64 flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={weeklyActivityData()} 
                                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="day" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1F2937', 
                                                border: 'none', 
                                                borderRadius: '8px',
                                                color: '#F9FAFB'
                                            }}
                                        />
                                        <Bar 
                                            dataKey="applications" 
                                            fill="#3B82F6" 
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardContent;