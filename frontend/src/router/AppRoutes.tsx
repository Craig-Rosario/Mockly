import Landing from "@/pages/landing/Landing"
import { Route, Routes } from "react-router-dom"

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Landing/>}/>
    </Routes>
  )
}

export default AppRoutes
