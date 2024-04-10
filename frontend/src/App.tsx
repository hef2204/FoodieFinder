import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './login';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Restaurant App!</h1>
            <p>This is the home page.</p>
            <Router>
                <div>
                    <Link to="/login">Login</Link>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default HomePage;