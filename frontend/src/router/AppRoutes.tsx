import Landing from "@/pages/landing/Landing"
import { Route, Routes } from "react-router-dom"
import Dashboard from "@/pages/home/dashboard/Dashboard"
import Features from "@/pages/landing/features/Features"
import Pricing from "@/pages/landing/pricing/Pricing"
import Faq from "@/pages/landing/faq/Faq"
import PersonalDetails from "@/pages/home/dashboard/add-jobs/PersonalDetails"
import JobDetails from "@/pages/home/dashboard/add-jobs/JobDetails"
import ResumeAnalysis from "@/pages/home/dashboard/add-jobs/ResumeAnalysis"
import Mcq from "@/pages/home/dashboard/add-jobs/Mcq"
import McqAnalysis from "@/pages/home/dashboard/add-jobs/McqAnalysis"
import FinalReport from "@/pages/home/dashboard/add-jobs/FinalReport"
import MockInterviewAnalysis from "@/pages/home/dashboard/add-jobs/MockInterviewAnalysis"
import MockInterview from "@/pages/home/dashboard/add-jobs/MockInterview"
import LoginPage from "@/pages/home/login/LoginPage"
import RegistrationPage from "@/pages/home/registration/RegistrationPage"


const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contact" element={<Features />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Login Pages */}
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Add Jobs Page */}
      <Route path="/add-jobs/personal-details" element={<PersonalDetails/>}/>
      <Route path="/add-jobs/job-details" element={<JobDetails/>}/>
      <Route path="/add-jobs/resume-analysis" element={<ResumeAnalysis/>}/>
      <Route path="/add-jobs/mcq" element={<Mcq/>}/>
      <Route path="/add-jobs/mcq-analysis" element={<McqAnalysis/>}/>
      <Route path="/add-jobs/mock-interview" element={<MockInterview/>}/>
      <Route path="/add-jobs/mock-interview-analysis" element={<MockInterviewAnalysis/>}/>
      <Route path="/add-jobs/final-report" element={<FinalReport/>}/>
    </Routes>
  )
}

export default AppRoutes
