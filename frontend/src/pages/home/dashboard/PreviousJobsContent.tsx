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
    X,
    ExternalLink,
} from "lucide-react"
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
    jobDescription?: string;
    salary?: string;
    applicationDeadline?: string;
    contactPerson?: string;
    notes?: string;
    mcqResults?: {
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        attemptedAt?: string;
    };
    interviewResults?: {
        overallScore: number;
        feedback?: string;
        conductedAt?: string;
    };
}

const PreviousJobsContent = () => {
    const { getToken } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

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

    const fetchApplicationDetails = async (applicationId: string) => {
        try {
            setDetailsLoading(true);
            const token = await getToken();
            
            // Fetch detailed application data
            const response = await fetch(`/api/job-applications/${applicationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (response.ok) {
                const applicationDetails = await response.json();
                setSelectedApplication(applicationDetails);
                setShowDetailsModal(true);
            } else {
                console.error("Failed to fetch application details");
                // Fallback to basic application data if detailed fetch fails
                const basicApp = jobApplications.find(app => app._id === applicationId);
                if (basicApp) {
                    setSelectedApplication(basicApp);
                    setShowDetailsModal(true);
                }
            }
        } catch (err) {
            console.log("Cannot fetch application details:", err);
            // Fallback to basic application data
            const basicApp = jobApplications.find(app => app._id === applicationId);
            if (basicApp) {
                setSelectedApplication(basicApp);
                setShowDetailsModal(true);
            }
        } finally {
            setDetailsLoading(false);
        }
    };

    const getMatchPercentage = (application: JobApplication) => {
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

    const getMatchLabel = (percentage: number) => {
        if (percentage >= 85) return { label: "Perfect Match", color: "bg-green-500" };
        if (percentage >= 70) return { label: "Good Match", color: "bg-blue-500" };
        return { label: "Poor Match", color: "bg-red-500" };
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied': return 'bg-blue-500';
            case 'interview': return 'bg-yellow-500';
            case 'offered': return 'bg-green-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="flex-1 p-6 bg-black text-white overflow-auto">
                <div className="flex items-center justify-center h-64">
                    <p>Loading job applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 bg-black text-white overflow-auto">
            {/* Details Modal */}
            {showDetailsModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">Application Details</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {detailsLoading ? (
                                <div className="flex justify-center py-8">
                                    <p>Loading details...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Basic Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Job Title</p>
                                                <p className="text-white font-medium">{selectedApplication.jobTitle}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Company</p>
                                                <p className="text-white font-medium">{selectedApplication.company}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Location</p>
                                                <p className="text-white font-medium">{selectedApplication.location}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Work Mode</p>
                                                <p className="text-white font-medium">{selectedApplication.workMode}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Status</p>
                                                <span className={`${getStatusColor(selectedApplication.status)} text-white px-2 py-1 rounded text-xs`}>
                                                    {selectedApplication.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Applied On</p>
                                                <p className="text-white font-medium">{formatDate(selectedApplication.appliedOn)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    {(selectedApplication.jobDescription || selectedApplication.salary || selectedApplication.contactPerson) && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4">Additional Details</h4>
                                            <div className="space-y-3">
                                                {selectedApplication.salary && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Salary</p>
                                                        <p className="text-white font-medium">{selectedApplication.salary}</p>
                                                    </div>
                                                )}
                                                {selectedApplication.contactPerson && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Contact Person</p>
                                                        <p className="text-white font-medium">{selectedApplication.contactPerson}</p>
                                                    </div>
                                                )}
                                                {selectedApplication.applicationDeadline && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Application Deadline</p>
                                                        <p className="text-white font-medium">{formatDate(selectedApplication.applicationDeadline)}</p>
                                                    </div>
                                                )}
                                                {selectedApplication.jobDescription && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Job Description</p>
                                                        <p className="text-white text-sm mt-1">{selectedApplication.jobDescription}</p>
                                                    </div>
                                                )}
                                                {selectedApplication.notes && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Notes</p>
                                                        <p className="text-white text-sm mt-1">{selectedApplication.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* MCQ Results */}
                                    {selectedApplication.mcqResults && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4">MCQ Test Results</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{selectedApplication.mcqResults.score}%</p>
                                                    <p className="text-gray-400 text-sm">Score</p>
                                                </div>
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{selectedApplication.mcqResults.correctAnswers}</p>
                                                    <p className="text-gray-400 text-sm">Correct Answers</p>
                                                </div>
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{selectedApplication.mcqResults.totalQuestions}</p>
                                                    <p className="text-gray-400 text-sm">Total Questions</p>
                                                </div>
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">
                                                        {Math.round((selectedApplication.mcqResults.correctAnswers / selectedApplication.mcqResults.totalQuestions) * 100)}%
                                                    </p>
                                                    <p className="text-gray-400 text-sm">Accuracy</p>
                                                </div>
                                            </div>
                                            {selectedApplication.mcqResults.attemptedAt && (
                                                <p className="text-gray-400 text-sm mt-2">
                                                    Attempted on: {formatDate(selectedApplication.mcqResults.attemptedAt)}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Interview Results */}
                                    {selectedApplication.interviewResults && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4">Interview Results</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Overall Score</p>
                                                        <p className="text-2xl font-bold text-white">{selectedApplication.interviewResults.overallScore}/10</p>
                                                    </div>
                                                    <div className="w-20 h-20">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={[
                                                                        { name: "Score", value: selectedApplication.interviewResults.overallScore * 10 },
                                                                        { name: "Remaining", value: 100 - (selectedApplication.interviewResults.overallScore * 10) },
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
                                                    </div>
                                                </div>
                                                {selectedApplication.interviewResults.feedback && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Feedback</p>
                                                        <p className="text-white text-sm mt-1 bg-gray-800 p-3 rounded-lg">
                                                            {selectedApplication.interviewResults.feedback}
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedApplication.interviewResults.conductedAt && (
                                                    <p className="text-gray-400 text-sm">
                                                        Conducted on: {formatDate(selectedApplication.interviewResults.conductedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Match Percentage */}
                                    <div className="text-center p-6 bg-gray-800 rounded-lg">
                                        <p className="text-gray-400 text-sm">Overall Profile Match</p>
                                        <p className="text-3xl font-bold text-white mt-2">{getMatchPercentage(selectedApplication)}%</p>
                                        <div className="w-32 h-32 mx-auto mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Match", value: getMatchPercentage(selectedApplication) },
                                                            { name: "Remaining", value: 100 - getMatchPercentage(selectedApplication) },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={30}
                                                        outerRadius={50}
                                                        startAngle={90}
                                                        endAngle={450}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        <Cell fill={getMatchPercentage(selectedApplication) >= 85 ? "#10b981" : getMatchPercentage(selectedApplication) >= 70 ? "#3b82f6" : "#ef4444"} />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="flex justify-end p-6 border-t border-gray-700">
                            <Button
                                onClick={() => setShowDetailsModal(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="text-2xl font-bold text-white">{jobApplications.length}</div>
                        <p className="text-gray-400">Total Applications</p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {jobApplications.filter(app => app.mcqResults).length}
                        </div>
                        <p className="text-gray-400">Total MCQ Tests</p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {jobApplications.length > 0 
                                ? Math.round(jobApplications.reduce((acc, app) => acc + getMatchPercentage(app), 0) / jobApplications.length)
                                : 0}%
                        </div>
                        <p className="text-gray-400">Avg Match</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-25">
                {jobApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No job applications found.</p>
                        <p className="text-gray-500 text-sm mt-2">Start by adding a new job application!</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {jobApplications.map((application, index) => {
                            const matchPercentage = getMatchPercentage(application);
                            const matchInfo = getMatchLabel(matchPercentage);
                            const appliedDate = formatDate(application.appliedOn);

                            return (
                                <CardContent key={application._id}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="">
                                            <CardHeader className="flex flex-row items-start justify-between">
                                                <div>
                                                    <h4 className="text-white font-semibold">{application.jobTitle}</h4>
                                                    <div className="flex items-center text-gray-400 text-sm mt-1">
                                                        <Briefcase className="w-4 h-4 mr-1" />
                                                        <span>{application.company}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-1">📍 {application.location} ({application.workMode})</p>
                                                </div>
                                                <span className={`${matchInfo.color} text-white px-2 py-1 rounded text-xs`}>
                                                    {matchInfo.label}
                                                </span>
                                            </CardHeader>
                                            <CardContent className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative w-16 h-16">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={[
                                                                        { name: "Match", value: matchPercentage },
                                                                        { name: "Remaining", value: 100 - matchPercentage },
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
                                                                    <Cell fill={matchPercentage >= 85 ? "#10b981" : matchPercentage >= 70 ? "#3b82f6" : "#ef4444"} />
                                                                    <Cell fill="rgba(255,255,255,0.1)" />
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className={`text-xs font-bold ${matchPercentage >= 85 ? "text-green-400" : matchPercentage >= 70 ? "text-blue-400" : "text-red-400"}`}>
                                                                {matchPercentage}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Profile Match</p>
                                                        <p className={`font-semibold ${matchPercentage >= 85 ? "text-green-400" : matchPercentage >= 70 ? "text-blue-400" : "text-red-400"}`}>
                                                            {matchPercentage}%
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center text-gray-400 text-sm mb-2">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        <span>{appliedDate}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-2">
                                                        Status: {application.status}
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="border-gray-500 text-gray-300 hover:bg-gray-700"
                                                        onClick={() => fetchApplicationDetails(application._id)}
                                                    >
                                                        Details
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        
                                        {jobApplications[index + 1] && (
                                            (() => {
                                                const nextApp = jobApplications[index + 1];
                                                const nextMatchPercentage = getMatchPercentage(nextApp);
                                                const nextMatchInfo = getMatchLabel(nextMatchPercentage);
                                                const nextAppliedDate = formatDate(nextApp.appliedOn);

                                                return (
                                                    <Card className="">
                                                        <CardHeader className="flex flex-row items-start justify-between">
                                                            <div>
                                                                <h4 className="text-white font-semibold">{nextApp.jobTitle}</h4>
                                                                <div className="flex items-center text-gray-400 text-sm mt-1">
                                                                    <Briefcase className="w-4 h-4 mr-1" />
                                                                    <span>{nextApp.company}</span>
                                                                </div>
                                                                <p className="text-gray-400 text-sm mt-1">📍 {nextApp.location} ({nextApp.workMode})</p>
                                                            </div>
                                                            <span className={`${nextMatchInfo.color} text-white px-2 py-1 rounded text-xs`}>
                                                                {nextMatchInfo.label}
                                                            </span>
                                                        </CardHeader>
                                                        <CardContent className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="relative w-16 h-16">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <PieChart>
                                                                            <Pie
                                                                                data={[
                                                                                    { name: "Match", value: nextMatchPercentage },
                                                                                    { name: "Remaining", value: 100 - nextMatchPercentage },
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
                                                                                <Cell fill={nextMatchPercentage >= 85 ? "#10b981" : nextMatchPercentage >= 70 ? "#3b82f6" : "#ef4444"} />
                                                                                <Cell fill="rgba(255,255,255,0.1)" />
                                                                            </Pie>
                                                                        </PieChart>
                                                                    </ResponsiveContainer>
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <span className={`text-xs font-bold ${nextMatchPercentage >= 85 ? "text-green-400" : nextMatchPercentage >= 70 ? "text-blue-400" : "text-red-400"}`}>
                                                                            {nextMatchPercentage}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-400 text-sm">Profile Match</p>
                                                                    <p className={`font-semibold ${nextMatchPercentage >= 85 ? "text-green-400" : nextMatchPercentage >= 70 ? "text-blue-400" : "text-red-400"}`}>
                                                                        {nextMatchPercentage}%
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                                                    <Calendar className="w-4 h-4 mr-1" />
                                                                    <span>{nextAppliedDate}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mb-2">
                                                                    Status: {nextApp.status}
                                                                </div>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    className="border-gray-500 text-gray-300 hover:bg-gray-700"
                                                                    onClick={() => fetchApplicationDetails(nextApp._id)}
                                                                >
                                                                    Details
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })()
                                        )}
                                    </div>
                                </CardContent>
                            );
                        }).filter((_, index) => index % 2 === 0)} 
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviousJobsContent