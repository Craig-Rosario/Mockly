import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Eye, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react"
import { motion } from "framer-motion"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  appliedDate: string
  status: 'analyzing' | 'completed' | 'interview-scheduled' | 'pending'
  matchScore: number
  skillsMatched: number
  totalSkills: number
  interviewDate?: string
}

interface RecentJobAnalysisProps {
  jobs?: Job[]
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    appliedDate: '2024-01-15',
    status: 'interview-scheduled',
    matchScore: 92,
    skillsMatched: 8,
    totalSkills: 10,
    interviewDate: '2024-01-20'
  },
  {
    id: '2',
    title: 'React Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Contract',
    appliedDate: '2024-01-14',
    status: 'completed',
    matchScore: 85,
    skillsMatched: 7,
    totalSkills: 9
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'MegaCorp',
    location: 'New York, NY',
    type: 'Full-time',
    appliedDate: '2024-01-13',
    status: 'analyzing',
    matchScore: 78,
    skillsMatched: 6,
    totalSkills: 8
  }
]

export function RecentJobAnalysis({ jobs = mockJobs }: RecentJobAnalysisProps) {
  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'analyzing':
        return (
          <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
            <AlertCircle className="mr-1 h-3 w-3" />
            Analyzing
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Analysis Complete
          </Badge>
        )
      case 'interview-scheduled':
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
            <Calendar className="mr-1 h-3 w-3" />
            Interview Scheduled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          Recent Job Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                </div>
                {getStatusBadge(job.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Match Score</span>
                    <span className={`text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                      {job.matchScore}%
                    </span>
                  </div>
                  <Progress value={job.matchScore} className="h-2 border border-gray-500 bg-gray-700 [&>div]:bg-white" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Skills Match</span>
                    <span className="text-sm font-semibold text-white">
                      {job.skillsMatched}/{job.totalSkills}
                    </span>
                  </div>
                  <Progress value={(job.skillsMatched / job.totalSkills) * 100} className="h-2 border border-gray-500 bg-gray-700 [&>div]:bg-white" />
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Applied</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(job.appliedDate).toLocaleDateString()}
                    </p>
                    {job.interviewDate && (
                      <p className="text-xs text-blue-400 mt-1">
                        Interview: {new Date(job.interviewDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-600">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    {job.status === 'analyzing' ? 'Analysis in progress...' : 
                     job.status === 'interview-scheduled' ? 'Prepare for interview' :
                     'Ready for interview prep'}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 border-gray-600 text-gray-300 bg-gray-600">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Job Analysis Yet</h3>
            <p className="text-gray-400 mb-4">Add your first job to get started with AI-powered analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
