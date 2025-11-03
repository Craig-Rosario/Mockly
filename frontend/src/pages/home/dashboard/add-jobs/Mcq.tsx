import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import AppStepper from "@/components/custom/AppStepper"
import { User, FileText, ListChecks, Timer, Award } from "lucide-react"
import MLoader from "@/components/custom/Mloader"
import { useApiCall } from "@/lib/api"

type Question = {
  question: string
  options: string[]
  correctAnswer: string
  topic?: string
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
  const location = useLocation()
  const apiCall = useApiCall()
  
  const applicationId = location.state?.applicationId || new URLSearchParams(location.search).get('applicationId')
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!applicationId) {
      setError("No application ID provided")
      setIsLoading(false)
      return
    }

    loadMCQs()
  }, [applicationId])

  const loadMCQs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      let mcqData
      try {
        mcqData = await apiCall(`/users/job-application/${applicationId}/mcqs`, {
          method: 'GET'
        })
      } catch (err: any) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          console.log("MCQs not found, generating new ones...")
          mcqData = await apiCall(`/users/job-application/${applicationId}/generate-mcqs`, {
            method: 'POST'
          })
          mcqData = mcqData.mcq
        } else {
          throw err
        }
      }

      if (mcqData && mcqData.questions) {
        setQuestions(mcqData.questions)
        setAnswers(Array.from({ length: mcqData.questions.length }, () => ({
          selectedIndex: null,
          timeSpentSec: 0,
        })))
      } else {
        throw new Error("Invalid MCQ data received")
      }
    } catch (err: any) {
      console.error("Error loading MCQs:", err)
      setError(err.message || "Failed to load MCQs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (questions.length === 0) return

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
  }, [currentIdx, questions.length])

  useEffect(() => {
    setTimeLeft(SECONDS_PER_QUESTION)
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

  const handleSubmit = async () => {
    setSubmitting(true)
    
    try {
      console.log("Starting MCQ submission...");
      
      const finalizedAnswers = answers.map((a, idx) =>
        idx === currentIdx
          ? {
            ...a,
            timeSpentSec: Math.min(SECONDS_PER_QUESTION, Math.max(a.timeSpentSec, SECONDS_PER_QUESTION - timeLeft)),
          }
          : a,
      )

      const submissionData = finalizedAnswers.map((answer, index) => ({
        questionIndex: index,
        selectedAnswer: answer.selectedIndex !== null ? questions[index].options[answer.selectedIndex] : '',
        selectedIndex: answer.selectedIndex,
        timeSpent: answer.timeSpentSec
      }))

      const totalTimeTaken = finalizedAnswers.reduce((sum, answer) => sum + answer.timeSpentSec, 0)

      console.log("Submission data:", submissionData);
      console.log("Total time taken:", totalTimeTaken);

      const response = await apiCall(`/users/job-application/${applicationId}/submit-mcqs`, {
        method: 'POST',
        body: JSON.stringify({
          answers: submissionData,
          timeTaken: totalTimeTaken
        })
      })

      console.log("MCQ submission response:", response);

      const result = questions.map((q, idx) => {
        const userAnswer = finalizedAnswers[idx]
        
        console.log(`Question ${idx + 1}:`, {
          question: q.question.substring(0, 50) + "...",
          correctAnswer: q.correctAnswer,
          options: q.options,
          selectedIndex: userAnswer.selectedIndex,
          selectedOption: userAnswer.selectedIndex !== null ? q.options[userAnswer.selectedIndex] : null
        });
        
        const correctIndex = q.options.findIndex(opt => 
          opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
        )
        console.log(`Question ${idx + 1} correctIndex:`, correctIndex);
        
        const isCorrect = userAnswer.selectedIndex !== null && 
                         userAnswer.selectedIndex === correctIndex
        
        return {
          id: idx + 1,
          topic: q.topic || 'General',
          question: q.question,
          options: q.options,
          correctIndex: correctIndex,
          selectedIndex: userAnswer.selectedIndex,
          correct: isCorrect,
          timeSpentSec: userAnswer.timeSpentSec,
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

      console.log("Calculated results:", {
        result,
        totalCorrect,
        topicStats,
        avgTimeSec,
        total: questions.length,
        applicationId
      });

      console.log("Navigating to MCQ analysis page...");

      navigate("/add-jobs/mcq-analysis", {
        state: {
          result,
          totalCorrect,
          topicStats,
          avgTimeSec,
          total: questions.length,
          applicationId
        },
      })
      
      console.log("Navigation completed");
      
    } catch (err: any) {
      console.error("Error submitting MCQs:", err)
      setError(err.message || "Failed to submit answers")
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <MLoader size={140} />
          <span className="mt-3 text-sm text-zinc-400">Loading MCQ Questions...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Mock MCQ</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <h2 className="text-red-400 font-semibold mb-2">Error Loading MCQs</h2>
            <p className="text-red-300">{error}</p>
            <Button 
              onClick={() => navigate(-1)} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Submitting state
  if (submitting) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <MLoader size={140} />
          <span className="mt-3 text-sm text-zinc-400">Generating Your Results...</span>
        </div>
      </div>
    )
  }

  // No questions loaded
  if (questions.length === 0) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Mock MCQ</h1>
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6">
            <h2 className="text-yellow-400 font-semibold mb-2">No Questions Available</h2>
            <p className="text-yellow-300">No MCQ questions were generated for this application.</p>
            <Button 
              onClick={() => navigate(-1)} 
              className="mt-4 bg-yellow-600 hover:bg-yellow-700"
            >
              Go Back
            </Button>
          </div>
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
          currentStep={2.01}
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
              <Label className="text-zinc-300">Progress</Label>
              <span className="text-sm text-zinc-400">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="mt-3 h-2" />
          </div>

          <div className="mt-6 flex items-center justify-end mr-1">
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
                        name={`q-${currentIdx}`}
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
