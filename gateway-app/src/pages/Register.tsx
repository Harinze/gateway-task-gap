/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/landingpage.css";
import Header from "../components/header";

interface Device {
  uid: string;
  vendor: string;
  createdAt: string;
}

interface UserData {
  devices: Device[];
  name: string;
  ipAddress: string;
  uid: string;
  vendor: string;
  createdAt: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gateway-1yc2.onrender.com/register"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Check if the data is an array
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("API response is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

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
              Get Access to Edit
            </Link>
          </div>
        </div>

        <div className="user-list">
          <h2 className="user-list-item">All Users:</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>IPv4 Address</th>
                <th>UID</th>
                <th>Vendor</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover-text-blue">
                  <td>{user.name}</td>
                  <td>{user.ipAddress}</td>
                  {user.devices.map((device, deviceIndex) => (
                    <React.Fragment key={deviceIndex}>
                      <td>{device.uid}</td>
                      <td>{device.vendor}</td>
                      <td>{device.createdAt}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserList;
