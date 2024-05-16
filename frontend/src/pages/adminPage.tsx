
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../css/adminPage.css';

function AdminPage() {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetch('http://127.0.0.1:5000/admin/adminPage', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            })
            .then(response => response.json())
            .then(data => setAdminData(data))
            .catch(error => console.error('Error:', error));
        }
    }, [user, loading]);

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
                    <span className="active-link">Menu</span>
                    <div className="dropdown-content">
                        <NavLink to="/pages/users">Manage Users</NavLink>
                        <NavLink to="/pages/ManagersTable">Manage managers</NavLink>
                        <NavLink to="/pages/restaurantPage">restaurants</NavLink>
                        <NavLink to="/pages/add_manager_restaurant">Add Manager and Restaurant</NavLink>
                        <NavLink to="/pages/AddAdmin">Add Admin</NavLink>
                       
                    </div>
                </li>
                <div>
                <button className="button" onClick={() => {localStorage.clear(); window.location.href = '/';}}>Logout</button>
                </div>
            </ul>
            </nav>
        </div>
    );
}




export default AdminPage;