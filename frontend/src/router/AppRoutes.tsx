import Landing from "@/pages/landing/Landing"
import { Route, Routes } from "react-router-dom"
import { Dashboard } from "@/pages/home/dashboard/Dashboard"
import Features from "@/pages/landing/features/Features"
import Pricing from "@/pages/landing/pricing/Pricing"

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/features" element={<Features/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/faq" element={<Features/>}/>
        <Route path="/contact" element={<Features/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default AppRoutes
