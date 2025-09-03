import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, FileText, ListChecks, Mic,Award } from "lucide-react"
import AppStepper from "@/components/custom/AppStepper"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import MLoader from "@/components/custom/Mloader"

const JobDetails = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const goBack = () => navigate("/add-jobs/personal-details")

  const handleResumeAnalysis = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800))
    navigate("/add-jobs/resume-analysis")
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
      {loading && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <MLoader size={140} />
            <span className="mt-3 text-sm text-zinc-400">Scanning your Resume...</span>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Job Details</h1>

      <div className="flex-1 flex flex-col gap-6">
        <AppStepper
          currentStep={1.2}
           steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            { icon: <Mic className="h-5 w-5" />, label: "Interview" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Job Title</Label>
              <Input placeholder="Enter job title..." className="bg-gray-800 text-white placeholder:text-gray-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Company Name</Label>
              <Input placeholder="Enter company name..." className="bg-gray-800 text-white placeholder:text-gray-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Job Location</Label>
              <Input placeholder="Enter job location/remote" className="bg-gray-800 text-white placeholder:text-gray-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Required years of experience</Label>
              <Input type="number" placeholder="Enter required years of experience" className="bg-gray-800 text-white placeholder:text-gray-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Job Type</Label>
              <Input placeholder="Enter Job Type (fulltime/intern)" className="bg-gray-800 text-white placeholder:text-gray-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Job Industry</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Enter job industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mt-6 w-full">
            <Label className="text-gray-300">Job Description</Label>
            <Textarea placeholder="Enter job description..." className="bg-gray-800 text-white placeholder:text-gray-400" />
          </div>

          <div className="space-y-2 mt-6 w-full">
            <Label className="text-gray-300">Required Tech Stack</Label>
            <Textarea placeholder="e.g. React, Angular, Postgres" className="bg-gray-800 text-white placeholder:text-gray-400" />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button type="button" variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700" onClick={goBack}>
              Back
            </Button>
            <Button onClick={handleResumeAnalysis} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">
              Resume Analysis
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default JobDetails
