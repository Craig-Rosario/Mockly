import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import AppStepper from "@/components/custom/AppStepper"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
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
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()
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
            { icon: <Mic className="h-5 w-5" />, label: "Interview" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <div className="rounded-lg border border-zinc-700 p-5">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Match Score</Label>
              <span className="text-2xl font-semibold">64%</span>
            </div>
            <Progress value={64} className="mt-3 h-2" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-700 p-5">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-300">Needed Keywords</Label>
                <span className="text-sm text-zinc-400">50% covered</span>
              </div>
              <Progress value={50} className="mt-3 h-2" />

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md px-2.5 py-1 text-xs border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">React</span>
                <span className="rounded-md px-2.5 py-1 text-xs border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">TypeScript</span>
                <span className="rounded-md px-2.5 py-1 text-xs border border-zinc-700 text-zinc-300 bg-zinc-800">Flutter</span>
                <span className="rounded-md px-2.5 py-1 text-xs border border-zinc-700 text-zinc-300 bg-zinc-800">PostgreSQL</span>
                <span className="rounded-md px-2.5 py-1 text-xs border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">REST APIs</span>
                <span className="rounded-md px-2.5 py-1 text-xs border border-zinc-700 text-zinc-300 bg-zinc-800">Linux</span>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-700 p-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <Label className="text-zinc-300">Overall Suggestions</Label>
              </div>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                Add concrete impact (metrics), expand internship bullets with scope/ownership,
                and cover missing stack items if you have real experience with them.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-700 p-5">
              <Label className="text-zinc-300">Things that match</Label>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> React
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> TypeScript
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> REST APIs
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Express
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-zinc-700 p-5">
              <Label className="text-zinc-300">Things that are missing</Label>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-zinc-200">
                  <XCircle className="h-4 w-4 text-rose-400" /> Flutter (production)
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-200">
                  <XCircle className="h-4 w-4 text-rose-400" /> PostgreSQL
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-200">
                  <XCircle className="h-4 w-4 text-rose-400" /> Docker
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-zinc-700 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-zinc-300" />
              <h3 className="text-lg font-semibold">Internship Experience</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-700 p-4 md:flex md:items-start md:justify-between">
                <div>
                  <div className="font-medium">Fullstack Developer — SwDC</div>
                  <div className="text-xs text-zinc-400">Dec 2024 - Aug 2024</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">React</span>
                    <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">Node</span>
                    <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">MongoDB</span>
                    <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">Express</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:w-80">
                  <div className="text-xs text-zinc-400">Relevance</div>
                  <Progress value={62} className="h-2 mt-1" />
                  <div className="mt-3 text-xs text-zinc-400">Depth / Ownership</div>
                  <Progress value={45} className="h-2 mt-1" />
                  <ul className="mt-3 list-disc pl-4 text-xs text-zinc-300 space-y-1">
                    <li>Quantify outcomes in detail</li>
                    <li>Mention the results</li>
                    <li>Explain how the stack was used</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-700 p-4 md:flex md:items-start md:justify-between">
                <div>
                  <div className="font-medium">Applied for — Google</div>
                  <div className="text-xs text-zinc-400">Jan - Apr 2024</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">React</span>
                    <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">Vite</span>
                    <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">Tailwind</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:w-80">
                  <div className="text-xs text-zinc-400">Relevance</div>
                  <Progress value={16} className="h-2 mt-1" />
                  <div className="mt-3 text-xs text-zinc-400">Depth / Ownership</div>
                  <Progress value={12} className="h-2 mt-1" />
                  <ul className="mt-3 list-disc pl-4 text-xs text-zinc-300 space-y-1">
                    <li>You didn't work here bru</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-zinc-700 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-zinc-300" />
              <h3 className="text-lg font-semibold">Project Suggestions</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-700 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">Realtime Chat</div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-zinc-400">Relevance</div>
                    <Progress value={66} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400">Complexity (0-8)</div>
                    <Progress value={(4 / 8) * 100} className="h-2 mt-1" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">Next.js</span>
                  <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">Socket.io</span>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-zinc-400">Suggestions</div>
                  <ul className="mt-1 list-disc pl-4 text-xs text-zinc-300 space-y-1">
                    <li>Add auth/roles</li>
                    <li>Add E2E tests</li>
                    <li>Share live demo</li>
                    <li>Deploy the project</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-700 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">Todo List</div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-zinc-400">Relevance</div>
                    <Progress value={24} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400">Complexity (0-8)</div>
                    <Progress value={(2 / 8) * 100} className="h-2 mt-1" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">MERN</span>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-zinc-400">Suggestions</div>
                  <ul className="mt-1 list-disc pl-4 text-xs text-zinc-300 space-y-1">
                    <li>Deploy project</li>
                    <li>Increase scope — currently basic</li>
                  </ul>
                </div>
              </div>
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
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">
              Mock Interview
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={() => setOpenDialog(true)}
            >
              Mock MCQ
            </Button>
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Mock MCQ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once started, the timer will begin for each question. Are you ready?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/add-jobs/mcq")}>
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
export default ResumeAnalysis