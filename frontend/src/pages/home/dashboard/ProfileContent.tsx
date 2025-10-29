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
  Target,
  Upload,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"

interface UserData {
  _id: string
  name: string
  email: string
  clerkId: string
}

export default function ProfileContent() {
  const { getToken } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken()
        const res = await fetch("/api/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.log("Cannot fetch user:", err)
      }
    }
    fetchUser()
  }, [getToken])

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
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md">
          <Settings className="w-4 h-4" />
          <span>Edit Profile</span>
        </Button>
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
            <div className="flex-1 flex justify-between">
              <div className="pr-8">
                <h4 className="text-2xl font-semibold text-white mb-1">
                  {user?.name || "Mockly Doe"}
                </h4>
                <p className="text-purple-400 font-medium mb-2">
                  Senior Software Engineer
                </p>
                <p className="text-gray-300 mb-1">📍San Francisco, CA</p>
                <p className="text-gray-300 mb-1">
                  Email: {user?.email || "mockly.doe@email.com"}
                </p>
              </div>
              <div className="border p-4 rounded-lg w-1/3 -mt-7 mb-5 mr-10">
                <h5 className="text-white font-medium flex items-center mb-2">
                  <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                  Bio
                </h5>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Experienced software engineer with 5+ years in full-stack
                  development. Passionate about building scalable applications
                  and mentoring junior developers.
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  John_Doe_Resume.pdf
                </p>
                <p className="text-gray-400 text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-400" />
                  Last updated: 2 days ago
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="bg-gray-900 border border-gray-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Resume
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Update Resume
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center text-white text-lg">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
              Overall Resume Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Overall Score</span>
                <span className="text-green-400 font-semibold">85%</span>
              </div>
              <Progress value={85} className="[&>div]:bg-green-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Confidence Level</span>
                <span className="text-blue-400 font-semibold">78%</span>
              </div>
              <Progress value={78} className="[&>div]:bg-blue-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Completion Rate</span>
                <span className="text-purple-400 font-semibold">92%</span>
              </div>
              <Progress value={92} className="[&>div]:bg-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center text-white text-lg">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Overall AI Interview Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">127</div>
              <p className="text-gray-400">Total Attempts</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400">84%</div>
                <p className="text-gray-400 text-sm">Accuracy Rate</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">2.3 min</div>
                <p className="text-gray-400 text-sm">Avg Time</p>
              </div>
            </div>
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
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-white">Good</div>
              <p className="text-gray-400">Performance Level</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-pink-400">23</div>
                <p className="text-gray-400 text-sm">Test Result</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">76%</div>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
