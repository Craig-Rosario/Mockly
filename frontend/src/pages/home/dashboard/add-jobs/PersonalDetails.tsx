import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, FileText, ListChecks, Mic } from "lucide-react"
import AppStepper from "@/components/custom/AppStepper"

import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const PersonalDetails = () => {
  const navigate=useNavigate();
  const [files, setFiles] = useState<File[]>([])
  const [uploaderKey, setUploaderKey] = useState(0)

  const handleFileUpload = (f: File[]) => {
    setFiles(f)
    console.log(f)
  }

  const clearResume = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setFiles([])
    setUploaderKey((k) => k + 1)
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Personal Details</h1>


      <div className="flex-1 flex flex-col gap-6">
        <AppStepper
          currentStep={0.4}
          steps={[
            { icon: <User className="h-5 w-5" />, label: "Personal Details" },
            { icon: <FileText className="h-5 w-5" />, label: "Job Details" },
            { icon: <ListChecks className="h-5 w-5" />, label: "MCQ" },
            { icon: <Mic className="h-5 w-5" />, label: "Interview" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Full Name</Label>
              <Input
                placeholder="Enter your full name..."
                className="bg-gray-800 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input
              type="email"
                placeholder="Enter your email email..."
                className="bg-gray-800 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Location</Label>
              <Input
                placeholder="Enter your location..."
                className="bg-gray-800 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Willing to relocate</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Are you willing to relocatet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Total YOE</Label>
              <Input
                placeholder="Years of Experience"
                className="bg-gray-800 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Primary Stack</Label>
              <Textarea
                placeholder="e.g. React, Angular, Pechkas"
                className="bg-gray-800 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="relative rounded-lg border border-zinc-700 p-4">
              <Button
                type="button"
                onClick={clearResume}
                disabled={!files.length}
                className="absolute right-2 top-2 z-50 bg-gray-800  border-gray-700 text-gray-200 hover:bg-gray-800 disabled:opacity-40"
              >
                Remove file
              </Button>

              <FileUpload key={uploaderKey} onChange={handleFileUpload} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Prefill
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={()=>navigate('/add-jobs/job-details')}
            >
              Next
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PersonalDetails
