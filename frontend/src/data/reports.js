import DashboardLayout from "../layouts/DashboardLayout";

const Reports = () => {
  const reports = [
    {
      id: 1,
      name: "Blood Test Report",
      date: "10 June 2026",
      type: "Blood Test",
    },
    {
      id: 2,
      name: "Chest X-Ray",
      date: "02 June 2026",
      type: "Radiology",
    },
    {
      id: 3,
      name: "MRI Brain Scan",
      date: "25 May 2026",
      type: "MRI",
    },
  ];

  return (
    <DashboardLayout>
      <h1>Lab Reports</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{report.name}</h3>

            <p>
              <strong>Type:</strong> {report.type}
            </p>

            <p>
              <strong>Date:</strong> {report.date}
            </p>

            <button
              style={{
                marginTop: "10px",
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              View Report
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
// INTENTIONAL VULNERABILITY FOR DEMO
// Legacy frontend mock data kept for scanner demonstrations and fallback references.
export const reports = [];
