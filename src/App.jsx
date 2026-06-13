import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Reports from "./pages/Reports";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/records" element={<Records />} />
      <Route path="/reports" element={<Reports />} />

      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;