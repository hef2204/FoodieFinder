
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../css/adminPage.css';

function AdminPage() {
    const { user, loading } = useUser();
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
                        navigate('/login'); // Redirect to login if unauthorized
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

    // Ensure user is fully loaded and has the correct role
    if (!user || !user.role) {
        return <div>Loading user data...</div>;
    }

    if (!user || user.role !== 'admin') {
        console.log('Unauthorized');
        console.log(user);
        
        return (
            <div>
                <h1>Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
                <button className="button" onClick={() => {navigate(-1)}}>back</button>
            </div>
        );
    }

    if (!adminData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <nav>
            <ul className='navbar1'>
                
                <li className="dropdown">
                    <span className="active-linkAdmin">Menu</span>
                    <div className="dropdown-content">
                        <NavLink to="/pages/users">Manage Users</NavLink>
                        <NavLink to="/pages/ManagersTable">Manage managers</NavLink>
                        <NavLink to="/pages/restaurantPage">restaurants</NavLink>
                        <NavLink to="/pages/add_manager_restaurant">Add Manager and Restaurant</NavLink>
                        <NavLink to="/pages/AddAdmin">Add Admin</NavLink>
                       
                    </div>
                </li>
                <div>
                <button className="LogoutAdmin" onClick={() => {localStorage.clear(); window.location.href = '/';}}>Logout</button>
                </div>
            </ul>
            </nav>
        </div>
    );
}




export default AdminPage;