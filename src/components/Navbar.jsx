const Navbar = () => {
  return (
    <nav
      style={{
        height: "70px",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>MediVault</h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span>John Smith</span>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#2563eb",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          J
        </div>
      </div>
    </nav>
  );
};

export default Navbar;