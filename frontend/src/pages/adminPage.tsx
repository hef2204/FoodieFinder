import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext'; // Ensure this path is correct
import '../css/adminPage.css';

function AdminPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        if (!loading && user && user.role === 'admin') {
            const token = localStorage.getItem('token');
            if (token) {
                fetch('http://127.0.0.1:5000/admin/adminPage', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.status === 401) {
                        navigate('/pages/login'); // Redirect to login if unauthorized
                    }
                    return response.json();
                })
                .then(data => setAdminData(data))
                .catch(error => console.error('Error:', error));
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return (
            <div>
                <h1>Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
                <button className='back-button' onClick={() => window.history.back()}>Back</button>
            </div>
        );
    }

    if (!adminData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <nav className="AdminNavbar">
                <ul className="AdminNavbar1">
                    <li className="AdminDropdown">
                        <span className="dropdown-toggle">More</span>
                        <div className="AdminDropdown-content">
                            <NavLink
                                to="/pages/users"
                                className={({ isActive }) => (isActive ? "active-linkAdmin" : undefined)}
                            >
                                Manage Users
                            </NavLink>
                            <NavLink
                                to="/pages/ManagersTable"
                                className={({ isActive }) => (isActive ? "active-linkAdmin" : undefined)}
                            >
                                Manage Managers
                            </NavLink>
                            <NavLink
                                to="/pages/restaurantPage"
                                className={({ isActive }) => (isActive ? "active-linkAdmin" : undefined)}
                            >
                                Restaurants
                            </NavLink>
                            <NavLink
                                to="/pages/add_manager_restaurant"
                                className={({ isActive }) => (isActive ? "active-linkAdmin" : undefined)}
                            >
                                Add Manager and Restaurant
                            </NavLink>
                            <NavLink
                                to="/pages/AddAdmin"
                                className={({ isActive }) => (isActive ? "active-linkAdmin" : undefined)}
                            >
                                Add Admin
                            </NavLink>
                            <NavLink
                                to="/pages/AddManager"
                                className={({ isActive }) => (isActive ? "active-linkAdmin" : undefined)}
                            >
                                Add Manager
                            </NavLink>
                        </div>
                    </li>
                    <li>
                        <button className="LogoutAdmin" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminPage;
