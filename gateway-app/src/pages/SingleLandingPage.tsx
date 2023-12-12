// UserList component file

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/index.css"; // Import your CSS file
import Header from "../components/header";

interface Device {
  uid: number;
  vendor: string;
}

interface UserData {
  createdAt: string;
  _id: string;
  serialNumber: string;
  name: string;
  ipAddress: string;
  status: boolean;
  devices: Device[];
}

const ITEMS_PER_PAGE = 5; // Set the number of items per page

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [inputSerialNumber, setInputSerialNumber] = useState("");
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDataAndCache = async () => {
      try {
        const response = await fetch("http://localhost:8050/getalldata");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("Fetched data:", data);

        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem("userListData", JSON.stringify(data));
          setUsers(data);
        } else {
          console.error("API response is not the expected format:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchDataAndCache(); // Initial fetch

    const intervalId = setInterval(fetchDataAndCache, 10 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSearch = () => {
    if (!inputSerialNumber.trim()) {
      setError("Please enter a serial number");
      return;
    }

    const storedData = localStorage.getItem("userListData");
    const usersFromLocalStorage: UserData[] = storedData
      ? JSON.parse(storedData)
      : [];

    const user = usersFromLocalStorage.find(
      (userData: { serialNumber: string }) =>
        userData.serialNumber === inputSerialNumber
    );

    if (user) {
      setFoundUser(user);
      setError(null); // Clear the error when a user is found
    } else {
      setFoundUser(null);
      setError("User not found");
    }
  };

  const closeModal = () => {
    setFoundUser(null);
    setError(null); // Clear the error when closing the modal
  };

  const clearError = () => {
    setError(null); // Clear the error when clicking the input field
  };

  // Pagination functions
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
            <Link to="/adddevice" className="login-button">
              Add Device
            </Link>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter Serial Number"
              value={inputSerialNumber}
              onChange={(e) => setInputSerialNumber(e.target.value)}
              onClick={clearError} // Clear the error when clicking the input field
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="user-list">
          <h2 className="user-list-item">All Users:</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>IP Address</th>
                <th>Status</th>
                <th>Devices</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.ipAddress}</td>
                  <td>
                    {user.status ? "Can't add device" : "Add more device(s)"}
                  </td>
                  <td>
                    <ul>
                      {user.devices.map((device, deviceIndex) => (
                        <li key={deviceIndex}>
                          UID: {device.uid}, Vendor: {device.vendor}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <ul className="pagination">
            {Array.from({
              length: Math.ceil(users.length / ITEMS_PER_PAGE),
            }).map((_, index) => (
              <li
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </li>
            ))}
          </ul>
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
              <p>Created At: {foundUser.createdAt}</p>
              <p>Devices:</p>
              <ul>
                {foundUser.devices.map((device, deviceIndex) => (
                  <li key={deviceIndex}>
                    UID: {device.uid}, Vendor: {device.vendor}
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
