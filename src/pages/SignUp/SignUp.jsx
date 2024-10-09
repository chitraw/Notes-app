import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../../utils/axiosinstance";
function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const HandleSubmit = async () => {
    console.log("hi");
    // Check for missing inputs
    if (!name || !password || !email) {
      setError(
        !name
          ? "Please enter your name"
          : !password
          ? "Please enter your password"
          : "Please enter your email"
      );
      return;
    }

    // Clear error before attempting request
    setError("");

    try {
      // Make API request to create an account
      const response = await axiosinstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        // Store token and navigate if successful
        localStorage.setItem("token", response.data.accessToken);
        navigate("/"); // Redirect to dashboard or home page
      } else {
        setError("Account creation failed. Please try again.");
      }
    } catch (err) {
      // Handle any errors during the request
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <div class="bg-grey-lighter min-h-screen flex flex-col">
        <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 class="mb-8 text-3xl text-center">Sign up</h1>
            <input
              type="text"
              class="block border border-grey-light w-full p-3 rounded mb-4"
              name="fullname"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              class="block border border-grey-light w-full p-3 rounded mb-4"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              class="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="text-red-600">{error ? error : ""} </span>
            <button
              type="submit"
              onClick={HandleSubmit}
              class="w-full text-center py-3 rounded bg-greenhover:bg-green-dark focus:outline-none my-1">
              Create Account
            </button>
          </div>

          <div class="text-grey-dark mt-6">
            Already have an account?
            <a
              class="no-underline border-b border-blue text-blue-600"
              href="../login">
              Log in
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
