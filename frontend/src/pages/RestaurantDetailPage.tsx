import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/RestaurantDetailPage.css';
import { AuthContext } from '../authContext';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    phone_number: string;
    type: string;
    Kosher: string;
    order_table: string;
    opening_time: string;
    closing_time: string;
    menu: Array<{ name: string, description: string, price: number }>;
}

interface MenuItem {
    name: string;
    description: string;
    price: number;
}

const RestaurantDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [managerName, setManagerName] = useState<string | null>(null);
    const [managerId, setManagerId] = useState<number | null>(null);
    const [managerIds, setManagerIds] = useState<number[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const [, setUser] = useState<{ username: string, role: string } | null>(null);
    const context = useContext(AuthContext);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const managerId = Number(localStorage.getItem('user_id'));
        const managerName = localStorage.getItem('managerName');
        
        
        setUserRole(role);
        setManagerId(managerId);
        setManagerName(managerName);

        console.log("User role:", role);
        console.log("Manager ID from local storage:", managerId);
        console.log("Manager name from local storage:", managerName);
    }, []);

    

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant_page/${id}`)
            .then(response => response.json())
            .then(data => {
                setRestaurant(data.restaurant);
                setMenu(data.menu);
                setManagerIds(data.manager_ids);
                console.log("Fetched restaurant data:", data);
                console.log("Parsed manager IDs:", data.manager_ids);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    console.log("Restaurant data:", restaurant);
    console.log("Manager IDs in restaurant data:", managerIds);
    console.log("User role:", userRole);
    console.log("Manager ID from local storage:", managerId);

    const isManagerOfRestaurant = managerIds.includes(managerId!);
    console.log("isManagerOfRestaurant:", isManagerOfRestaurant);  // Debugging statement

    return (
        <div className="restaurant-detail1">
            <div className="buttons-container">
                {userRole === "user" && (
                    <>
                        <button className='user-profile' onClick={() => navigate(`/pages/user-profile`)}>User Profile</button>
                        <button className='make-reservation' onClick={() => navigate(`/restaurant/${id}/reservation`)}>Make a Reservation</button>
                    </>
                )}
                {userRole === 'manager' && isManagerOfRestaurant && (
                    <div className='manager-dropdown'>
                        <button onClick={toggleDropdown}>Actions</button>
                        {dropdownVisible && (
                            <div className='dropdown-menu'>
                                <button onClick={() => navigate(`/restaurant/${id}/update`)}>Update Restaurant</button>
                                <button onClick={() => navigate(`/restaurant/${id}/menu`)}>Add to Menu</button>
                                <button onClick={() => {
                                    localStorage.clear();
                                    setUser(null);
                                    context?.logout();  // Use logout function from context
                                    navigate("/");
                                }}>Logout</button>
                                <button onClick={() => navigate(`/pages/ManagerReservationPage`)}>View Reservations</button>
                            </div>                        )}
                    </div>
                )}
            </div>
            <div className='restaurant-detail2'>
                <h1>{restaurant.name}</h1>
                {userRole === 'manager' && isManagerOfRestaurant && <h2>Welcome, {managerName}!</h2>}
                <p>Location: {restaurant.location}</p>
                <p>Phone Number: {restaurant.phone_number}</p>
                <p>Type: {restaurant.type}</p>
                <p>Kosher: {restaurant.Kosher ? 'Yes' : 'No'}</p>
                <p>Order Table: {restaurant.order_table}</p>
                <p>Working Hours {restaurant.opening_time} - {restaurant.closing_time}</p>
            </div>
            <h2>Menu</h2>
            <table>
                <thead>
                    <tr className='menu'>
                        <th>name</th>
                        <th>description</th>
                        <th>price</th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map((item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='back-button' onClick={() => navigate('/pages/restaurantPage')}>Back to Restaurants</button>
        </div>
    );
}

export default RestaurantDetailPage;
