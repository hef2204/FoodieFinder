import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/adminPage.css';


function AdminPage() {
    return (
        <div>
            <h1>Admin Page</h1>
            <nav>
            <ul className='navbar1'>
                
                <li className="dropdown">
                    <span className="active-link">Menu</span>
                    <div className="dropdown-content">
                        <NavLink exact to="/pages/AddManager" activeClassName="active">Add Manager</NavLink>
                        <NavLink exact to="/pages/AddRestaurant" activeClassName="active">Add Restaurant</NavLink>
                        <NavLink exact to="/pages/users" activeClassName="active">Manage Users</NavLink>
                        <NavLink exact to="/pages/managers" activeClassName="active">Manage managers</NavLink>
                        <NavLink exact to="/pages/restaurantPage" activeClassName="active">restaurants</NavLink>
                        <NavLink exact to="/pages/StatisticsPage" activeClassName="active">View Statistics</NavLink>
                    </div>
                </li>
            </ul>
            </nav>
        </div>
    );
}

export default AdminPage;