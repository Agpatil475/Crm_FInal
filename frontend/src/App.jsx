// /frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Contacts from "./pages/Contacts";
import CustomProperties from "./pages/CustomProperties";
import Settings from "./pages/settings/Settings";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/contacts"
          element={
            <AppLayout>
              <Contacts />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
        <Route
          path="/custom-properties"
          element={
            <AppLayout>
              <CustomProperties />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
