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
  lastStatusUpdate: number | null;
}

const ITEMS_PER_PAGE = 5;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [inputSerialNumber, setInputSerialNumber] = useState("");
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const fetchDataAndCache = async () => {
    try {
      const response = await fetch(
        "https://gateway-1yc2.onrender.com/getalldata"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const items = await response.json();
      
      const data = [...items].reverse();

      if (Array.isArray(data) && data.length > 0) {
        // Initialize lastStatusUpdate with the current time for each user
        const usersWithTimestamp = data.map((user: UserData) => ({
          ...user,
          lastStatusUpdate: new Date().getTime(),
          devices: user.devices.map((device: Device) => ({
            ...device,
            createdAt: new Date().toISOString(), 
          })),
        }));

        localStorage.setItem(
          "userListData",
          JSON.stringify(usersWithTimestamp)
        );
        setUsers(usersWithTimestamp);
      } else {
        console.error("API response is not the expected format:", data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchDataAndCache();
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
      // Update status to true and set the lastStatusUpdate timestamp
      const updatedUsers = users.map((currentUser) => {
        if (currentUser.serialNumber === inputSerialNumber) {
          currentUser.status = true;
          currentUser.lastStatusUpdate = new Date().getTime();
        }
        return currentUser;
      });

      setUsers(updatedUsers);
      setFoundUser(user);
      setError(null);
    } else {
      setFoundUser(null);
      setError("User not found");
    }
  };

  const closeModal = () => {
    setFoundUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
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
              onClick={clearError}
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
                  <td>{user.status ? "Online" : "Offline"}</td>
                  <td>
                    <ul>
                      {user.devices.map((device, deviceIndex) => (
                        <li key={deviceIndex}>
                          <div>
                            <span>UID: {device.uid}</span>{" "}
                            <span>Vendor: {device.vendor}</span>{" "}
                            <span>
                              Created At: {formatDate(device.createdAt)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
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
              <p>Serial Number: {foundUser.serialNumber}</p>
              <p>Created At: {formatDate(foundUser.createdAt)}</p>
              <p>Devices:</p>
              <ul>
                {foundUser.devices.map((device, deviceIndex) => (
                  <li key={deviceIndex}>
                    <div>
                      <span>UID: {device.uid}</span>
                      <span>Vendor: {device.vendor}</span>{" "}
                      <span>Created At: {formatDate(device.createdAt)}</span>
                    </div>
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


