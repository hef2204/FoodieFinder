import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/RestaurantDetailPage.css';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    phone_number: string;
    type: string;
    Kosher: string;
    order_table: string;
    Availability: string;
    menu: Array<{ name: string, description: string, price: number }>;
    manager_id: number;
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
    const navigate = useNavigate();
    const [, setUser] = useState<{ username: string, role: string } | null>(null);
    

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        const managerId = Number(localStorage.getItem('userId'));  
        setManagerId(managerId);
    }, []);

    useEffect(() => {
        const managerName = localStorage.getItem('managerName');
        setManagerName(managerName);
    }, []);

    const handleUpdateRestaurant = () => {
        navigate(`/restaurant/${id}/update`);
    };

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant_page/${id}`)
            .then(response => response.json())
            .then(data => {
                setRestaurant(data.restaurant);
                setMenu(data.menu);
                console.log(data);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    

    return (
        <div className="restaurant-detail1">
            <div className="buttons-container">
                {userRole === "user" && (
                    <>
                        <button className='user-profile' onClick={() => navigate(`/pages/user-profile`)}>User Profile</button>
                        <button className='make-reservation' onClick={() => navigate(`/restaurant/${id}/reservation`)}>Make a Reservation</button>
                    </>
                )}
                {userRole === 'manager' && managerId === restaurant?.manager_id && (
                    <>
                        <div className='updateRestaurant'>
                            <button onClick={handleUpdateRestaurant}>Update Restaurant</button>
                        </div>
                        <div>
                            <button onClick={() => {
                                if (id) {
                                    navigate(`/restaurant/${id}/menu`);
                                } else {
                                    console.error('Restaurant id is not defined');
                                }
                            }}>Add to Menu</button>
                            <button onClick={() => {
                                localStorage.clear();
                                setUser(null);
                                navigate("/");
                            }}>Logout</button>
                            <button className='reservation-button' onClick={() => 
                                navigate(`/pages/ManagerReservationPage`)
                            }>View Reservations</button>
                        </div>
                    </>
                )}
            </div>
            <div className='restaurant-detail2'>
                <h1>{restaurant.name}</h1>
                {userRole === 'manager' && managerId === restaurant?.manager_id && <h2>Welcome, {managerName}!</h2>}
                <p>Location: {restaurant.location}</p>
                <p>Phone Number: {restaurant.phone_number}</p>
                <p>Type: {restaurant.type}</p>
                <p>Kosher: {restaurant.Kosher ? 'Yes' : 'No'}</p>
                <p>Order Table: {restaurant.order_table}</p>
                <p>Availability: {restaurant.Availability}</p>
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
                    
                
            <button className='back-button' onClick={() => window.history.back()}>Back</button>

        </div>
    );
}

export default RestaurantDetailPage;
