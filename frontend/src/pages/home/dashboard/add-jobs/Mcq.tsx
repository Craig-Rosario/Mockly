import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import AppStepper from "@/components/custom/AppStepper"
import { User, FileText, ListChecks, Mic, Timer } from "lucide-react"
import MLoader from "@/components/custom/Mloader"

type Question = {
  id: number
  topic: string
  question: string
  options: string[]
  correctIndex: number
}

type AnswerState = {
  selectedIndex: number | null
  timeSpentSec: number
}

const SECONDS_PER_QUESTION = 30

function formatSeconds(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

const Mcq = () => {
  const navigate = useNavigate()

  // Mock "AI-generated" questions with topics
  const questions: Question[] = useMemo(
    () => [
      {
        id: 1,
        topic: "JavaScript",
        question: "Which method creates a new array with elements that pass a test?",
        options: ["map()", "filter()", "reduce()", "forEach()"],
        correctIndex: 1,
      },
      {
        id: 2,
        topic: "React",
        question: "What hook is used to perform side effects in function components?",
        options: ["useState", "useMemo", "useEffect", "useCallback"],
        correctIndex: 2,
      },
      {
        id: 3,
        topic: "TypeScript",
        question: "Which TypeScript feature helps catch type errors at compile time?",
        options: ["Interfaces", "Generics", "Type checking", "Enums"],
        correctIndex: 2,
      },
      {
        id: 4,
        topic: "Web",
        question: "Which HTTP method is idempotent and used to retrieve data?",
        options: ["POST", "PUT", "GET", "PATCH"],
        correctIndex: 2,
      },
      {
        id: 5,
        topic: "React",
        question: "Which prop must be unique when rendering a list in React?",
        options: ["id", "key", "name", "index"],
        correctIndex: 1,
      },
      {
        id: 6,
        topic: "JavaScript",
        question: "What keyword declares a block-scoped variable?",
        options: ["var", "let", "const", "static"],
        correctIndex: 1,
      },
      {
        id: 7,
        topic: "TypeScript",
        question: "What TypeScript feature allows restricting a variable to specific values?",
        options: ["Union types", "Type assertions", "Any type", "Decorators"],
        correctIndex: 0,
      },
      {
        id: 8,
        topic: "Web",
        question: "Which status code means 'Not Found'?",
        options: ["200", "301", "404", "500"],
        correctIndex: 2,
      },
      {
        id: 9,
        topic: "React",
        question: "React components should be:",
        options: ["Mutable", "Impure", "Stateless only", "Pure when possible"],
        correctIndex: 3,
      },
      {
        id: 10,
        topic: "JavaScript",
        question: "Which of the following is NOT a primitive type?",
        options: ["string", "number", "object", "boolean"],
        correctIndex: 2,
      },
    ],
    [],
  )

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>(
    Array.from({ length: questions.length }, () => ({
      selectedIndex: null,
      timeSpentSec: 0,
    })),
  )
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNext(true)
          return SECONDS_PER_QUESTION
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentIdx])

  useEffect(() => {
    const spent = answers[currentIdx]?.timeSpentSec ?? 0
    const remaining = Math.max(0, SECONDS_PER_QUESTION - spent)
    setTimeLeft(remaining || SECONDS_PER_QUESTION)
  }, [currentIdx])

  const handleSelect = (optIndex: number) => {
    setAnswers((prev) => {
      const copy = [...prev]
      copy[currentIdx] = {
        ...copy[currentIdx],
        selectedIndex: optIndex,
      }
      return copy
    })
  }

  const recordTime = () => {
    setAnswers((prev) => {
      const copy = [...prev]
      const already = copy[currentIdx]?.timeSpentSec ?? 0
      const justSpent = SECONDS_PER_QUESTION - timeLeft
      copy[currentIdx] = {
        ...copy[currentIdx],
        timeSpentSec: Math.min(SECONDS_PER_QUESTION, already || justSpent),
      }
      return copy
    })
  }

  const handlePrev = () => {
    recordTime()
    setCurrentIdx((i) => Math.max(0, i - 1))
  }

  const handleNext = (fromTimeout = false) => {
    setAnswers((prev) => {
      const copy = [...prev]
      const already = copy[currentIdx]?.timeSpentSec ?? 0
      const justSpent = SECONDS_PER_QUESTION - timeLeft
      copy[currentIdx] = {
        ...copy[currentIdx],
        timeSpentSec: Math.min(SECONDS_PER_QUESTION, fromTimeout ? SECONDS_PER_QUESTION : Math.max(already, justSpent)),
      }
      return copy
    })

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1)
      setTimeLeft(SECONDS_PER_QUESTION)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      const finalizedAnswers = answers.map((a, idx) =>
        idx === currentIdx
          ? {
            ...a,
            timeSpentSec: Math.min(SECONDS_PER_QUESTION, Math.max(a.timeSpentSec, SECONDS_PER_QUESTION - timeLeft)),
          }
          : a,
      )

      const result = questions.map((q, idx) => {
        const user = finalizedAnswers[idx]
        const isCorrect = user.selectedIndex === q.correctIndex
        return {
          ...q,
          selectedIndex: user.selectedIndex,
          correct: isCorrect,
          timeSpentSec: user.timeSpentSec,
        }
      })

      const totalCorrect = result.filter((r) => r.correct).length
      const topicStats = result.reduce<Record<string, { correct: number; total: number }>>((acc, r) => {
        acc[r.topic] = acc[r.topic] || { correct: 0, total: 0 }
        acc[r.topic].total += 1
        if (r.correct) acc[r.topic].correct += 1
        return acc
      }, {})
      const avgTimeSec = Math.round(result.reduce((sum, r) => sum + (r.timeSpentSec || 0), 0) / result.length)

      navigate("/add-jobs/mcq-analysis", {
        state: {
          result,
          totalCorrect,
          topicStats,
          avgTimeSec,
          total: questions.length,
        },
      })
    }, 1500)
  }
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <MLoader size={140} />
          <span className="mt-3 text-sm text-zinc-400">Generating Your Results...</span>
        </div>
      </div>
    )
  }

  const q = questions[currentIdx]
  const progress = Math.round(((currentIdx + 1) / questions.length) * 100)

  return (

    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Mock MCQ</h1>

      <div className="flex-1 flex flex-col gap-6">
        <AppStepper
          currentStep={2.2}
          steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            { icon: <Mic className="h-5 w-5" />, label: "Interview" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <div className="rounded-lg border border-zinc-700 p-5">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Progress</Label>
              <span className="text-sm text-zinc-400">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="mt-3 h-2" />
          </div>

          <div className="mt-6 flex items-center justify-end mr-1">
            {/* <div className="text-sm text-zinc-400">
              Topic: <span className="text-zinc-200">{q.topic}</span>
            </div> */}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Timer className="h-4 w-4" />
              <span>Time left: {formatSeconds(timeLeft)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-700 p-5">
            <div className="text-lg font-medium">{q.question}</div>

            <div className="mt-4 space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[currentIdx]?.selectedIndex === idx
                return (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-center justify-between rounded-md border p-3 transition ${selected ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 bg-zinc-800 hover:bg-zinc-800/70"
                      }`}
                    onClick={() => handleSelect(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={selected}
                        onChange={() => handleSelect(idx)}
                        className="h-4 w-4 accent-blue-500"
                      />
                      <span className="text-sm">{opt}</span>
                    </div>
                    {selected && <span className="text-xs text-blue-300">Selected</span>}
                  </label>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              className="bg-gray-800 text-white hover:bg-gray-700"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              Previous
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                className="bg-gray-800 text-white hover:bg-gray-700"
                onClick={() => {
                  handleNext()
                }}
              >
                {currentIdx < questions.length - 1 ? "Next" : "Submit"}
              </Button>
              <Button
                type="button"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                onClick={handleSubmit}
              >
                Submit Quiz
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Mcq
