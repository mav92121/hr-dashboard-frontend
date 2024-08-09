import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import HRDashboard from "./pages/HRDashboard";
import NewHireDashboard from "./pages/NewHireDashboard";
import { Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data, "res");
        setUser(res.data);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = (token) => {
    axios
      .get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      });
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/hr-dashboard"
          element={
            user?.role === "hr" ? (
              <HRDashboard user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/new-hire-dashboard"
          element={
            user?.role === "hire" ? (
              <NewHireDashboard user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/"
          element={
            <Navigate
              to={user?.role === "hr" ? "/hr-dashboard" : "/new-hire-dashboard"}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
