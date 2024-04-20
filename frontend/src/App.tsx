import { Helmet } from 'react-helmet';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Router } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import './css/homepage.css';
import AdminPage from './pages/adminPage.tsx'; 
import UserDashboard from './pages/UserPage.tsx';
import AddManager from './pages/AddManager';
import AddRestaurant from './pages/AddRestaurant';
// import ManagerPage from './pages/managerPage.tsx';
import ManagerPageRoute from './ManagerPage.tsx';
import StatisticsPage from './pages/StatisticsPage';
import RestaurantPage from './pages/restaurantPage.tsx';
import UsersTable from './pages/UsersTable.tsx';
import  AddManagerAndRestaurant from './pages/add_manager_restaurant.tsx';




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
                <Link to="/pages/adminPage">Admin Page</Link>
                <Link to="/pages/restaurantPage">restaurantPage</Link>
                <Link to="/pages/add_manager_restaurant">Add Manager and Restaurant</Link>
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
                    <Route path="/pages/adminPage" element={<AdminPage />} />
                    <Route path="/pages/UserPage" element={<UserDashboard />} />
                    <Route path="/pages/ManagerPage" element={<ManagerPageRoute />} />
                    <Route path="/pages/AddManager" element={<AddManager />} />
                    <Route path="/pages/AddRestaurant" element={<AddRestaurant />} />
                    <Route path="/pages/StatisticsPage" element={<StatisticsPage />} />
                    <Route path="/pages/restaurantPage" element={<RestaurantPage />} />
                    <Route path="/pages/users" element={<UsersTable />} />
                    <Route path="/pages/add_manager_restaurant" element={<AddManagerAndRestaurant />} />


                </Routes>
            </BrowserRouter>
        
    );
}
