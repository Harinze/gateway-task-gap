/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterGateway: React.FC = () => {
    const navigate = useNavigate();
  const [values, setValues] = useState({
    serialNumber: "",
    name: "",
    ipv4Address: "",
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

  const isIPv4Valid = (ip: string) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
      return ipv4Regex.test(ip);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {

      if (!values.serialNumber) {
        toast.error("Please enter a serial number");
        setIsLoading(false);
        return;
      }

      if (!values.name) {
        toast.error("Please enter a name");
        setIsLoading(false);
        return;
      }

      if (!isIPv4Valid(values.ipv4Address)) {
        toast.error("Please enter a valid IPv4 address");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        "https://gateway-1yc2.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        toast.success(`${responseData.message}`);
        setValid(true);
        setIsLoading(false);
            setTimeout(() => {
              navigate("/");
            }, 2000);
        
      } else {
        const errorData = await response.json();
        toast.error(`Registration failed: ${errorData.message}`);
      }
      setSubmitted(true);
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error(`${error.message}`);
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
          <Link to="/" className="home-link">
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
                name="ipv4Address"
                value={values.ipv4Address}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.ipv4Address && (
              <span id="ip-address-error">Please enter a valid IP address</span>
            )}
            {!valid && (
              <button className="form-field" type="submit" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register a gateway"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterGateway;
