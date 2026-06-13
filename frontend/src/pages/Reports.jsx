import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { reportApi } from "../services/api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ patient_id: "", report_name: "", file: null });

  const loadReports = async () => {
    const response = await reportApi.list();
    setReports(response.data);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("patient_id", form.patient_id);
    data.append("report_name", form.report_name);
    if (form.file) {
      data.append("file", form.file);
    }
    await reportApi.create(data);
    setForm({ patient_id: "", report_name: "", file: null });
    await loadReports();
  };

  return (
    <DashboardLayout>
      <h1>Lab Reports</h1>
      <form className="stack-card" onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        <h2>Upload Report</h2>
        <input
          type="number"
          placeholder="Patient ID"
          value={form.patient_id}
          onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Report name"
          value={form.report_name}
          onChange={(e) => setForm({ ...form, report_name: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
        />
        <button type="submit">Upload</button>
      </form>

      <div className="card-grid">
        {reports.map((report) => (
          <article className="metric-card" key={report.id}>
            <h3>{report.report_name}</h3>
            <p>Path: {report.file_path}</p>
            <p>Uploaded: {new Date(report.uploaded_at).toLocaleDateString()}</p>
            <button>View Report</button>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
