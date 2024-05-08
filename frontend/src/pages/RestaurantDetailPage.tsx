import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import '../css/RestaurantDetailPage.css';

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

const RestaurantDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [managerName, setManagerName] = useState<string | null>(null);
    const navigate = useNavigate();
    const [, setUser] = useState<{ username: string, role: string } | null>(null);
    const [activeTab, setActiveTab] = useState<string>('menu');

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);

    useEffect(() => {
        const managerName = localStorage.getItem('managerName');
        setManagerName(managerName);
    }, []);

    const handleUpdateRestaurant = () => {
        window.location.href = `/restaurant/${id}/update`;
    };

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant_page/${id}`)
            .then(response => response.json())
            .then(data => {
                setRestaurant(data.restaurant);
                setMenu(data.menu);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    const handleTabChange = (key: string | null) => {
        setActiveTab(key === activeTab ? null : key);
    };
    
    
    
    
    
    return (
        <div className="restaurant-detail1">
            <div className="buttons-container">
                {userRole === 'manager' && (
                    <>
                        <div className='updateRestaurant'>
                            <button onClick={() => {
                            if (id) {
                                navigate(`/restaurant/${id}/update`);
                            } else {
                                console.error('Restaurant id is not defined');
                            }
                        }}>Update Restaurant</button>
                        </div>
                        <div>
                            <button onClick={() => {
                                if (id) {
                                    navigate(`/restaurant/:id/menu`)
                                } else {
                                    console.error('Restaurant id is not defined');
                                }
                            }}>Add to Menu</button>
                            <button onClick={() => {
                                localStorage.clear();
                                setUser(null);
                                navigate("/")
                            }}>Logout</button>
                            
                        </div>
                    </>
                )}
            </div>
            <h1>{restaurant.name}</h1>
            {userRole === 'manager' && <h2>Welcome, {managerName}!</h2>}
            <p>Location: {restaurant.location}</p>
            <p>Phone Number: {restaurant.phone_number}</p>
            <p>Type: {restaurant.type}</p>
            <p>Kosher: {restaurant.Kosher ? 'Yes' : 'No'}</p>
            <p>Order Table: {restaurant.order_table}</p>
            <p>Availability: {restaurant.availability}</p>
            <Tabs activeKey={activeTab} onSelect={handleTabChange}>
                <Tab eventKey="menu" title="Menu">
                    {activeTab === 'menu' && (
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
                    )}
                </Tab>
            </Tabs>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>
        </div>

    );
}

export default RestaurantDetailPage;
