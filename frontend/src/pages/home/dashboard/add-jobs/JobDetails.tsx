import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, FileText, ListChecks,Award } from "lucide-react"
import AppStepper from "@/components/custom/AppStepper"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import MLoader from "@/components/custom/Mloader"
import { useJobApplication } from "@/contexts/JobApplicationContext"
import { useAuth } from "@clerk/react-router"
import { jobApplicationApi } from "@/lib/api"

const JobDetails = () => {
  const navigate = useNavigate()
  const { applicationData, updateJobDetails, submitApplication } = useJobApplication()
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    jobTitle: applicationData.jobDetails.jobTitle || '',
    company: applicationData.jobDetails.company || '',
    location: applicationData.jobDetails.location || '',
    workMode: applicationData.jobDetails.workMode || 'Remote',
    jobType: applicationData.jobDetails.jobType || '',
    jobIndustry: applicationData.jobDetails.jobIndustry || '',
    jobDescription: applicationData.jobDetails.jobDescription || '',
    requiredSkills: applicationData.jobDetails.requiredSkills?.join(', ') || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const goBack = () => navigate("/add-jobs/personal-details")

  const handleResumeAnalysis = async () => {
    if (!formData.jobTitle || !formData.company || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    console.log('Current form data:', formData)
    console.log('Current application data:', applicationData)

    const jobDetailsData = {
      jobTitle: formData.jobTitle,
      company: formData.company,
      location: formData.location,
      workMode: formData.workMode,
      jobType: formData.jobType,
      jobIndustry: formData.jobIndustry,
      jobDescription: formData.jobDescription,
      requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill)
    }

    updateJobDetails(jobDetailsData)

    setLoading(true)
    
    try {
      const token = await getToken();
      
      const testData = {
        ...applicationData.personalDetails,
        ...jobDetailsData
      };
      
      console.log('Testing API connection with data:', testData);
      
      const testResult = await jobApplicationApi.testConnection(testData, token || undefined);
      console.log('Test API call successful:', testResult);
      
      await submitApplication({
        jobDetails: jobDetailsData
      })
      console.log('Job application submitted successfully')
      
      try {
        const debugResponse = await fetch('/api/users/debug-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const debugData = await debugResponse.json();
        console.log('Debug verification:', debugData);
      } catch (debugError) {
        console.error('Debug verification failed:', debugError);
      }
      
      // Navigate to resume analysis page immediately
      // The analysis will be triggered from the ResumeAnalysis component
      navigate("/add-jobs/resume-analysis")
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
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
            // { icon: <Mic className="h-5 w-5" />, label: "Interview" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Job Title *</Label>
              <Input 
                placeholder="Enter job title..." 
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Company Name *</Label>
              <Input 
                placeholder="Enter company name..." 
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Job Location *</Label>
              <Input 
                placeholder="Enter job location/remote" 
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Work Mode</Label>
              <Select value={formData.workMode} onValueChange={(value) => handleInputChange('workMode', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Job Type</Label>
              <Input 
                placeholder="Enter Job Type (fulltime/intern)" 
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.jobType}
                onChange={(e) => handleInputChange('jobType', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Job Industry</Label>
              <Select value={formData.jobIndustry} onValueChange={(value) => handleInputChange('jobIndustry', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Enter job industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mt-6 w-full">
            <Label className="text-gray-300">Job Description</Label>
            <Textarea 
              placeholder="Enter job description..." 
              className="bg-gray-800 text-white placeholder:text-gray-400"
              value={formData.jobDescription}
              onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            />
          </div>

          <div className="space-y-2 mt-6 w-full">
            <Label className="text-gray-300">Required Tech Stack</Label>
            <Textarea 
              placeholder="e.g. React, Angular, PostgreSQL" 
              className="bg-gray-800 text-white placeholder:text-gray-400"
              value={formData.requiredSkills}
              onChange={(e) => handleInputChange('requiredSkills', e.target.value)}
            />
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
