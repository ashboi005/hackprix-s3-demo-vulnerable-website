import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="auth-shell">
      <div className="auth-card">
      <h1>404</h1>
      <h2>Page Not Found</h2>
        <Link to="/">Go Back To Login</Link>
      </div>
    </div>
  );
};

export default NotFound;
