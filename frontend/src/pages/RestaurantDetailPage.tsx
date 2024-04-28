import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    phone_number: string;
    type: string;
    Kosher: string;
    order_table: string;
    availability: string;
    menu: Array<{ name: string, description: string, price: number }>;
    
}

interface MenuItem {
    name: string;
    description: string;
    price: number;
}

interface User {
    role: string;
    restaurantId: number;
}


const RestaurantDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant_page/${id}`)
            .then(response => response.json())
            .then(data => {
                setRestaurant(data.restaurant);
                setMenu(data.menu);
                setUser(data.user);
                        
             }) // Assuming the data is an object with a 'restaurant' property
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    if (user && user.role === 'manager') {
        navigate(`/pages/managerPage/${user.restaurantId}`);
    }

    return (
        <div className="restaurant-detail">
            <h1>{restaurant.name}</h1>
            <p>Location: {restaurant.location}</p>
            <p>Phone Number: {restaurant.phone_number}</p>
            <p>Type: {restaurant.type}</p>
            <p>Kosher: {restaurant.Kosher ? 'Yes' : 'No'}</p>
            <p>Order Table: {restaurant.order_table}</p>
            <p>Availability: {restaurant.availability}</p>
            
            <Tabs defaultActiveKey="menu">
                <Tab eventKey="menu" title="Menu">
                    <table>
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
                </Tab>
            </Tabs>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>
        </div>
    );
}

export default RestaurantDetailPage;