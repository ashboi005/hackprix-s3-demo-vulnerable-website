import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Medical Records",
      path: "/records",
    },
    {
      name: "Reports",
      path: "/reports",
    },
    {
      name: "Doctor Panel",
      path: "/doctor",
    },
    {
      name: "Admin Panel",
      path: "/admin",
    },
  ];

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#1e293b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        MediVault
      </h2>

      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: "block",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "white",
            backgroundColor:
              location.pathname === item.path
                ? "#2563eb"
                : "transparent",
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;