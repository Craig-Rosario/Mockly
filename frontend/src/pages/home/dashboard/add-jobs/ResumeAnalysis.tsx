import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import AppStepper from "@/components/custom/AppStepper"
import MLoader from "@/components/custom/Mloader"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { resumeAnalysisApi } from "@/lib/api"
import {
  User,
  FileText,
  ListChecks,
  Mic,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Briefcase,
  Rocket,
  MapPin,
  Clock,
  GraduationCap,
  Award,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ResumeAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState('pending')
  
  // State for dialogs
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false)
  const [openMcqDialog, setOpenMcqDialog] = useState(false)

  const navigate = useNavigate()
  const { getToken } = useAuth()

  useEffect(() => {
    const analyzeResume = async () => {
      try {
        const applicationId = localStorage.getItem('currentApplicationId')
        if (!applicationId) {
          setError('No application found. Please complete your job application first.')
          setLoading(false)
          return
        }

        const token = await getToken()
        if (!token) {
          setError('Authentication required')
          setLoading(false)
          return
        }

        console.log('Starting resume analysis for application:', applicationId)
        
        try {
          const existingAnalysis = await resumeAnalysisApi.getAnalysis(applicationId, token)
          if (existingAnalysis.status === 'completed' && existingAnalysis.analysis) {
            console.log('Found existing analysis:', existingAnalysis.analysis)
            setAnalysisData(existingAnalysis.analysis)
            setAnalysisStatus('completed')
            setLoading(false)
            return
          }
        } catch (err) {
          console.log('No existing analysis found, starting new analysis...')
        }


        setAnalysisStatus('processing')
        console.log('Triggering resume analysis...')
        
        const analysisResult = await resumeAnalysisApi.analyzeResume(applicationId, token)
        console.log('Analysis completed:', analysisResult)
        
        setAnalysisData(analysisResult.analysis)
        setAnalysisStatus('completed')
        setLoading(false)

      } catch (err: any) {
        console.error('Resume analysis error:', err)
        setError(err.message || 'Failed to analyze resume')
        setAnalysisStatus('error')
        setLoading(false)
      }
    }

    analyzeResume()
  }, [getToken])
  // Show loading state while analysis is processing or if we have no data
  if (loading || analysisStatus === 'processing' || !analysisData) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Resume Analysis</h1>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <MLoader size={120} />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Analyzing Your Resume</h2>
            <p className="text-gray-400">
              Our AI is carefully evaluating your resume against the job requirements...
            </p>
            <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Resume Analysis</h1>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-400">Analysis Failed</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Resume Analysis</h1>

      <div className="flex-1 flex flex-col gap-6">
        <AppStepper
          currentStep={1.6}
          steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            // { icon: <Mic className="h-5 w-5" />, label: "Interview" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <div className="rounded-lg border border-zinc-700 p-5">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Match Score</Label>
              <span className="text-2xl font-semibold">
                {analysisData?.matchScore ? `${analysisData.matchScore}%` : 'N/A'}
              </span>
            </div>
            <Progress value={analysisData?.matchScore || 0} className="mt-3 h-2" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-700 p-5">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-300">Needed Keywords</Label>
                <span className="text-sm text-zinc-400">
                  {analysisData?.keywordAnalysis?.coveragePercentage ? `${analysisData.keywordAnalysis.coveragePercentage}% covered` : 'Calculating...'}
                </span>
              </div>
              <Progress value={analysisData?.keywordAnalysis?.coveragePercentage || 0} className="mt-3 h-2" />

              <div className="mt-4 flex flex-wrap gap-2">
                {analysisData?.keywordAnalysis?.neededKeywords?.map((keyword: any, index: number) => (
                  <span
                    key={index}
                    className={`rounded-md px-2.5 py-1 text-xs border ${
                      keyword.found
                        ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                        : 'border-zinc-700 text-zinc-300 bg-zinc-800'
                    }`}
                  >
                    {keyword.keyword}
                  </span>
                )) || (
                  <>
                    <span className="rounded-md px-2.5 py-1 text-xs border border-zinc-700 text-zinc-300 bg-zinc-800">Loading keywords...</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-700 p-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <Label className="text-zinc-300">Overall Suggestions</Label>
              </div>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                {analysisData?.overallSuggestions || 'Analyzing your resume to provide personalized suggestions...'}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-700 p-5">
              <Label className="text-zinc-300">Things that match</Label>
              <ul className="mt-3 space-y-2">
                {analysisData?.keywordAnalysis?.neededKeywords
                  ?.filter((keyword: any) => keyword.found)
                  ?.map((keyword: any, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-zinc-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {keyword.keyword}
                    </li>
                  )) || (
                  <li className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle2 className="h-4 w-4 text-zinc-500" /> Analyzing matched skills...
                  </li>
                )}
                {(!analysisData?.keywordAnalysis?.neededKeywords?.some((k: any) => k.found)) && analysisData?.keywordAnalysis && (
                  <li className="text-sm text-zinc-400">No matching keywords found</li>
                )}
              </ul>
            </div>

            <div className="rounded-lg border border-zinc-700 p-5">
              <Label className="text-zinc-300">Things that are missing</Label>
              <ul className="mt-3 space-y-2">
                {analysisData?.keywordAnalysis?.neededKeywords
                  ?.filter((keyword: any) => !keyword.found)
                  ?.map((keyword: any, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-zinc-200">
                      <XCircle className="h-4 w-4 text-rose-400" /> {keyword.keyword}
                    </li>
                  )) || (
                  <li className="flex items-center gap-2 text-sm text-zinc-400">
                    <XCircle className="h-4 w-4 text-zinc-500" /> Analyzing missing skills...
                  </li>
                )}
                {(!analysisData?.keywordAnalysis?.neededKeywords?.some((k: any) => !k.found)) && analysisData?.keywordAnalysis && (
                  <li className="text-sm text-zinc-400">All required skills found!</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-zinc-700 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-zinc-300" />
              <h3 className="text-lg font-semibold">Experience Analysis</h3>
            </div>

            <div className="space-y-4">
              {analysisData?.experienceAnalysis?.length > 0 ? (
                analysisData.experienceAnalysis.map((exp: any, index: number) => (
                  <div key={index} className="rounded-lg border border-zinc-700 p-4 md:flex md:items-start md:justify-between">
                    <div>
                      <div className="font-medium">{exp.title}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                          Experience
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:w-80">
                      <div className="text-xs text-zinc-400">Relevance</div>
                      <Progress value={(exp.relevanceScore / 10) * 100} className="h-2 mt-1" />
                      <div className="mt-3 text-xs text-zinc-400">Depth / Ownership</div>
                      <Progress value={(exp.depthScore / 10) * 100} className="h-2 mt-1" />
                      <ul className="mt-3 list-disc pl-4 text-xs text-zinc-300 space-y-1">
                        {exp.suggestions?.map((suggestion: string, suggestionIndex: number) => (
                          <li key={suggestionIndex}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-zinc-700 p-4 text-center text-zinc-400">
                  No experience data available or still analyzing...
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-zinc-700 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-zinc-300" />
              <h3 className="text-lg font-semibold">Project Analysis</h3>
            </div>

            <div className="space-y-4">
              {analysisData?.projectAnalysis?.length > 0 ? (
                analysisData.projectAnalysis.map((project: any, index: number) => (
                  <div key={index} className="rounded-lg border border-zinc-700 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium">{project.title}</div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <div className="text-xs text-zinc-400">Relevance</div>
                        <Progress value={(project.relevanceScore / 10) * 100} className="h-2 mt-1" />
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400">Complexity (0-8)</div>
                        <Progress value={(project.complexityScore / 8) * 100} className="h-2 mt-1" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-zinc-400">Suggestions</div>
                      <ul className="mt-1 list-disc pl-4 text-xs text-zinc-300 space-y-1">
                        {project.suggestions?.map((suggestion: string, suggestionIndex: number) => (
                          <li key={suggestionIndex}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-zinc-700 p-4 text-center text-zinc-400">
                  No project data available or still analyzing...
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-zinc-700 p-5">
            <h3 className="mb-4 text-lg font-semibold">Other Checks</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-700 p-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin className="h-4 w-4" /> Location
                </div>
                <div className="mt-2 text-sm text-zinc-300">
                  JD: NYC (Hybrid)
                  <br />
                  You: Remote — India
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Consider stating relocation/remote flexibility.
                </div>
              </div>

              <div className="rounded-lg border border-zinc-700 p-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="h-4 w-4" /> Experience
                </div>
                <div className="mt-2 text-sm text-zinc-300">
                  Required: 3 yrs
                  <br />
                  You: 1.5 yrs
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Bridge with stronger projects and quantified impact.
                </div>
              </div>

              <div className="rounded-lg border border-zinc-700 p-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <GraduationCap className="h-4 w-4" /> Education
                </div>
                <div className="mt-2 text-sm text-zinc-300">
                  JD: BTech in CS or related
                  <br />
                  You: BTech in CE • GPA: 9.8 / 10
                </div>
              </div>

              <div className="rounded-lg border border-zinc-700 p-4">
                <div className="text-zinc-300">Work Authorization</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Eligible
                </div>
                <div className="mt-3 text-xs text-zinc-400">
                  Gaps detected: <span className="mr-2">4 mo starting 2022-09</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            {/* === CHANGES START HERE === */}
            {/* The `onClick` and `open` props for the Mock Interview button and dialog have been updated */}
            {/* <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => setOpenInterviewDialog(true)}>
              Mock Interview
            </Button> */}
            <AlertDialog open={openInterviewDialog} onOpenChange={setOpenInterviewDialog}>
            {/* === CHANGES END HERE === */}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Mock Interview?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once started, the timer will begin for AI interview. Are you ready?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenInterviewDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/add-jobs/mock-interview")}>
                    Start
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => setOpenMcqDialog(true)}
            >
              Mock MCQ
            </Button>
            <AlertDialog open={openMcqDialog} onOpenChange={setOpenMcqDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Mock MCQ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once started, the timer will begin for each question. Are you ready?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenMcqDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    const applicationId = localStorage.getItem('currentApplicationId')
                    navigate("/add-jobs/mcq", { state: { applicationId } })
                  }}>
                    Start
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </div>
  )
};
export default ResumeAnalysis;