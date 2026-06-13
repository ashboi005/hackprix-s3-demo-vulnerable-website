import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Register Data:", formData);

    // Later this will call backend
    navigate("/");
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
          width: "450px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Create Account</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
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
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;