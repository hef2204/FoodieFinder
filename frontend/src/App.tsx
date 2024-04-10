import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import './css/homepage.css';
import UserDashboard from './pages/userDashboard';
import ManagerDashboard from './pages/managerDashboard';
import AdminDashboard from './pages/adminDashboard';


function HomePage() {
    return (
        <div>
            <div>
                <h1>Foodie Finder</h1>
                <p>Find the best food in town!</p>
            </div>
            <div className="link-container">
                <Link to="/pages/login">Login</Link>
                <Link to="/pages/register">Register</Link>
            </div>
        </div>
    );
}
        

export default function App() {
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = async (username: string, password: string) => {
        // Send a request to the server with the username and password
        const response = await fetch('http://localhost:5000//login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        // If the login is successful, set the role based on the response
        const data = await response.json();
        setRole(data.role);
        setUsername(username);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/pages/register" element={<Register />} />
                {role === 'user' && <Route path="/pages/userDashboard" element={<UserDashboard username={username} />} />}
                {role === 'manager' && <Route path="/pages/managerDashboard" element={<ManagerDashboard username={username} />} />}
                {role === 'admin' && <Route path="/pages/adminDashboard" element={<AdminDashboard username={username} />} />}
            </Routes>
        </BrowserRouter>
    );
}
