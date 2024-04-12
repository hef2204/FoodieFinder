import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';

const RegisteredUserDashboard: React.FC = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    // Fetch all restaurants from the backend
    useEffect(() => {
        fetch('/api/restaurants')
            .then(response => response.json())
            .then(data => {
                setRestaurants(data);
                setFilteredRestaurants(data);
            })
            .catch(error => {
                console.error('Error fetching restaurants:', error);
            });
    }, []);

    // Filter restaurants based on user input
    const handleFilter = (filter: string) => {
        const filtered = restaurants.filter(restaurant => {
            // Perform your filtering logic here
            // For example, if you want to filter by restaurant name:
            return restaurant.name.toLowerCase().includes(filter.toLowerCase());
        });
        setFilteredRestaurants(filtered);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Filter restaurants"
                onChange={e => handleFilter(e.target.value)}
            />
            {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
        </div>
    );
};

export default RegisteredUserDashboard;