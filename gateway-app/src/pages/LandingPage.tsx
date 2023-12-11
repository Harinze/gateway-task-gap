// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "../styles/landingpage.css";
// import Header from "../components/header";

// interface Device {
//   _id: string;
//   uid: number;
//   vendor: string;
//   createdAt: string;
// }

// interface UserData {
//   createdAt: string;
//   _id: string;
//   serialNumber: string;
//   name: string;
//   ipAddress: string;
//   status: boolean;
//   devices: Device[];
//   updatedAt: string;
// }

// const UserList: React.FC = () => {
//   const [users, setUsers] = useState<UserData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:8050/getalldata");
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
 
//         if (Array.isArray(data)) {
//           setUsers(data);
//         } else {
//           console.error("API response is not the expected format:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//       <Header />
//       <div className="user-list-container">
//         <div className="header-container">
//           <h1 className="user-list-title">User Information</h1>
//           <div className="button-container">
//             <Link to="/register" className="register-button">
//               Register a Gateway
//             </Link>
//             <Link to="/login" className="login-button">
//               Add Device
//             </Link>
//           </div>
//         </div>

//         <div className="user-list">
//           <h2 className="user-list-item">All Users:</h2>
//           <table className="user-table">
//             <thead>
//               <tr>
//                 <th>Serial Number</th>
//                 <th>Name</th>
//                 <th>IP Address</th>
//                 <th>Status</th>
//                 <th>Devices</th>
//                 <th>Updated At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td>{user.serialNumber}</td>
//                   <td>{user.name}</td>
//                   <td>{user.ipAddress}</td>
//                   <td>{user.status ? "Active" : "Inactive"}</td>
//                   <td>
//                     <ul>
//                       {user.devices.map((device) => (
//                         <li key={device._id}>
//                           UID: {device.uid}, Vendor: {device.vendor}, Created
//                           At: {user.createdAt}
//                         </li>
//                       ))}
//                     </ul>
//                   </td>
//                   <td>{user.updatedAt}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserList;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/landingpage.css";
import Header from "../components/header";

interface Device {
  _id: string;
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

  useEffect(() => {
    const cachedData = localStorage.getItem("userListData");

    if (cachedData) {
      setUsers(JSON.parse(cachedData));
    } else {
      fetchData();
    }

    const clearCacheInterval = setInterval(() => {
      localStorage.removeItem("userListData");
      fetchData(); 
    }, 10 * 60 * 1000); 

    return () => clearInterval(clearCacheInterval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8050/getalldata");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

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
        </div>

        <div className="user-list">
          <h2 className="user-list-item">All Users:</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Name</th>
                <th>IP Address</th>
                <th>Status</th>
                <th>Devices</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.serialNumber}</td>
                  <td>{user.name}</td>
                  <td>{user.ipAddress}</td>
                  <td>{user.status ? "Active" : "Inactive"}</td>
                  <td>
                    <ul>
                      {user.devices.map((device) => (
                        <li key={device._id}>
                          UID: {device.uid}, Vendor: {device.vendor}, Created
                          At: {user.createdAt}
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
      </div>
    </>
  );
};

export default UserList;
