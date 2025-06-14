import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/login", form);
      
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

 return (
  <div className="auth-container">
    {error && <div className="popup error">{error}</div>}
    <form className="auth-form" onSubmit={handleSubmit}>
      <center><h2 class="logo">Ratna Supermarket</h2></center>
      <h2>Login</h2>
      <input 
        type="email" 
        name="email" 
        placeholder="Email Address" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        onChange={handleChange} 
        required 
      />
      <button type="submit">Login</button>
      <p>
        Don't have an account?{" "}
        <b><u><span className="auth-link" onClick={() => navigate("/register")}>
          Register here
        </span></u></b>
      </p>
    </form>
  </div>
);

};

export default Login;