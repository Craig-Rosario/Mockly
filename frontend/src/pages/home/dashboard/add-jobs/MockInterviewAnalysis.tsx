import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import AppStepper from "@/components/custom/AppStepper";
import {
  User,
  FileText,
  ListChecks,
  Mic,
  AlertTriangle,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
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

const mockAnalysisData = {
  overallScore: 7.5,
  feedback: {
    communication: 8.5,
    confidence: 7.0,
    answerDepth: 7.5,
    techKnowledge: 9.0,
  },
  thingsToWorkOn: [
    "Speak more slowly and clearly, especially when defining complex terms.",
    "Structure behavioral questions using the STAR method (Situation, Task, Action, Result) to provide concise, impactful stories.",
    "Provide more real-world code examples to illustrate your points on technical questions.",
    "Work on maintaining eye contact with the camera to appear more engaged.",
  ],
  bestAnswers: [
    {
      question: "Can you explain the difference between useEffect and useLayoutEffect?",
      feedback: "Your explanation of the rendering lifecycle was very clear and accurate. You correctly identified when each hook runs and provided a relevant use case for useLayoutEffect, demonstrating a solid understanding.",
    },
  ],
  questionBreakdown: [
    {
      question: "What is the role of the virtual DOM in React?",
      yourAnswer: "The virtual DOM is a lightweight copy of the real DOM. When state changes, React updates the virtual DOM and then efficiently applies only the minimal changes to the real DOM.",
      suggestedAnswer: "Your answer was accurate and to the point. To make it even stronger, you could have mentioned the **reconciliation** process and how it is key to minimizing performance costs.",
      score: 8,
    },
  ],
};

const MockInterviewAnalysis = () => {
  const navigate = useNavigate();

  // === CHANGES START HERE ===
  // Add a new state to control the "Retake Interview" alert dialog
  const [openRetakeDialog, setOpenRetakeDialog] = useState(false);
  // === CHANGES END HERE ===

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    return "text-rose-400";
  };

  const getIconForScore = (score: number) => {
    if (score >= 8) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    if (score >= 6) return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    return <XCircle className="h-4 w-4 text-rose-400" />;
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Mock Interview Analysis</h1>

      <div className="flex-1 flex flex-col gap-6">
        <AppStepper
          currentStep={4.8}
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
              <Label className="text-zinc-400 text-lg mb-2">Overall Score</Label>
              <span className={`text-6xl font-bold ${getScoreColor(mockAnalysisData.overallScore)}`}>
                {mockAnalysisData.overallScore}/10
              </span>
              <div className="mt-3 text-sm text-zinc-400">
                Excellent performance!
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-700 p-5">
                <Label className="text-zinc-300">Skills Breakdown</Label>
                <div className="mt-4 space-y-3">
                  {Object.entries(mockAnalysisData.feedback).map(([skill, score]) => (
                    <div key={skill} className="rounded-md p-2 transition">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {getIconForScore(score as number)}
                          <span className="text-zinc-200">{skill}</span>
                        </div>
                        <span className={`font-semibold ${getScoreColor(score as number)}`}>
                          {score}/10
                        </span>
                      </div>
                      <Progress value={(score as number) * 10} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-zinc-700 p-5 flex flex-col">
                <Label className="text-zinc-300 flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Things to Work On
                </Label>
                <ul className="list-disc pl-4 text-sm text-zinc-300 space-y-2">
                  {mockAnalysisData.thingsToWorkOn.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mt-8 rounded-lg border border-zinc-700 p-5">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Best Answers
              </h3>
              <div className="space-y-4">
                {mockAnalysisData.bestAnswers.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-zinc-700 p-4 hover:border-blue-500 hover:bg-zinc-800 transition">
                    <div className="font-medium text-zinc-200">Q: {item.question}</div>
                    <div className="mt-2 text-sm text-emerald-300">
                      <span className="font-semibold">Feedback:</span> {item.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="mt-8 rounded-lg border border-zinc-700 p-5">
              <h3 className="mb-4 text-lg font-semibold">
                Question-by-Question Review
              </h3>
              <div className="space-y-4">
                {mockAnalysisData.questionBreakdown.map((r, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-zinc-700 p-4 hover:border-blue-500 hover:bg-zinc-800 transition"
                  >
                    <div className="font-medium text-zinc-200">Q: {r.question}</div>
                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <span className="text-sm font-semibold text-zinc-400">Your Answer: </span>
                        <p className="mt-1 text-zinc-200">{r.yourAnswer}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-zinc-400">Suggested Improvement: </span>
                        <p className="mt-1 text-zinc-300">{r.suggestedAnswer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="mt-8 flex items-center justify-end gap-3">
              {/* === CHANGES START HERE === */}
              {/* Added onClick to open the dialog and an AlertDialog component */}
              <Button
                className="bg-gray-800 text-white hover:bg-gray-700"
                onClick={() => setOpenRetakeDialog(true)}
              >
                Retake Interview
              </Button>
              <AlertDialog open={openRetakeDialog} onOpenChange={setOpenRetakeDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Retake Interview?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will start a new interview session. Your previous analysis will be saved, but you will begin a new one. Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpenRetakeDialog(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => navigate("/add-jobs/mock-interview")}>
                      Start
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* === CHANGES END HERE === */}
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                onClick={() => navigate("/add-jobs/final-report")}
              >
                Go to Next Step
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default MockInterviewAnalysis;