import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import AppStepper from "@/components/custom/AppStepper";
import {
  User,
  FileText,
  ListChecks,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
// Import AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApiCall } from "@/lib/api";
import MLoader from "@/components/custom/Mloader";

type ResultItem = {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  correct: boolean;
  timeSpentSec: number;
};

type LocationState = {
  result?: ResultItem[];
  totalCorrect?: number;
  topicStats?: Record<string, { correct: number; total: number }>;
  avgTimeSec?: number;
  total?: number;
  applicationId?: string;
};

type MCQQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  topic?: string;
};

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const McqAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiCall = useApiCall();
  const state = (location.state || {}) as LocationState;

  const [processedResults, setProcessedResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  // const [openRetakeDialog, setOpenRetakeDialog] = useState(false);
  const [openMockInterviewDialog, setOpenMockInterviewDialog] = useState(false);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const applicationId = state.applicationId || localStorage.getItem('currentApplicationId');

  console.log("MCQ Analysis - received state:", state);
  console.log("MCQ Analysis - applicationId:", applicationId);

  useEffect(() => {
    try {
      if (state.result && state.result.length > 0) {
        console.log("Using results from navigation state");
        setProcessedResults(state.result);
        setLoading(false);
        return;
      }

      if (applicationId) {
        console.log("Fetching results from backend");
        fetchMCQResults();
      } else {
        setError("No application ID found");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error in useEffect:", err);
      setError("Failed to initialize MCQ analysis: " + err.message);
      setLoading(false);
    }
  }, [applicationId, state.result]);

  useEffect(() => {
    if (processedResults.length > 0) {
      const totalCorrect = processedResults.filter(r => r.correct).length;
      const scorePct = Math.round((totalCorrect / processedResults.length) * 100);
      const controls = animate(count, scorePct, { duration: 1.5 });
      return controls.stop;
    }
  }, [count, processedResults]);

  const fetchMCQResults = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching MCQ results for applicationId:", applicationId);

      const response = await apiCall(`/users/job-application/${applicationId}/mcq-results`, {
        method: 'GET'
      });

      console.log("MCQ results response:", response);

      if (response.results && response.questions) {
        const processed = response.questions.map((question: MCQQuestion, index: number) => {
          const userAnswer = response.results.answersSubmitted.find(
            (answer: any) => answer.questionIndex === index
          );
          
          const correctIndex = question.options.findIndex(opt => 
            opt.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
          );
          
          let selectedIndex = null;
          if (userAnswer) {
            // Use selectedIndex if available from backend
            if (typeof userAnswer.selectedIndex === 'number' && userAnswer.selectedIndex >= 0) {
              selectedIndex = userAnswer.selectedIndex;
            } else if (userAnswer.selectedAnswer) {
              // Fallback: find index by matching selected answer text
              selectedIndex = question.options.findIndex(opt => 
                opt.trim().toLowerCase() === userAnswer.selectedAnswer.trim().toLowerCase()
              );
            }
          }

          const isCorrect = userAnswer?.isCorrect === true;

          console.log(`Question ${index + 1} processing:`, {
            question: question.question.substring(0, 50) + "...",
            correctAnswer: question.correctAnswer,
            correctIndex,
            selectedAnswer: userAnswer?.selectedAnswer,
            selectedIndex,
            isCorrect: userAnswer?.isCorrect,
            calculated: selectedIndex === correctIndex
          });

          return {
            id: index + 1,
            topic: question.topic || 'General',
            question: question.question,
            options: question.options,
            correctIndex,
            selectedIndex,
            correct: isCorrect,
            timeSpentSec: userAnswer?.timeSpent || 0
          };
        });

        console.log("Processed results:", processed);
        setProcessedResults(processed);
      } else {
        throw new Error("Invalid response format: " + JSON.stringify(response));
      }
    } catch (err: any) {
      console.error("Error fetching MCQ results:", err);
      setError(err.message || "Failed to load MCQ results");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <MLoader size={140} />
          <span className="mt-3 text-sm text-zinc-400">Loading MCQ Results...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">MCQ Analytics</h1>
        <div className="rounded-lg border bg-zinc-900 p-6">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error Loading Results</span>
          </div>
          <p className="mt-2 text-sm text-zinc-300">
            {error}
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => navigate("/add-jobs/mcq", { state: { applicationId } })}
            >
              Retake MCQ
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasData = processedResults.length > 0;
  
  console.log('McqAnalysis - hasData:', hasData, 'processedResults:', processedResults);
  
  if (!hasData) {
    console.log('McqAnalysis - Rendering no data message');
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
              onClick={() => navigate("/add-jobs/mcq", { state: { applicationId } })}
            >
              Go to MCQ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const total = processedResults.length;
  const totalCorrect = processedResults.filter(r => r.correct).length;
  const scorePct = Math.round((totalCorrect / total) * 100);
  
  console.log('McqAnalysis - Rendering results page with stats:', {
    total,
    totalCorrect,
    scorePct,
    avgTime: Math.round(processedResults.reduce((sum, r) => sum + (r.timeSpentSec || 0), 0) / total)
  });
  
  const topicStats = processedResults.reduce<Record<string, { correct: number; total: number }>>((acc, r) => {
    acc[r.topic] = acc[r.topic] || { correct: 0, total: 0 };
    acc[r.topic].total += 1;
    if (r.correct) acc[r.topic].correct += 1;
    return acc;
  }, {});

  const avgTimeSec = Math.round(
    processedResults.reduce((sum, r) => sum + (r.timeSpentSec || 0), 0) / total
  );

  // const incorrect = processedResults.filter((r) => !r.correct);
  const topics = Object.entries(topicStats);

  // const MAX_TIME = 120;
  // const timePct = Math.min(
  //   Math.round((avgTimeSec / MAX_TIME) * 100),
  //   100
  // );

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">MCQ Analytics</h1>

      <div className="flex-1 flex flex-col gap-6">
        <AppStepper
          currentStep={2.4}
          steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            // { icon: <Mic className="h-5 w-5" />, label: "Interview" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          {/* Score Section - Full Width */}
          <div className="rounded-lg border border-zinc-700 p-6 text-center mb-6">
            <div className={`text-5xl font-bold mb-2 ${
              scorePct >= 80 ? 'text-emerald-400' : 
              scorePct >= 40 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              <motion.span>{rounded}</motion.span>%
            </div>
            <Label className="text-zinc-300 text-lg">Overall Score</Label>
            <div className="mt-2 text-sm text-zinc-400">
              {totalCorrect} out of {total} correct answers
            </div>
            <div className={`mt-4 h-3 rounded-full ${
              scorePct >= 80 ? 'bg-emerald-500/20' : 
              scorePct >= 40 ? 'bg-yellow-500/20' : 
              'bg-red-500/20'
            }`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  scorePct >= 80 ? 'bg-emerald-500' : 
                  scorePct >= 40 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Topic-wise Performance */}
            <div className="rounded-lg border border-zinc-700 p-5">
              <Label className="text-zinc-300">Topic-wise Performance</Label>
              <div className="mt-4 space-y-3">
                {topics.map(([topic, stats]) => {
                  const topicPct = Math.round((stats.correct / stats.total) * 100);
                  
                  const getPerformanceIcon = (percentage: number) => {
                    if (percentage >= 80) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
                    if (percentage >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
                    return <XCircle className="h-4 w-4 text-red-400" />;
                  };
                  
                  const getPerformanceTextColor = (percentage: number) => {
                    if (percentage >= 80) return 'text-emerald-400';
                    if (percentage >= 60) return 'text-yellow-400';
                    return 'text-red-400';
                  };
                  
                  return (
                    <div key={topic}>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {getPerformanceIcon(topicPct)}
                          <span className="text-zinc-200">{topic}</span>
                        </div>
                        <span className={`${getPerformanceTextColor(topicPct)} font-medium`}>
                          {stats.correct}/{stats.total} ({topicPct}%)
                        </span>
                      </div>
                      <Progress value={topicPct} className="mt-1 h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Average Time Section */}
            <div className="rounded-lg border border-zinc-700 p-5">
              <Label className="text-zinc-300">Average Time per Question</Label>
              <div className="mt-4 flex items-center justify-center">
                <div className="relative">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={[
                        { name: "Used", value: Math.min(avgTimeSec, 30) },
                        { name: "Remaining", value: Math.max(0, 30 - avgTimeSec) }
                      ]}
                      cx={90}
                      cy={90}
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#3b82f6" stroke="none" />
                      <Cell fill="#374151" stroke="none" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">
                        {formatSeconds(avgTimeSec)}
                      </div>
                      <div className="text-sm text-zinc-400">
                        per question
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                    <span className="text-zinc-300">Time Used</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span className="text-zinc-300">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {processedResults.length > 0 && (
            <div className="mt-6 rounded-lg border border-zinc-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-zinc-300">All Questions Review</Label>
                {processedResults.length > 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllQuestions(!showAllQuestions)}
                    className="text-xs border-zinc-600 text-zinc-300 hover:text-white"
                  >
                    {showAllQuestions ? "Show Less" : `Show All ${processedResults.length}`}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {(showAllQuestions ? processedResults : processedResults.slice(0, 3)).map((item) => (
                  <div key={item.id} className="rounded-lg border border-zinc-800 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-zinc-200 mb-2">
                          Q{item.id}: {item.question}
                        </div>
                        <div className="mb-3">
                          {item.correct ? (
                            <div className="flex items-center gap-1 text-emerald-400">
                              <span className="text-xs">✓ Correct</span>
                            </div>
                          ) : item.selectedIndex === null ? (
                            <div className="flex items-center gap-1 text-amber-400">
                              <span className="text-xs">— Not Answered</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-400">
                              <span className="text-xs">✗ Incorrect</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          {item.options.map((opt, idx) => {
                            const isCorrect = idx === item.correctIndex;
                            const isSelected = idx === item.selectedIndex;
                            return (
                              <div
                                key={idx}
                                className={`text-xs px-2 py-1 rounded ${
                                  isCorrect
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : isSelected
                                    ? "bg-red-500/20 text-red-300"
                                    : "text-zinc-400"
                                }`}
                              >
                                {opt} {isCorrect && "✓"} {isSelected && !isCorrect && "✗"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="ml-4 text-xs text-zinc-400">
                        Time: {formatSeconds(item.timeSpentSec)}
                      </div>
                    </div>
                  </div>
                ))}
                {!showAllQuestions && processedResults.length > 3 && (
                  <div className="text-center text-sm text-zinc-400">
                    ... and {processedResults.length - 3} more questions to review
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-end gap-3">
            
            {/* <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => setOpenMockInterviewDialog(true)}
            >
              Mock Interview
            </Button> */}
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => navigate("/add-jobs/final-report")}
            >
              Final Analysis
            </Button>
            <AlertDialog open={openMockInterviewDialog} onOpenChange={setOpenMockInterviewDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Mock Interview?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will start an AI-powered mock interview session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenMockInterviewDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/add-jobs/mock-interview")}>
                    Start Interview
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </div>
  );
};

export default McqAnalysis;