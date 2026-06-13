import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { appointmentApi, patientApi, recordApi, reportApi } from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, records: 0, reports: 0, appointments: 0 });

  useEffect(() => {
    Promise.all([patientApi.list(), recordApi.list(), reportApi.list(), appointmentApi.list()]).then(
      ([patients, records, reports, appointments]) => {
        setStats({
          patients: patients.data.filter((entry) => entry.role === "patient").length,
          doctors: patients.data.filter((entry) => entry.role === "doctor").length,
          records: records.data.length,
          reports: reports.data.length,
          appointments: appointments.data.length,
        });
      },
    );
  }, []);

  return (
    <DashboardLayout>
      <h1>Admin Dashboard</h1>
      <div className="card-grid">
        <div className="metric-card"><h2>Total Patients</h2><h1>{stats.patients}</h1></div>
        <div className="metric-card"><h2>Total Doctors</h2><h1>{stats.doctors}</h1></div>
        <div className="metric-card"><h2>Medical Records</h2><h1>{stats.records}</h1></div>
        <div className="metric-card"><h2>Reports Uploaded</h2><h1>{stats.reports}</h1></div>
        <div className="metric-card"><h2>Appointments</h2><h1>{stats.appointments}</h1></div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
