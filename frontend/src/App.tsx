import { Helmet } from 'react-helmet';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import './css/homepage.css';



function HomePage() {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Searching for ${search}`);
    };

    return (
        <div>
            <div className='header'>
                <h1>Foodie Finder</h1>
                {/* <p>Find the best food in town!</p> */}
            </div>
            <div className="gif">
                <img src="https://tenor.com/view/food-foodie-hungry-gif-533923900697883794.gif" alt="Foodie Finder" />
            </div>

            <div className="search">
                <input
                    type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button type="button" onClick={handleSearchSubmit}>Search</button>
            </div>
            <div className="link-container">
                <Link to="/pages/login">Login</Link>
                <Link to="/pages/register">Register</Link>
                <Link to="/pages/about">About</Link>
            </div>
        </div>
    );
}

        

export default function App() {
    const handleLogin = (username: string, role: string) => {
        console.log(`Logged in as ${username} with role ${role}`);
    };
    return (
        <BrowserRouter>
            <Helmet>
                <title>FoodieFinder</title>
            </Helmet>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/pages/register" element={<Register />} />
                <Route path="/pages/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}
