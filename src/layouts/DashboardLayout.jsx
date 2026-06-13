import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <main
          style={{
            padding: "25px",
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;