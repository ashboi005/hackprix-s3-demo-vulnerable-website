import DashboardLayout from "../layouts/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Total Patients</h2>
          <h1>120</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Total Doctors</h2>
          <h1>18</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Medical Records</h2>
          <h1>843</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Reports Uploaded</h2>
          <h1>521</h1>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>System Overview</h2>

        <p>
          Healthcare management platform is currently operational.
        </p>

        <p>
          All patient records and reports are accessible through the system.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;