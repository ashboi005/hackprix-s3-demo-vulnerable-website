import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Patients",
      path: "/patients",
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
      name: "Appointments",
      path: "/appointments",
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
    <aside className="sidebar">
      <h2>MediVault</h2>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={location.pathname === item.path ? "sidebar-link active" : "sidebar-link"}
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
