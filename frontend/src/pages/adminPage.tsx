
import { NavLink } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../css/adminPage.css';


function AdminPage() {
    const { user } = useUser();

    if (!user || user.role !== 'admin') {
        console.log('Unauthorized');
        console.log(user);
        
        return (
            <div>
                <h1>Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }
    return (
        <div>
            <h1>Admin Page</h1>
            <nav>
            <ul className='navbar1'>
                
                <li className="dropdown">
                    <span className="active-link">Menu</span>
                    <div className="dropdown-content">
                        <NavLink  to="/pages/AddManager">Add Manager</NavLink>
                        <NavLink  to="/pages/AddRestaurant">Add Restaurant</NavLink>
                        <NavLink  to="/pages/users">Manage Users</NavLink>
                        <NavLink  to="/pages/ManagersTable">Manage managers</NavLink>
                        <NavLink  to="/pages/restaurantPage">restaurants</NavLink>
                        <NavLink  to="/pages/add_manager_restaurant">Add Manager and Restaurant</NavLink>
                       
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