import Landing from "@/pages/landing/Landing"
import { Route, Routes } from "react-router-dom"
import  Dashboard  from "@/pages/home/dashboard/Dashboard"
import Features from "@/pages/landing/features/Features"
import Pricing from "@/pages/landing/pricing/Pricing"
import Faq from "@/pages/landing/faq/Faq"
import Login from "@/pages/home/login/Login"
import Register from "@/pages/home/registration/Registration"
import Auth from "@/pages/home/auth/AuthSplit"

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/features" element={<Features/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/faq" element={<Faq/>}/>
        <Route path="/contact" element={<Features/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/registration" element={<Register/>}/>
        <Route path="/auth" element={<Auth/>}/>
    </Routes>
  )
}

export default AppRoutes
