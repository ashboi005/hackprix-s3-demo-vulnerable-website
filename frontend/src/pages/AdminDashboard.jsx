import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { appointmentApi, patientApi, recordApi, reportApi, systemApi } from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, records: 0, reports: 0, appointments: 0 });
  const [sysInfo, setSysInfo] = useState(null);
  const [evalResult, setEvalResult] = useState("");
  const [vmResult, setVmResult] = useState("");

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

  const handleSysDebug = async () => {
    try {
      const response = await systemApi.debug();
      setSysInfo(response.data);
    } catch (err) {
      setSysInfo({ error: err.message });
    }
  };

  const handleEval = async (e) => {
    e.preventDefault();
    const expr = e.target.expr.value;
    try {
      const response = await systemApi.eval(expr);
      setEvalResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setEvalResult("Error: " + err.message);
    }
  };

  const handleVmRun = async (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    try {
      const response = await systemApi.vmRun(code);
      setVmResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setVmResult("Error: " + err.message);
    }
  };

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

      <div className="stack-card" style={{ marginTop: 18 }}>
        <h2>System Debug</h2>
        <button onClick={handleSysDebug}>Load System Info</button>
        {sysInfo && (
          <pre style={{ background: "#f5f5f5", padding: 10, marginTop: 10, maxHeight: 400, overflow: "auto" }}>
            {JSON.stringify(sysInfo, null, 2)}
          </pre>
        )}
      </div>

      <div className="stack-card" style={{ marginTop: 18 }}>
        <h2>Expression Evaluator</h2>
        <form onSubmit={handleEval}>
          <input name="expr" placeholder="Enter expression (e.g., 2+2, process.env)" />
          <button type="submit">Evaluate</button>
        </form>
        {evalResult && (
          <pre style={{ background: "#f5f5f5", padding: 10, marginTop: 10, maxHeight: 200, overflow: "auto" }}>
            {evalResult}
          </pre>
        )}
      </div>

      <div className="stack-card" style={{ marginTop: 18 }}>
        <h2>VM Code Runner</h2>
        <form onSubmit={handleVmRun}>
          <textarea name="code" placeholder="Enter code (e.g., 'require(\"fs\").readFileSync(\"/etc/passwd\")')" rows={4} style={{ width: "100%" }} />
          <button type="submit">Run</button>
        </form>
        {vmResult && (
          <pre style={{ background: "#f5f5f5", padding: 10, marginTop: 10, maxHeight: 200, overflow: "auto" }}>
            {vmResult}
          </pre>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
