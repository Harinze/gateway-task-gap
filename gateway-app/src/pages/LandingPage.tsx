import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/index.css";
import Header from "../components/header";

interface Device {
  uid: number;
  vendor: string;
  createdAt: string;
}

interface UserData {
  createdAt: string;
  _id: string;
  serialNumber: string;
  name: string;
  ipAddress: string;
  status: boolean;
  devices: Device[];
  updatedAt: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [inputSerialNumber, setInputSerialNumber] = useState("");
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAndCache = async () => {
      try {
        const response = await fetch(
          "https://gateway-1yc2.onrender.com/getalldata"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("response", response);

        if (Array.isArray(data)) {
          localStorage.setItem("userListData", JSON.stringify(data));
          setUsers(data);
        } else {
          console.error("API response is not the expected format:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const intervalId = setInterval(fetchDataAndCache, 10 * 60 * 10000);

    fetchDataAndCache();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSearch = () => {
    if (!inputSerialNumber) {
      setError("Please enter a serial number.");
      return;
    }

    const storedData = localStorage.getItem("userListData");
    const usersFromLocalStorage = storedData ? JSON.parse(storedData) : [];

    const user = usersFromLocalStorage.find(
      (userData: { serialNumber: string; }) => userData.serialNumber === inputSerialNumber
    );

    if (user) {
      setFoundUser(user);
      setError(null);
    } else {
      setFoundUser(null);
      setError("User not found");
    }
  };

  const closeModal = () => {
    setFoundUser(null);
  };

  return (
    <>
      <Header />
      <div className="user-list-container">
        <div className="header-container">
          <h1 className="user-list-title">User Information</h1>
          <div className="button-container">
            <Link to="/register" className="register-button">
              Register a Gateway
            </Link>
            <Link to="/login" className="login-button">
              Add Device
            </Link>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter Serial Number"
              value={inputSerialNumber}
              onChange={(e) => setInputSerialNumber(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="user-list">
          <h2 className="user-list-item">All Users:</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>IP Address</th>
                <th>Status</th>
                <th>Devices</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.ipAddress}</td>
                  <td>
                    {user.status ? "Can't add device" : "Add more device(s)"}
                  </td>
                  <td>
                    <ul>
                      {user.devices.map((device, index) => (
                        <li key={index}>
                          UID: {device.uid}, Vendor: {device.vendor}, Created
                          At: {device.createdAt}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {foundUser && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <span className="close-btn" onClick={closeModal}>
                &times;
              </span>
              <h2>User Details</h2>
              <p>Name: {foundUser.name}</p>
              <p>IP Address: {foundUser.ipAddress}</p>
              <p>
                Status:{" "}
                {foundUser.status ? "Can't add device" : "Add more device(s)"}
              </p>
              <p>Updated At: {foundUser.updatedAt}</p>
              <p>Devices:</p>
              <ul>
                {foundUser.devices.map((device, index) => (
                  <li key={index}>
                    UID: {device.uid}, Vendor: {device.vendor}, Created At:{" "}
                    {device.createdAt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserList;
