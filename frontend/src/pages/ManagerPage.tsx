import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
    id: number;
    name: string;
    // Add other properties as needed
}

const ManagerPage: React.FC = () => {
    const [managerUsername, setManagerUsername] = useState('');
    const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const storedManagerName = localStorage.getItem('managerName');
        if (storedManagerName) {
            setManagerUsername(storedManagerName);
        }
    }, []);

    useEffect(() => {
        fetch(`http://localhost:5000/manager/profilePage`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setManagerUsername(data.manager_username);
            setRestaurantList(data.restaurants);
            setSelectedRestaurantId(data.selected_restaurant_id);
        });
    }, [token]);

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        setSelectedRestaurantId(selectedId);
        navigate(`/restaurant/${selectedId}`);
    };

    return (
        <div>
            <h1>Manager Page</h1>
            <p>Welcome, {managerUsername}!</p>
            <p>You are managing:</p>
            <select onChange={handleSelect} value={selectedRestaurantId}>
                <option value="">Select a restaurant</option>
                {restaurantList.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                ))}
            </select>
            <div className='logout admin'>
                <button onClick={() => {
                    localStorage.clear();
                    navigate('/');
                }}>Logout</button>
            </div>
        </div>
    );
}

export default ManagerPage;
