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
    Download,
} from "lucide-react"
import { useAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import { jobApplicationApi, finalReportApi } from "@/lib/api"
import { generateStructuredPDF } from "@/utils/pdfGenerator"

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

const PreviousJobsContent = () => {
    const { getToken } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [downloadingReport, setDownloadingReport] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                
                // Fetch current user
                const userRes = await fetch("/api/users/current-user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await userRes.json();
                setUser(userData);

                // Fetch job applications
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
            const applicationDetails = await jobApplicationApi.getApplication(applicationId, token || undefined);
            
            setSelectedApplication(applicationDetails);
            setShowDetailsModal(true);
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

    const getMatchPercentage = (application: JobApplication): number => {
        // Priority 1: Use final report total score if available
        if (application.finalReport?.metrics?.totalScore !== undefined) {
            const totalScore = application.finalReport.metrics.totalScore;
            return Math.max(0, Math.min(100, Math.round(totalScore)));
        }

        // If no data exists, return 0
        return 0;
    };

    const getMatchLabel = (percentage: number) => {
        if (percentage >= 90) return { label: "Excellent Match", color: "bg-green-600" };
        if (percentage >= 80) return { label: "Great Match", color: "bg-green-500" };
        if (percentage >= 70) return { label: "Good Match", color: "bg-blue-500" };
        if (percentage >= 60) return { label: "Fair Match", color: "bg-yellow-500" };
        if (percentage >= 50) return { label: "Average Match", color: "bg-orange-500" };
        if (percentage > 0) return { label: "Needs Improvement", color: "bg-red-500" };
        return { label: "Not Started", color: "bg-gray-500" };
    };

    const getMatchColor = (percentage: number) => {
        if (percentage >= 90) return "#10b981"; // green-600
        if (percentage >= 80) return "#22c55e"; // green-500
        if (percentage >= 70) return "#3b82f6"; // blue-500
        if (percentage >= 60) return "#eab308"; // yellow-500
        if (percentage >= 50) return "#f97316"; // orange-500
        if (percentage > 0) return "#ef4444"; // red-500
        return "#6b7280"; // gray-500
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

    const downloadFinalReport = async (applicationId: string, jobTitle: string, company: string) => {
        try {
            setDownloadingReport(true);
            const token = await getToken();
            
            // Fetch the complete final report data
            const response = await finalReportApi.getFinalReport(applicationId, token || undefined);
            console.log('Final report API response:', response);
            
            if (!response || !response.report) {
                alert('No final report available for this application.');
                return;
            }

            const finalReportData = response.report;
            console.log('Final report data:', finalReportData);

            // Prepare data for PDF generation
            const reportData = {
                jobTitle,
                company,
                totalScore: finalReportData.metrics?.totalScore || 0,
                jobMatch: finalReportData.metrics?.jobMatch || 0,
                resumeScore: finalReportData.metrics?.resumeScore || 0,
                mcqScore: finalReportData.metrics?.mcqScore || 0,
                mcqData: finalReportData.mcqData || {},
                resumeData: finalReportData.resumeData || {},
                improvements: finalReportData.improvements || [],
            };

            console.log('Report data for PDF:', reportData);

            // Generate and download PDF
            const filename = `${company}-${jobTitle}-Final-Report.pdf`.replace(/[^a-zA-Z0-9.-]/g, '_');
            await generateStructuredPDF(reportData, { filename });

        } catch (error) {
            console.error('Error downloading final report:', error);
            alert('Failed to download final report. Please try again.');
        } finally {
            setDownloadingReport(false);
        }
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

                                    {selectedApplication.finalReport && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4">Final Analysis Report</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{selectedApplication.finalReport.metrics.totalScore}%</p>
                                                    <p className="text-gray-400 text-sm">Total Score</p>
                                                </div>
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{selectedApplication.finalReport.metrics.resumeScore}%</p>
                                                    <p className="text-gray-400 text-sm">Resume Score</p>
                                                </div>
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{selectedApplication.finalReport.metrics.mcqScore}%</p>
                                                    <p className="text-gray-400 text-sm">MCQ Score</p>
                                                </div>
                                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{selectedApplication.finalReport.metrics.jobMatch}%</p>
                                                    <p className="text-gray-400 text-sm">Job Match</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center p-6 bg-gray-800 rounded-lg">
                                        <p className="text-gray-400 text-sm">Overall Profile Match</p>
                                        <p className="text-3xl font-bold text-white mt-2">{getMatchPercentage(selectedApplication)}%</p>
                                        {selectedApplication.finalReport && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Based on Final Analysis Report
                                            </p>
                                        )}
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
                                                        <Cell fill={getMatchColor(getMatchPercentage(selectedApplication))} />
                                                        <Cell fill="rgba(255,255,255,0.1)" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="flex justify-between items-center p-6 border-t border-gray-700">
                            <div>
                                {selectedApplication?.finalReport && (
                                    <Button
                                        onClick={() => downloadFinalReport(
                                            selectedApplication._id,
                                            selectedApplication.jobTitle,
                                            selectedApplication.company
                                        )}
                                        disabled={downloadingReport}
                                        className="bg-green-600 hover:bg-green-700 text-white mr-3"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {downloadingReport ? 'Generating...' : 'Download Report'}
                                    </Button>
                                )}
                            </div>
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
                            {jobApplications.filter(app => app.finalReport).length}
                        </div>
                        <p className="text-gray-400">Completed Tests</p>
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
                                const applicationsWithData = jobApplications.filter(app => 
                                    getMatchPercentage(app) > 0
                                );
                                if (applicationsWithData.length === 0) return '0';
                                
                                const total = applicationsWithData.reduce((acc, app) => {
                                    const percentage = getMatchPercentage(app);
                                    return acc + (isNaN(percentage) ? 0 : percentage);
                                }, 0);
                                const average = Math.round(total / applicationsWithData.length);
                                return isNaN(average) ? '0' : average.toString();
                            })()}%
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
                            const matchColor = getMatchColor(matchPercentage);
                            const appliedDate = formatDate(application.appliedOn);

                            return (
                                <div key={application._id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                                <Cell fill={matchColor} />
                                                                <Cell fill="rgba(255,255,255,0.1)" />
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className={`text-xs font-bold ${
                                                            matchPercentage >= 80 ? "text-green-400" : 
                                                            matchPercentage >= 70 ? "text-blue-400" : 
                                                            matchPercentage >= 60 ? "text-yellow-400" : 
                                                            matchPercentage >= 50 ? "text-orange-400" : 
                                                            matchPercentage > 0 ? "text-red-400" : "text-gray-400"
                                                        }`}>
                                                            {matchPercentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Profile Match</p>
                                                    <p className={`font-semibold ${
                                                        matchPercentage >= 80 ? "text-green-400" : 
                                                        matchPercentage >= 70 ? "text-blue-400" : 
                                                        matchPercentage >= 60 ? "text-yellow-400" : 
                                                        matchPercentage >= 50 ? "text-orange-400" : 
                                                        matchPercentage > 0 ? "text-red-400" : "text-gray-400"
                                                    }`}>
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
                                            const nextMatchColor = getMatchColor(nextMatchPercentage);
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
                                                                            <Cell fill={nextMatchColor} />
                                                                            <Cell fill="rgba(255,255,255,0.1)" />
                                                                        </Pie>
                                                                    </PieChart>
                                                                </ResponsiveContainer>
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <span className={`text-xs font-bold ${
                                                                        nextMatchPercentage >= 80 ? "text-green-400" : 
                                                                        nextMatchPercentage >= 70 ? "text-blue-400" : 
                                                                        nextMatchPercentage >= 60 ? "text-yellow-400" : 
                                                                        nextMatchPercentage >= 50 ? "text-orange-400" : 
                                                                        nextMatchPercentage > 0 ? "text-red-400" : "text-gray-400"
                                                                    }`}>
                                                                        {nextMatchPercentage}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-400 text-sm">Profile Match</p>
                                                                <p className={`font-semibold ${
                                                                    nextMatchPercentage >= 80 ? "text-green-400" : 
                                                                    nextMatchPercentage >= 70 ? "text-blue-400" : 
                                                                    nextMatchPercentage >= 60 ? "text-yellow-400" : 
                                                                    nextMatchPercentage >= 50 ? "text-orange-400" : 
                                                                    nextMatchPercentage > 0 ? "text-red-400" : "text-gray-400"
                                                                }`}>
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
                            );
                        }).filter((_, index) => index % 2 === 0)} 
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviousJobsContent