import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { appointmentApi, patientApi, recordApi, reportApi } from "../services/api";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    patients: [],
    records: [],
    reports: [],
    appointments: [],
  });

  useEffect(() => {
    Promise.all([patientApi.list(), recordApi.list(), reportApi.list(), appointmentApi.list()]).then(
      ([patients, records, reports, appointments]) =>
        setSummary({
          patients: patients.data,
          records: records.data,
          reports: reports.data,
          appointments: appointments.data,
        }),
    );
  }, []);

  const latestPatient = summary.patients[0];
  const latestRecord = summary.records[0];
  const latestReport = summary.reports[0];
  const nextAppointment = summary.appointments[0];

  return (
    <DashboardLayout>
      <h1>Patient Dashboard</h1>
      <div className="card-grid">
        <div className="metric-card">
          <h3>Patient Profile</h3>
          <p>{latestPatient?.name || "Loading..."}</p>
          <p>Age: {latestPatient?.age ?? "-"}</p>
          <p>Blood Group: {latestPatient?.blood_group ?? "-"}</p>
        </div>
        <div className="metric-card">
          <h3>Current Diagnosis</h3>
          <p>{latestRecord?.diagnosis || "Loading..."}</p>
          <p>Prescription: {latestRecord?.prescription || "-"}</p>
        </div>
        <div className="metric-card">
          <h3>Next Appointment</h3>
          <p>{nextAppointment ? new Date(nextAppointment.appointment_date).toDateString() : "Loading..."}</p>
          <p>Status: {nextAppointment?.status || "-"}</p>
        </div>
        <div className="metric-card">
          <h3>Recent Report</h3>
          <p>{latestReport?.report_name || "Loading..."}</p>
          <p>Uploaded: {latestReport ? new Date(latestReport.uploaded_at).toDateString() : "-"}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
