
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"; 
import Header from "../components/header";


const UserList: React.FC = () => {
 
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  
  interface User {
    id: number;
    username: string;
    email: string;
    
  }

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch("your_backend_api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []); 

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
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
            <Link
              to="/login"
              className="login-button"
            >
              Get Access to Edit
            </Link>
          </div>
        </div>

        <div className="user-list">
          <h2 className="user-list-item">All Users:</h2>
          <ul className="list-none">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="cursor-pointer hover-text-blue"
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>

        {selectedUser && (
          <div className="user-details">
            <h2 className="user-list-item">User Details:</h2>
            <p>ID: {selectedUser.id}</p>
            <p>Username: {selectedUser.username}</p>
            
          </div>
        )}
      </div>
    </>
  );
};

export default UserList;
