import React from 'react';
import { Link } from 'react-router-dom';
import '../css/adminPage.css';


function AdminPage() {
    return (
        <div>
            <h1>Admin Page</h1>
            <nav>
                <ul>
                    <li><Link to="/admin/users">Manage Users</Link></li>
                    <li><Link to="/admin/stats">View Statistics</Link></li>
                    <li><Link to="/admin/content">Moderate Content</Link></li>
                    <li><Link to="/pages/AddManager">Add Manager</Link></li>
                    <li><Link to="/pages/AddRestaurant">Add Restaurant</Link></li>
                </ul>
            </nav>
            <main>
                <h2>Welcome, Admin!</h2>
                <p>Use the links above to navigate to different admin functions.</p>
            </main>
        </div>
    );
}

export default AdminPage;