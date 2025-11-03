import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  User,
  FileText,
  Upload,
  BarChart3,
  Clock,
  CheckCircle,
  Eye,
  MapPin,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"

interface UserData {
  _id: string
  name: string
  email: string
  clerkId: string
  bio?: string
  location?: string
  jobTitle?: string
  resume?: {
    fileName: string
    fileUrl: string
    uploadedAt: string
    fileSize: string
  }
  performance?: {
    resumeScore: number
    confidenceLevel: number
    completionRate: number
    interviewAttempts: number
    interviewAccuracy: number
    avgInterviewTime: number
    mcqPerformance: string
    mcqTestsTaken: number
    mcqSuccessRate: number
  }
}

interface AnalyticsData {
  resumePerformance: {
    overallScore: number
    keywordCoverage: number
    totalAnalyses: number
  }
  mcqPerformance: {
    totalMCQsTaken: number
    successRate: number
    avgTimePerMCQ: number
    avgTimePerMCQMinutes: number
    totalQuestionsAnswered: number
    totalCorrectAnswers: number
  }
}

export default function ProfileContent() {
  const { getToken } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [userLocation, setUserLocation] = useState<string>("")

  useEffect(() => {
    fetchUserData()
    fetchAnalytics()
    detectUserLocation()
  }, [getToken])

  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const data = await response.json()
            
            if (data.city && data.countryName) {
              const location = `${data.city}, ${data.countryName}`
              setUserLocation(location)
              
              await updateUserLocation(location)
            }
          } catch (error) {
            console.error("Error getting location:", error)
            setUserLocation("Location not available")
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          setUserLocation("Location access denied")
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      setUserLocation("Geolocation not supported")
    }
  }

  const updateUserLocation = async (location: string) => {
    try {
      const token = await getToken()
      const response = await fetch('/api/users/update-location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
      }
    } catch (error) {
      console.error('Error updating location:', error)
    }
  }

  const fetchUserData = async () => {
    try {
      const token = await getToken()
      const res = await fetch("/api/users/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUser(data)
      
      if (data.location) {
        setUserLocation(data.location)
      }
    } catch (err) {
      console.log("Cannot fetch user:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const token = await getToken()
      const res = await fetch("/api/users/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (err) {
      console.log("Cannot fetch analytics:", err)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUploadResume = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      const token = await getToken()
      
      const formData = new FormData()
      formData.append('resume', selectedFile)

      const response = await fetch('/api/users/upload-resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setSelectedFile(null)
        setShowUploadSection(false)
        const fileInput = document.getElementById('resume-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        alert('Resume uploaded successfully!')
      } else {
        throw new Error('Failed to upload resume')
      }
    } catch (err) {
      console.error('Error uploading resume:', err)
      alert('Failed to upload resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleViewResume = () => {
    if (user?.resume?.fileUrl) {
      window.open(user.resume.fileUrl, '_blank')
    }
  }

  // const handleDownloadResume = async () => {
  //   if (!user?.resume?.fileUrl) return

  //   try {
  //     const token = await getToken()
  //     const response = await fetch(user.resume.fileUrl, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
      
  //     if (response.ok) {
  //       const blob = await response.blob()
  //       const url = window.URL.createObjectURL(blob)
  //       const a = document.createElement('a')
  //       a.style.display = 'none'
  //       a.href = url
  //       a.download = user.resume.fileName
  //       document.body.appendChild(a)
  //       a.click()
  //       window.URL.revokeObjectURL(url)
  //       document.body.removeChild(a)
  //     }
  //   } catch (err) {
  //     console.error('Error downloading resume:', err)
  //     alert('Failed to download resume. Please try again.')
  //   }
  // }

  // const handleDeleteResume = async () => {
  //   if (!user?.resume) return

  //   if (!confirm('Are you sure you want to delete your resume?')) return

  //   try {
  //     const token = await getToken()
  //     const response = await fetch('/api/users/delete-resume', {
  //       method: 'DELETE',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })

  //     if (response.ok) {
  //       const updatedUser = await response.json()
  //       setUser(updatedUser)
  //       alert('Resume deleted successfully!')
  //     } else {
  //       throw new Error('Failed to delete resume')
  //     }
  //   } catch (err) {
  //     console.error('Error deleting resume:', err)
  //     alert('Failed to delete resume. Please try again.')
  //   }
  // }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1] || 'resume.pdf'
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-black text-white overflow-auto">
        <div className="flex items-center justify-center h-64">
          <p>Loading profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 bg-black text-white overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          {user ? (
            <h2 className="text-3xl font-bold bg-clip-text text-white">
              Hi {user.name}
            </h2>
          ) : (
            <h2 className="text-3xl font-bold bg-clip-text text-white">Hi User</h2>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-white">
            <User className="w-5 h-5 mr-2 text-cyan-400" />
            Basic User Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-8 w-full">
            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1">
              <div className="pr-8">
                <h4 className="text-2xl font-semibold text-white mb-1">
                  {user?.name || "Mockly Doe"}
                </h4>
                <p className="text-gray-300 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-400" />
                  {userLocation || "Detecting location..."}
                </p>
                <p className="text-gray-300 mb-1">
                  Email: {user?.email || "mockly.doe@email.com"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-white">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user?.resume ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getFileNameFromUrl(user.resume.fileUrl)}
                    </p>
                    <p className="text-gray-400 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-blue-400" />
                      Last updated: {formatDate(user.resume.uploadedAt)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Size: {user.resume.fileSize}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                    onClick={handleViewResume}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                  <Button
                    onClick={() => setShowUploadSection(!showUploadSection)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                </div>
              </div>

              {showUploadSection && (
                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-white font-medium mb-4">Update Resume</h4>
                  <div className="flex items-center space-x-4">
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex-1 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      {selectedFile ? (
                        <div>
                          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-white font-medium">{selectedFile.name}</p>
                          <p className="text-gray-400 text-sm">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400">
                            Click to select a PDF file (max 5MB)
                          </p>
                        </div>
                      )}
                    </label>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleUploadResume}
                        disabled={!selectedFile || uploading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
                      >
                        {uploading ? (
                          <>Uploading...</>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowUploadSection(false)
                          setSelectedFile(null)
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">No resume uploaded yet</p>
              
              <div className="max-w-md mx-auto">
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="block border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors mb-4"
                >
                  {selectedFile ? (
                    <div>
                      <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-white font-medium">{selectedFile.name}</p>
                      <p className="text-gray-400 text-sm">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">
                        Click to select a PDF file (max 5MB)
                      </p>
                    </div>
                  )}
                </label>
                <Button
                  onClick={handleUploadResume}
                  disabled={!selectedFile || uploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
                >
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center text-white text-lg">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
              Overall Resume Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsLoading ? (
              <div className="text-center py-6">
                <p className="text-gray-400">Loading performance data...</p>
              </div>
            ) : analytics?.resumePerformance?.totalAnalyses === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">No resume analyses yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload a resume and apply to jobs to see your performance metrics
                </p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Overall Score</span>
                    <span className="text-green-400 font-semibold">
                      {analytics?.resumePerformance?.overallScore || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics?.resumePerformance?.overallScore || 0} 
                    className="[&>div]:bg-green-400" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Keyword Coverage</span>
                    <span className="text-blue-400 font-semibold">
                      {analytics?.resumePerformance?.keywordCoverage || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics?.resumePerformance?.keywordCoverage || 0} 
                    className="[&>div]:bg-blue-400" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Total Analyses</span>
                    <span className="text-purple-400 font-semibold">
                      {analytics?.resumePerformance?.totalAnalyses || 0}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((analytics?.resumePerformance?.totalAnalyses || 0) * 10, 100)} 
                    className="[&>div]:bg-purple-400" 
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center text-white text-lg">
              <CheckCircle className="w-5 h-5 mr-2 text-purple-400" />
              Overall MCQ Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center py-6">
                <p className="text-gray-400">Loading MCQ data...</p>
              </div>
            ) : (analytics?.mcqPerformance?.totalMCQsTaken ?? 0) === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">No MCQs completed yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Complete some MCQ tests to see your performance metrics
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-white">
                    {analytics?.mcqPerformance?.totalMCQsTaken || 0}
                  </div>
                  <p className="text-gray-400">MCQs Completed</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-pink-400">
                      {analytics?.mcqPerformance?.successRate || 0}%
                    </div>
                    <p className="text-gray-400 text-sm">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">
                      {analytics?.mcqPerformance?.avgTimePerMCQMinutes || 0}m
                    </div>
                    <p className="text-gray-400 text-sm">Avg Time</p>
                  </div>
                </div>
                {(analytics?.mcqPerformance?.totalMCQsTaken ?? 0) > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">
                        {analytics?.mcqPerformance?.totalCorrectAnswers || 0} correct out of {analytics?.mcqPerformance?.totalQuestionsAnswered || 0} questions
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}