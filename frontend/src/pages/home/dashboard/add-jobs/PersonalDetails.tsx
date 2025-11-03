import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, FileText, ListChecks, Award } from "lucide-react"
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
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useJobApplication } from "@/contexts/JobApplicationContext"
import { resumeApi } from "@/lib/api"
import { useAuth } from "@clerk/clerk-react"

const PersonalDetails = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { applicationData, updatePersonalDetails } = useJobApplication();
  const [uploaderKey, setUploaderKey] = useState(0)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [currentResume, setCurrentResume] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    candidateName: applicationData.personalDetails.candidateName || '',
    candidateEmail: applicationData.personalDetails.candidateEmail || '',
    candidateLocation: applicationData.personalDetails.candidateLocation || '',
    willingToRelocate: applicationData.personalDetails.willingToRelocate || 'no',
    totalYOE: applicationData.personalDetails.totalYOE || 0,
    primaryStack: applicationData.personalDetails.primaryStack?.join(', ') || ''
  })

  // Load current resume on mount
  useEffect(() => {
    const loadCurrentResume = async () => {
      try {
        const token = await getToken()
        if (!token) return
        
        const resume = await resumeApi.getCurrentResume(token)
        if (resume.success && resume.resume) {
          setCurrentResume(resume.resume)
        }
      } catch (error) {
        console.log('No current resume found:', error)
      }
    }

    loadCurrentResume()
  }, [getToken])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = async (f: File[]) => {
    if (f.length === 0) return

    setIsUploadingResume(true)
    
    try {
      const token = await getToken()
      if (!token) {
        alert('Please sign in to upload resume')
        return
      }

      const result = await resumeApi.uploadResume(f[0], token)
      
      if (result.success) {
        setCurrentResume(result.resume)
        console.log('Resume uploaded successfully:', result.resume)
      }
    } catch (error: any) {
      console.error('Resume upload failed:', error)
      alert(`Resume upload failed: ${error.message}`)
      setUploaderKey((k) => k + 1)
    } finally {
      setIsUploadingResume(false)
    }
  }

  const clearResume = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    
    try {
      const token = await getToken()
      if (token && currentResume) {
        await resumeApi.deleteResume(token)
      }
      
      setCurrentResume(null)
      setUploaderKey((k) => k + 1)
    } catch (error: any) {
      console.error('Failed to delete resume:', error)
      alert(`Failed to delete resume: ${error.message}`)
    }
  }

  const handleNext = () => {
    if (!formData.candidateName || !formData.candidateEmail || !formData.candidateLocation) {
      alert('Please fill in all required fields')
      return
    }

    const personalDetailsData = {
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      candidateLocation: formData.candidateLocation,
      willingToRelocate: formData.willingToRelocate,
      totalYOE: Number(formData.totalYOE),
      primaryStack: formData.primaryStack.split(',').map(skill => skill.trim()).filter(skill => skill),
      resumeId: currentResume?._id || null,
      resumeFileUrl: currentResume?.filename || ''
    }

    console.log('Saving personal details:', personalDetailsData)

    updatePersonalDetails(personalDetailsData)

    navigate('/add-jobs/job-details')
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
            // { icon: <Mic className="h-5 w-5" />, label: "Interview" },
            { icon: <Award className="h-5 w-5" />, label: "Final" },
          ]}
        />

        <section className="rounded-lg border bg-zinc-900 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Full Name *</Label>
              <Input
                placeholder="Enter your full name..."
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.candidateName}
                onChange={(e) => handleInputChange('candidateName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Email *</Label>
              <Input
                type="email"
                placeholder="Enter your email..."
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.candidateEmail}
                onChange={(e) => handleInputChange('candidateEmail', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Location *</Label>
              <Input
                placeholder="Enter your location..."
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.candidateLocation}
                onChange={(e) => handleInputChange('candidateLocation', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Willing to relocate</Label>
              <Select value={formData.willingToRelocate} onValueChange={(value) => handleInputChange('willingToRelocate', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Are you willing to relocate?" />
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
                type="number"
                placeholder="Years of Experience"
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.totalYOE}
                onChange={(e) => handleInputChange('totalYOE', Number(e.target.value))}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Primary Stack</Label>
              <Textarea
                placeholder="e.g. React, Angular, PostgreSQL"
                className="bg-gray-800 text-white placeholder:text-gray-400"
                value={formData.primaryStack}
                onChange={(e) => handleInputChange('primaryStack', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Resume Upload</Label>
              <div className="relative rounded-lg border border-zinc-700 p-4">
                {currentResume ? (
                  <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-400">Resume Uploaded</p>
                        <p className="text-xs text-gray-400">
                          {currentResume.originalName} • {Math.round(currentResume.size / 1024)} KB
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(currentResume.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={clearResume}
                      variant="outline"
                      size="sm"
                      className="bg-red-900/20 border-red-600 text-red-400 hover:bg-red-900/40"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    {isUploadingResume && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                        <div className="text-white text-sm">Uploading resume...</div>
                      </div>
                    )}
                    <FileUpload key={uploaderKey} onChange={handleFileUpload} />
                  </>
                )}
              </div>
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
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              onClick={handleNext}
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
