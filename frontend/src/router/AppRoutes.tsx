import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import {
  Protect,
  RedirectToSignIn,
  AuthenticateWithRedirectCallback,
} from "@clerk/react-router";

// Public Pages
import Landing from "@/pages/landing/Landing";
import Features from "@/pages/landing/features/Features";
import Pricing from "@/pages/landing/pricing/Pricing";
import Faq from "@/pages/landing/faq/Faq";

// Auth Pages
import LoginPage from "@/pages/home/login/LoginPage";
import RegistrationPage from "@/pages/home/registration/RegistrationPage";

// Protected Pages
import Dashboard from "@/pages/home/dashboard/Dashboard";
import PersonalDetails from "@/pages/home/dashboard/add-jobs/PersonalDetails";
import JobDetails from "@/pages/home/dashboard/add-jobs/JobDetails";
import ResumeAnalysis from "@/pages/home/dashboard/add-jobs/ResumeAnalysis";
import Mcq from "@/pages/home/dashboard/add-jobs/Mcq";
import McqAnalysis from "@/pages/home/dashboard/add-jobs/McqAnalysis";
import FinalReport from "@/pages/home/dashboard/add-jobs/FinalReport";
import MockInterview from "@/pages/home/dashboard/add-jobs/MockInterview";
import MockInterviewAnalysis from "@/pages/home/dashboard/add-jobs/MockInterviewAnalysis";

const AppRoutes = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contact" element={<Features />} />

      {/* auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />

      {/* clerk oauth through */}
      <Route
        path="/login/sso-callback"
        element={<AuthenticateWithRedirectCallback />}
      />
      <Route
        path="/registration/sso-callback"
        element={<AuthenticateWithRedirectCallback />}
      />
      <Route
        path="/login/verify-email-address"
        element={<Navigate to="/registration/verify-email-address" replace />}
      />

      <Route
        path="/registration/verify-email-address"
        element={<AuthenticateWithRedirectCallback />}
      />


      {/* protected routes */}
      <Route
        path="/dashboard"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <Dashboard />
          </Protect>
        }
      />

      {/* add job routes*/}
      <Route
        path="/add-jobs/personal-details"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <PersonalDetails />
          </Protect>
        }
      />
      <Route
        path="/add-jobs/job-details"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <JobDetails />
          </Protect>
        }
      />
      <Route
        path="/add-jobs/resume-analysis"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <ResumeAnalysis />
          </Protect>
        }
      />
      <Route
        path="/add-jobs/mcq"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <Mcq />
          </Protect>
        }
      />
      <Route
        path="/add-jobs/mcq-analysis"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <McqAnalysis />
          </Protect>
        }
      />
      <Route
        path="/add-jobs/mock-interview"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <MockInterview />
          </Protect>
        }
      />
      <Route
        path="/add-jobs/mock-interview-analysis"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <MockInterviewAnalysis />
          </Protect>
        }
      />
      <Route
        path="/add-jobs/final-report"
        element={
          <Protect fallback={<RedirectToSignIn redirectUrl="/login" />}>
            <FinalReport />
          </Protect>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
