import DashboardLayout from "../layouts/DashboardLayout";

const DoctorDashboard = () => {
  const patients = [
    {
      id: 1,
      name: "John Smith",
      diagnosis: "Diabetes",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      diagnosis: "Hypertension",
    },
    {
      id: 3,
      name: "Michael Brown",
      diagnosis: "Asthma",
    },
  ];

  return (
    <DashboardLayout>
      <h1>Doctor Dashboard</h1>

      <div
        style={{
          marginTop: "20px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Assigned Patients</h2>

        {patients.map((patient) => (
          <div
            key={patient.id}
            style={{
              padding: "15px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h3>{patient.name}</h3>

            <p>{patient.diagnosis}</p>

            <button
              style={{
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;