import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import AppStepper from "@/components/custom/AppStepper"
import { Award, Target, FileText, ListChecks, Mic, AlertTriangle, CheckCircle2, Download, User } from "lucide-react"

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
    description: "Address gaps such as Docker and PostgreSQL where applicable.",
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
  const location = useLocation()
  const state = (location.state || {}) as MetricsState
  const resume = clamp(state.resumeScore ?? 64)
  const mcq = clamp(state.mcqScore ?? 76)
  const interview = clamp(state.interviewScore ?? 84)
  const jobMatch = clamp(state.jobMatch ?? 72)
  const computedTotal = 0.4 * jobMatch + 0.2 * resume + 0.2 * mcq + 0.2 * interview
  const total = clamp(Math.round(state.totalScore ?? computedTotal))
  const improvements = state.improvements?.length ? state.improvements : defaultImprovements
  const scoreTone = total >= 85 ? "text-emerald-400" : total >= 70 ? "text-blue-400" : "text-amber-400"

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Final Evaluation Metrics</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-gray-900 border border-gray-700 text-white"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <AppStepper
          currentStep={4.95}
          steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            { icon: <Mic className="h-5 w-5" />, label: "Interview" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />
      </div>

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
                Weighted score based on Job Match (40%), Resume (20%), MCQ (20%), and Interview (20%).
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              className="bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => navigate("/add-jobs/resume-analysis")}
            >
              Review Resume
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => navigate("/add-jobs/mcq-analysis")}
            >
              View MCQ Analytics
            </Button>
          </CardFooter>
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
            <p className="mt-3 text-sm text-zinc-400">Based on alignment between your profile and job requirements.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
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
            <ul className="mt-3 text-sm text-zinc-400 list-disc pl-5 space-y-1">
              <li>Improve keyword coverage and quantify outcomes.</li>
            </ul>
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
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md px-2 py-0.5 text-xs border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">
                Strength: Core concepts
              </span>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button className="bg-gray-800 text-white hover:bg-gray-700" onClick={() => navigate("/add-jobs/mcq")}>
              Retake MCQ
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="h-5 w-5 mr-2 text-purple-400" />
              Interview Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Score</span>
              <span className="font-semibold text-purple-400">{interview}%</span>
            </div>
            <Progress value={interview} className="mt-3 h-2" />
            <ul className="mt-3 text-sm text-zinc-400 list-disc pl-5 space-y-1">
              <li>Keep concise, structured answers with examples.</li>
            </ul>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => navigate("/add-jobs/mock-interview")}
            >
              Practice Interview
            </Button>
          </CardFooter>
        </Card>
      </div>

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
              {improvements.map((imp, idx) => {
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
                    {imp.description ? <p className="mt-2 text-sm text-zinc-400">{imp.description}</p> : null}
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              variant="outline"
              className="bg-gray-900 border border-gray-700 text-white"
              onClick={() => navigate("/add-jobs/resume-analysis")}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Apply Suggestions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default FinalReport
