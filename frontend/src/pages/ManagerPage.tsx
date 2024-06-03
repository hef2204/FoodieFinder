import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


interface Restaurant {
    id: number;
    name: string;
    
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

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        localStorage.setItem('restaurantId', event.target.value);
        localStorage.setItem('restaurantName', event.target.selectedOptions[0].text);
        const selectedId = event.target.value;
        setSelectedRestaurantId(selectedId);
        navigate(`/restaurant/${selectedId}`);
    };
    
    <select onChange={handleSelectChange}>
        {restaurantList.map(restaurant => (
            <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
        ))}
    </select>




    
    return (
        <div>
            <h1>Manager Page</h1>
            <p>Welcome, {managerUsername}!</p>
            <p>You are managing:</p>
            <select onChange={handleSelectChange} value={selectedRestaurantId}>
                <option value="">Select a restaurant</option>
                {restaurantList.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                ))}
            </select>
            <div>
                <button onClick={() => navigate("/pages/AddRestaurant")}>Add Restaurant</button>
            </div>
            <div>
                <button onClick={() => navigate("/pages/AddManager")}>Add Manager</button>
            </div>
            <div className='logout admin'>
                <button onClick={() => {
                    localStorage.clear();
                    navigate('/');
                }}>Logout</button>
            </div>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>

        </div>
    );
}

export default ManagerPage;
