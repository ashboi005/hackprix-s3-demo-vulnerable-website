import DashboardLayout from "../layouts/DashboardLayout";

const Records = () => {
  const records = [
    {
      id: 1,
      diagnosis: "Type 2 Diabetes",
      doctor: "Dr. Brown",
      date: "10 Jun 2026",
      status: "Active",
    },
    {
      id: 2,
      diagnosis: "Hypertension",
      doctor: "Dr. Smith",
      date: "15 May 2026",
      status: "Monitoring",
    },
    {
      id: 3,
      diagnosis: "Vitamin D Deficiency",
      doctor: "Dr. Johnson",
      date: "02 Apr 2026",
      status: "Recovered",
    },
  ];

  return (
    <DashboardLayout>
      <h1>Medical Records</h1>

      <div
        style={{
          marginTop: "20px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>
                Diagnosis
              </th>

              <th style={{ padding: "12px", textAlign: "left" }}>
                Doctor
              </th>

              <th style={{ padding: "12px", textAlign: "left" }}>
                Date
              </th>

              <th style={{ padding: "12px", textAlign: "left" }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td style={{ padding: "12px" }}>
                  {record.diagnosis}
                </td>

                <td style={{ padding: "12px" }}>
                  {record.doctor}
                </td>

                <td style={{ padding: "12px" }}>
                  {record.date}
                </td>

                <td style={{ padding: "12px" }}>
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Records;
// INTENTIONAL VULNERABILITY FOR DEMO
// Legacy frontend mock data kept for scanner demonstrations and fallback references.
export const records = [];
