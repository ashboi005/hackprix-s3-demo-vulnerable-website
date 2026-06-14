import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { patientApi, reportApi, systemApi } from "../services/api";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [pingResult, setPingResult] = useState("");
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    patientApi.list().then((response) => setPatients(response.data.filter((patient) => patient.role === "patient")));
  }, []);

  const handlePing = async (e) => {
    e.preventDefault();
    const host = e.target.host.value;
    try {
      const response = await reportApi.ping(host);
      setPingResult(response.data.output);
    } catch (err) {
      setPingResult("Error: " + err.message);
    }
  };

  const handleReadFile = async (e) => {
    e.preventDefault();
    const filename = e.target.filename.value;
    try {
      const response = await systemApi.debug();
      setFileContent("Use the Admin Dashboard for file access");
    } catch (err) {
      setFileContent("Error: " + err.message);
    }
  };

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

      <div className="stack-card" style={{ marginTop: 18 }}>
        <h2>Network Tools</h2>
        <form onSubmit={handlePing}>
          <input name="host" placeholder="Host to ping (e.g., 8.8.8.8)" />
          <button type="submit">Ping</button>
        </form>
        {pingResult && <pre style={{ background: "#f5f5f5", padding: 10, marginTop: 10 }}>{pingResult}</pre>}
      </div>

      <div className="stack-card" style={{ marginTop: 18 }}>
        <h2>Report Access</h2>
        <form onSubmit={handleReadFile}>
          <input name="filename" placeholder="Report filename" />
          <button type="submit">Load</button>
        </form>
        {fileContent && <pre style={{ background: "#f5f5f5", padding: 10, marginTop: 10 }}>{fileContent}</pre>}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
