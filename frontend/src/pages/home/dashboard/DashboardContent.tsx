import { useState } from "react"
import { RecentJobAnalysis } from "./RecentJobAnalysis"
import { ProgressWidgets } from "./ProgressWidgets"
import { motion } from "framer-motion"
import {Button} from "@/components/ui/button"

interface JobData {
    id: string
    title: string
    company: string
    location: string
    salary: string
    type: string
    description: string
    skills: string[]
}

export function DashboardContent() {
    const [jobs, setJobs] = useState<JobData[]>([])

    const handleJobAdd = (newJob: JobData) => {
        setJobs(prev => [newJob, ...prev])
    }

    return (
        <div className="p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, John!
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Here's your interview preparation progress and recent activity.
                        </p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                        + Add Job
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <ProgressWidgets />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <RecentJobAnalysis />
            </motion.div>
        </div>
    )
}
