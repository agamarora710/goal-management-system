import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/manager-dashboard"
          element={<ManagerDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App