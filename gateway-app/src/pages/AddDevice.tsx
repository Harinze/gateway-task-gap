import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/adddevice.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddDevice = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    serialNumber: "",
    uid: "",
    vendor: "",
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAdding(true);

    try {
      if (values.serialNumber && values.uid && values.vendor) {
        const response = await fetch(
          "https://gateway-1yc2.onrender.com/savedevice",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              serialNumber: values.serialNumber,
              uid: values.uid,
              vendor: values.vendor,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setValid(true);
          setSubmitted(true);
          toast.success("Device added Successfully");
          setIsAdding(false);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error(`${result.message}`);
        }
      } else {
        setValid(false);
        toast.error("Please fill in all fields");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="register-container">
        <div className="form-container">
          <Link to="/" className="home-link">
            Back to Home
          </Link>
          <form className="register-form" onSubmit={handleSubmit}>
            {submitted && valid && (
              <div className="success-message">
                <h3>Your SN is {values.serialNumber} </h3>
                <div>Device details are added! </div>
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
                placeholder="UID"
                name="uid"
                value={values.uid}
                onChange={handleInputChange}
              />
            )}

            {submitted && !values.uid && (
              <span id="uid-error">Please enter a UID</span>
            )}

            {!valid && (
              <input
                className="form-field"
                type="text"
                placeholder="Vendor"
                name="vendor"
                value={values.vendor}
                onChange={handleInputChange}
              />
            )}

            {submitted && !values.vendor && (
              <span id="vendor-error">Please enter a vendor</span>
            )}
            {!valid && (
              <button className="form-field" type="submit" disabled={isAdding}>
                {isAdding ? "Adding Device..." : "Add Device"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
