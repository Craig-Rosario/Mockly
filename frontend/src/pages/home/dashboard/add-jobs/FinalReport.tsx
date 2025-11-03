import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import AppStepper from "@/components/custom/AppStepper"
import { Award, Target, FileText, ListChecks, AlertTriangle, User, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/react-router"
import { finalReportApi } from "@/lib/api"
import Mloader from "@/components/custom/Mloader"
import { generateStructuredPDF } from "@/utils/pdfGenerator"

type Improvement = {
  title: string
  description?: string
  severity?: "high" | "medium" | "low"
}

type MetricsState = {
  totalScore?: number
  jobMatch?: number
  resumeScore?: number
  mcqScore?: number
  interviewScore?: number
  improvements?: Improvement[]
  mcqData?: {
    totalQuestions: number
    correctAnswers: number
    timeTaken: number
    topicWisePerformance: Array<{
      topic: string
      correct: number
      total: number
      percentage: number
    }>
  }
  resumeData?: {
    keywordAnalysis: {
      coveragePercentage: number
      neededKeywords: Array<{
        keyword: string
        found: boolean
      }>
    }
    experienceAnalysis: Array<{
      title: string
      relevanceScore: number
      depthScore: number
      suggestions: string[]
    }>
    projectAnalysis: Array<{
      title: string
      relevanceScore: number
      complexityScore: number
      suggestions: string[]
    }>
    overallSuggestions: string
  }
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

const defaultImprovements: Improvement[] = [
  {
    title: "Quantify impact in resume bullets",
    description: "Add metrics like load time improvements, revenue impact, or user growth.",
    severity: "high",
  },
  {
    title: "Cover missing keywords",
    description: "Address such as Docker and PostgreSQL where applicable.",
    severity: "medium",
  },
  {
    title: "Practice time management",
    description: "Aim for a consistent pace during MCQs to reduce average time per question.",
    severity: "low",
  },
]

const severityStyles: Record<NonNullable<Improvement["severity"]>, { dot: string; text: string; border: string }> = {
  high: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  medium: {
    dot: "bg-blue-400",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  low: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
  },
}

const FinalReport = () => {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [metrics, setMetrics] = useState<MetricsState | null>(null)
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get job application ID from localStorage
        const applicationId = localStorage.getItem('currentApplicationId')
        if (!applicationId) {
          setError('No job application found. Please start a new application.')
          return
        }

        const token = await getToken()

        // Debug: Check what data exists
        try {
          const debugResponse = await finalReportApi.debugData(applicationId, token || undefined)
          console.log('Debug Data:', debugResponse)
          
          const testMCQResponse = await finalReportApi.testMCQData(applicationId, token || undefined)
          console.log('Test MCQ Data:', testMCQResponse)
        } catch (debugError) {
          console.warn('Debug endpoint failed:', debugError)
        }

        // Fetch metrics
        const metricsResponse = await finalReportApi.getMetrics(applicationId, token || undefined)
        if (metricsResponse.success) {
          console.log('Metrics Response:', metricsResponse)
          setMetrics({
            ...metricsResponse.metrics,
            mcqData: metricsResponse.mcqData,
            resumeData: metricsResponse.resumeData
          })
        }

        // Generate improvements
        const improvementsResponse = await finalReportApi.generateImprovements(applicationId, token || undefined)
        if (improvementsResponse.success) {
          console.log('Improvements Response:', improvementsResponse)
          setImprovements(improvementsResponse.improvements)
        }

      } catch (error) {
        console.error('Error fetching final report data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load final report data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [getToken])

  const handleDownloadPDF = async () => {
    if (!metrics) return

    try {
      setIsGeneratingPDF(true)
      
      // Prepare data for structured PDF
      const reportData = {
        totalScore: metrics.totalScore ?? 0,
        jobMatch: metrics.jobMatch ?? 0,
        resumeScore: metrics.resumeScore ?? 0,
        mcqScore: metrics.mcqScore ?? 0,
        mcqData: metrics.mcqData,
        resumeData: metrics.resumeData,
        improvements: improvements.length > 0 ? improvements : defaultImprovements
      }

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0]
      const filename = `Mockly_Final_Report_${currentDate}.pdf`

      // Generate structured PDF
      await generateStructuredPDF(reportData, { filename })
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8 flex items-center justify-center">
        <Mloader />
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8 flex items-center justify-center">
        <Card className="bg-zinc-900 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to Load Report</h2>
            <p className="text-zinc-400 mb-4">
              {error || 'No assessment data found. Please complete MCQ and Resume analysis first.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Go to Dashboard
              </Button>
              <Button onClick={() => navigate('/add-jobs')} className="bg-blue-600 hover:bg-blue-700">
                Start New Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use fetched data or fallback to defaults
  const resume = clamp(metrics.resumeScore ?? 0)
  const mcq = clamp(metrics.mcqScore ?? 0)
  const jobMatch = clamp(metrics.jobMatch ?? 0)
  const total = clamp(metrics.totalScore ?? 0)
  const finalImprovements = improvements.length > 0 ? improvements : defaultImprovements
  const scoreTone = total >= 85 ? "text-emerald-400" : total >= 70 ? "text-blue-400" : "text-amber-400"
  const fitText = total >= 85 ? "Excellent Fit " : total >= 70 ? "Strong Potential " : "Needs Improvement "

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Final Evaluation Metrics</h1>
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGeneratingPDF ? 'Generating PDF...' : 'Download Report'}
        </Button>
      </div>

      {/* Stepper */}
      <div className="mb-6">
        <AppStepper
          currentStep={4.95}
          steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />
      </div>

      {/* Summary + Job Match */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-emerald-400" />
              Final Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <Label className="text-zinc-400 mb-2">Total Score</Label>
              <div className={`text-6xl font-extrabold ${scoreTone}`}>
                {total}
                <span className="text-2xl text-zinc-400">/100</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400 text-center">
                Weighted score based on Job Match (50%), Resume (25%), MCQ (25%).
              </p>
              {/* 5️⃣ Career Fit Meter */}
              <p className={`text-lg mt-4 font-medium ${scoreTone}`}>{fitText}</p>
            </div>
          </CardContent>
    
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-400" />
              Final Job Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Match Percentage</span>
              <span className="font-semibold text-blue-400">{jobMatch}%</span>
            </div>
            <Progress value={jobMatch} className="mt-3 h-2" />
            <p className="mt-3 text-sm text-zinc-400">
              Based on alignment between your profile and job requirements.
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Resume + MCQ */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-400" />
              Resume Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Score</span>
              <span className="font-semibold text-blue-400">{resume}%</span>
            </div>
            <Progress value={resume} className="mt-3 h-2" />
            <div className="mt-3 text-sm text-zinc-400">
              {metrics.resumeData ? (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keyword Coverage: {metrics.resumeData.keywordAnalysis?.coveragePercentage ?? 0}%</li>
                  <li>Experience Analysis: {metrics.resumeData.experienceAnalysis?.length ?? 0} roles evaluated</li>
                  <li>Project Analysis: {metrics.resumeData.projectAnalysis?.length ?? 0} projects reviewed</li>
                </ul>
              ) : (
                <p>No resume analysis data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="h-5 w-5 mr-2 text-emerald-400" />
              MCQ Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Score</span>
              <span className="font-semibold text-emerald-400">{mcq}%</span>
            </div>
            <Progress value={mcq} className="mt-3 h-2" />
            <div className="mt-3 text-sm text-zinc-400">
              {metrics.mcqData ? (
                <div className="space-y-2">
                  <p>Answered: {metrics.mcqData.correctAnswers}/{metrics.mcqData.totalQuestions} questions correctly</p>
                  <p>Time taken: {Math.round(metrics.mcqData.timeTaken / 60)} minutes</p>
                  {metrics.mcqData.topicWisePerformance && metrics.mcqData.topicWisePerformance.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {metrics.mcqData.topicWisePerformance.slice(0, 2).map((topic: any, idx: number) => (
                        <span 
                          key={idx}
                          className="rounded-md px-2 py-0.5 text-xs border border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
                        >
                          {topic.topic}: {topic.percentage}%
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p>No MCQ analysis data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Things to Improve */}
      <div className="mt-6">
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-400" />
              Things to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finalImprovements.map((imp, idx) => {
                const sev = imp.severity ?? "medium"
                const styles = severityStyles[sev]
                return (
                  <div key={idx} className={`rounded-lg border ${styles.border} bg-zinc-900/60 p-4`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                        <span className="font-medium text-zinc-200">{imp.title}</span>
                      </div>
                      <span className={`text-xs ${styles.text} capitalize`}>{sev}</span>
                    </div>
                    {imp.description ? (
                      <p className="mt-2 text-sm text-zinc-400">{imp.description}</p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              variant="outline"
              className="bg-gray-900 border border-gray-700 text-white"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default FinalReport
