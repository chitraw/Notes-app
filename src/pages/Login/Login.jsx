import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Password from "../../components/Password";
import axiosinstance from "../../utils/axiosinstance";
import { Link } from "react-router-dom"; // Adjust the path as necessary

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosinstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data) {
        console.log(response);
        localStorage.setItem("token", response.data.accessToken);
        navigate("/"); // Redirect to dashboard or appropriate page
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Login
            </button>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <p className="text-sm text-center mt-4">
              Not Registered Yet?{" "}
              <Link
                to="/SignUp"
                className="font-medium text-blue-500 underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
