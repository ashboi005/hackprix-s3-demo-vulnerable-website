import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { patientApi } from "../services/api";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    patientApi.list().then((response) => setPatients(response.data.filter((patient) => patient.role === "patient")));
  }, []);

  return (
    <DashboardLayout>
      <h1>Doctor Dashboard</h1>
      <div className="stack-card">
        <h2>Assigned Patients</h2>
        {patients.slice(0, 10).map((patient) => (
          <div className="list-row" key={patient.id}>
            <div>
              <h3>{patient.name}</h3>
              <p>{patient.blood_group} | {patient.phone}</p>
            </div>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
