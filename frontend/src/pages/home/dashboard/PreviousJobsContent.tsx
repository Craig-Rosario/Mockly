import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Calendar, TrendingUp, Eye, Filter } from "lucide-react"
import { motion } from "framer-motion"

interface PreviousJob {
  id: string
  title: string
  company: string
  location: string
  appliedDate: string
  status: 'applied' | 'interview' | 'rejected' | 'offer' | 'accepted'
  matchScore: number
}

const mockPreviousJobs: PreviousJob[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    appliedDate: '2024-01-15',
    status: 'interview',
    matchScore: 92
  },
  {
    id: '2',
    title: 'React Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    appliedDate: '2024-01-14',
    status: 'offer',
    matchScore: 85
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'MegaCorp',
    location: 'New York, NY',
    appliedDate: '2024-01-13',
    status: 'rejected',
    matchScore: 78
  },
  {
    id: '4',
    title: 'Software Engineer',
    company: 'InnovateLab',
    location: 'Austin, TX',
    appliedDate: '2024-01-12',
    status: 'applied',
    matchScore: 88
  },
  {
    id: '5',
    title: 'Frontend Developer',
    company: 'DesignStudio',
    location: 'Los Angeles, CA',
    appliedDate: '2024-01-11',
    status: 'accepted',
    matchScore: 95
  }
]

export function PreviousJobsContent() {
  const getStatusBadge = (status: PreviousJob['status']) => {
    const statusConfig = {
      applied: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Applied' },
      interview: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Interview' },
      rejected: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Rejected' },
      offer: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Offer' },
      accepted: { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Accepted' }
    }
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Previous Jobs</h1>
            <p className="text-gray-400 mt-2">Track your application history and progress</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-gray-300 bg-gray-700">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: '24', color: 'bg-blue-500' },
            { label: 'Interviews', value: '8', color: 'bg-yellow-500' },
            { label: 'Offers', value: '3', color: 'bg-green-500' },
            { label: 'Accepted', value: '1', color: 'bg-purple-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Application History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPreviousJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Match Score</p>
                        <p className={`text-lg font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                          {job.matchScore}%
                        </p>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-3 border-t border-gray-600">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 border-gray-600 text-gray-300 bg-gray-600">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
