import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1
        style={{
          marginBottom: "25px",
        }}
      >
        Patient Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
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
          <h3>Patient Profile</h3>
          <p>Name: John Smith</p>
          <p>Age: 42</p>
          <p>Blood Group: O+</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Current Diagnosis</h3>
          <p>Type 2 Diabetes</p>
          <p>Status: Stable</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Next Appointment</h3>
          <p>18 June 2026</p>
          <p>Dr. Brown</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Recent Report</h3>
          <p>Blood Test Report</p>
          <p>Uploaded: 10 June 2026</p>
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
        <h2>Health Summary</h2>

        <p>
          Patient is currently undergoing treatment for Type 2 Diabetes.
          Regular monitoring and medication are advised.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;