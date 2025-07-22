import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'
import React from "react";
import { db } from "./firebase.jsx";
import { collection, addDoc } from "firebase/firestore";

function AppRoutes() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? 
        <Login /> : 
        <Navigate to="/dashboard" replace />
      } />
      <Route path="/dashboard/*" element={
        isAuthenticated ? 
        <Dashboard onLogout={logout} /> : 
        <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  const handleTestWrite = async () => {
    try {
      await addDoc(collection(db, "test"), { message: "Hello from React!" });
      alert("Write successful! Check your Firestore 'test' collection in Firebase Console.");
    } catch (err) {
      alert("Write failed: " + err.message);
    }
  };

  return (
    <AuthProvider>
      <AppRoutes />
      <div>
        <h1>Firebase Connection Test</h1>
        <button onClick={handleTestWrite}>Test Firestore Write</button>
      </div>
    </AuthProvider>
  )
}

export default App
