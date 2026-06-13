import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    // Temporary navigation
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7fb",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>MediVault</h1>

        <p
          style={{
            textAlign: "center",
            color: "gray",
            marginBottom: "20px",
          }}
        >
          Healthcare Management Portal
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;