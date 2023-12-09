"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/register.css";
import "../styles/index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterGateway: React.FC = () => {
  const [values, setValues] = useState({
    serialNumber: "",
    name: "",
    ipAddress: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Registration successful");
        setValid(true);
        // Redirect to the home page after successful registration
      } else {
        // Display a generic error message if registration fails
        toast.error("Registration failed");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error during registration:", error);
      // Display a generic error message if an unexpected error occurs
      toast.error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="register-container">
        <div className="form-container">
          <Link to="/" className="home-link" >
            Back to Home
          </Link>
          <form className="register-form" onSubmit={handleSubmit}>
            {isLoading && <p>Loading...</p>}
            {submitted && valid && (
              <div className="success-message">
                <h3> Welcome {values.name} </h3>
                <div> Your registration was successful! </div>
              </div>
            )}
            {/* Remove error handling */}
            {!valid && (
              <input
                className="form-field"
                type="text"
                placeholder="Serial Number"
                name="serialNumber"
                value={values.serialNumber}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.serialNumber && (
              <span id="serial-number-error">Please enter a serial number</span>
            )}
            {!valid && (
              <input
                className="form-field"
                type="text"
                placeholder="Name"
                name="name"
                value={values.name}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.name && (
              <span id="name-error">Please enter a name</span>
            )}
            {!valid && (
              <input
                className="form-field"
                type="text"
                placeholder="IPv4 address"
                name="ipAddress"
                value={values.ipAddress}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.ipAddress && (
              <span id="ip-address-error">Please enter a valid IP address</span>
            )}
            {!valid && (
              <button className="form-field" type="submit">
                Register a gateway
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterGateway;
