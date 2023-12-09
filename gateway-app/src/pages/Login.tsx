
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import "../styles/index.css";

export default function RegisterGateway() {
  const [values, setValues] = useState({
    serialNumber: "",
    uid: "",
    vendor: "",
  });

  const handleInputChange = (event: {
    preventDefault: () => void;
    target: { name: string; value: string };
  }) => {
    event.preventDefault();

    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (values.serialNumber && values.uid && values.vendor) {
      setValid(true);
    }
    setSubmitted(true);
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <Link to="/" className="home-link">
          Back to Home
        </Link>
        <form className="register-form" onSubmit={handleSubmit}>
          {submitted && valid && (
            <div className="success-message">
              <h3>
                {values.uid} and {values.vendor}{" "}
              </h3>
              <div> Your operation is successful! </div>
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
            <button className="form-field" type="submit">
              Add Devices
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
