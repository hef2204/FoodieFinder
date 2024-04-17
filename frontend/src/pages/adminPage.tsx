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
                    <NavLink to="/pages" activeClassName="active-link">Menu</NavLink>
                    <div className="dropdown-content">
                        <NavLink exact to="/pages/AddManager" activeClassName="active">Add Manager</NavLink>
                        <NavLink exact to="/pages/AddRestaurant" activeClassName="active">Add Restaurant</NavLink>
                        <NavLink exact to="/admin/users" activeClassName="active">Manage Users</NavLink>
                        <NavLink exact to="/admin/stats" activeClassName="active">View Statistics</NavLink>
                    </div>
                </li>
            </ul>
            </nav>
        </div>
    );
}

export default AdminPage;