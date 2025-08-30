import type { ReactNode } from "react"
import { Progress } from "@/components/ui/progress"

interface Step{
    icon: ReactNode,
    label: string
}

interface AppStepperProps {
  steps: Step[]
  currentStep: number 
}

const AppStepper = ({ steps, currentStep }: AppStepperProps) => {
  const percent =
    steps.length > 1 ? Math.round((currentStep / (steps.length - 1)) * 100) : 100

  return (
    <div className="rounded-lg border bg-zinc-900 p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                i === currentStep
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600"
                  : i < currentStep
                  ? "border-blue-500 text-blue-400"
                  : "border-gray-500 text-gray-500"
              }`}
            >
              {step.icon}
            </div>
            <span
              className={`mt-2 text-xs ${
                i === currentStep
                  ? "text-blue-400"
                  : i < currentStep
                  ? "text-blue-300"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <Progress value={percent} className="h-2" />
    </div>
  )
}

export default AppStepper
