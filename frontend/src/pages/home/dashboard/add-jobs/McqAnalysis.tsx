import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import AppStepper from "@/components/custom/AppStepper"
import {
  User,
  FileText,
  ListChecks,
  Mic,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { PieChart, Pie, Cell } from "recharts"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"


type ResultItem = {
  id: number
  topic: string
  question: string
  options: string[]
  correctIndex: number
  selectedIndex: number | null
  correct: boolean
  timeSpentSec: number
}

type LocationState = {
  result: ResultItem[]
  totalCorrect: number
  topicStats: Record<string, { correct: number; total: number }>
  avgTimeSec: number
  total: number
}

function formatSeconds(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

const McqAnalysis = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as LocationState

  const hasData = Array.isArray(state.result) && state.result.length > 0
  const total = state.total || 10
  const scorePct = hasData ? Math.round((state.totalCorrect / total) * 100) : 0

  if (!hasData) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">MCQ Analytics</h1>
        <div className="rounded-lg border bg-zinc-900 p-6">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">No MCQ data found.</span>
          </div>
          <p className="mt-2 text-sm text-zinc-300">
            Please take the MCQ test first to view analytics.
          </p>
          <div className="mt-4">
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => navigate("/add-jobs/mcq")}
            >
              Go to MCQ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const incorrect = state.result.filter((r) => !r.correct)
  const topics = Object.entries(state.topicStats)

  const MAX_TIME = 120
  const timePct = Math.min(
    Math.round((state.avgTimeSec / MAX_TIME) * 100),
    100
  )
  const timeData = [
    { name: "Time Used", value: timePct },
    { name: "Remaining", value: 100 - timePct },
  ]
  let scoreColor = "text-emerald-400"
  if (state.totalCorrect <= 4) scoreColor = "text-rose-400"
  else if (state.totalCorrect <= 7) scoreColor = "text-amber-400"

  function AnimatedNumber({ value }: { value: number }) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest))

    useEffect(() => {
      const controls = animate(count, value, { duration: 1 })
      return controls.stop
    }, [value, count])

    return <motion.span>{rounded}</motion.span>
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">MCQ Analytics</h1>

      <div className="flex-1 flex flex-col gap-6">
        <AppStepper
          currentStep={2.8}
          steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            { icon: <Mic className="h-5 w-5" />, label: "Interview" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="flex flex-col items-center justify-center py-10">
              <Label className="text-zinc-400 text-lg mb-2">Score</Label>
              <span className={`text-6xl font-bold ${scoreColor}`}>
                <AnimatedNumber value={state.totalCorrect} />/{total}
              </span>
              <div className="mt-3 text-sm text-zinc-400">
                {scorePct}% accuracy
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-700 p-5">
                <Label className="text-zinc-300">Topic-wise Accuracy</Label>
                <div className="mt-4 space-y-3">
                  {topics.map(([topic, { correct, total }]) => {
                    const pct = Math.round((correct / total) * 100)
                    const icon =
                      pct >= 70 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : pct >= 40 ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )

                    return (
                      <div
                        key={topic}
                        className="rounded-md hover:bg-zinc-800 p-2 transition"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {icon}
                            <span className="text-zinc-200">{topic}</span>
                          </div>
                          <span className="text-zinc-400">{pct}%</span>
                        </div>
                        <Progress value={pct} className="mt-2 h-2" />
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="rounded-lg border border-zinc-700 p-5 flex flex-col items-center justify-center">
                <Label className="text-zinc-300 flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Average Time per Question
                </Label>
                <PieChart width={160} height={160}>
                  <Pie
                    data={timeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    stroke="none"
                  >
                    {timeData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === 0 ? "#3b82f6" : "#1e293b"}
                        className="transition-all"
                      />
                    ))}
                  </Pie>
                </PieChart>
                <div className="mt-3 text-2xl font-semibold">
                  {formatSeconds(state.avgTimeSec)}
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  Based on your recorded time across all questions.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="mt-8 rounded-lg border border-zinc-700 p-5">
              <h3 className="mb-4 text-lg font-semibold">
                Incorrect Questions Review
              </h3>
              {incorrect.length === 0 ? (
                <div className="text-sm text-emerald-400">
                  Great job! No incorrect answers to review.
                </div>
              ) : (
                <div className="space-y-4">
                  {incorrect.map((r, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-zinc-700 p-4 hover:border-blue-500 hover:bg-zinc-800 transition"
                    >
                      <div className="text-sm text-zinc-400">
                        Topic: <span className="text-zinc-200">{r.topic}</span>
                      </div>
                      <div className="mt-2 font-medium">{r.question}</div>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="text-sm">
                          <span className="text-zinc-400">Your answer: </span>
                          <span className="text-rose-300">
                            {r.selectedIndex != null
                              ? r.options[r.selectedIndex]
                              : "Not answered"}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-zinc-400">Correct answer: </span>
                          <span className="text-emerald-300">
                            {r.options[r.correctIndex]}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-zinc-400">
                        Time spent: {formatSeconds(r.timeSpentSec || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="mt-8 flex items-center justify-end gap-3">
              <Button
                className="bg-gray-800 text-white hover:bg-gray-700"
                onClick={() => navigate("/add-jobs/mcq")}
              >
                Retake MCQ
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                onClick={() => navigate("/add-jobs/mock-interview")}
              >
                Mock Interview
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

export default McqAnalysis
