import Landing from "@/pages/landing/Landing"
import { Route, Routes } from "react-router-dom"
import { Dashboard } from "@/pages/home/dashboard/Dashboard"

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default AppRoutes
