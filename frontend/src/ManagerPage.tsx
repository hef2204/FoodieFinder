import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

const ManagerPageRoute: React.FC = () => {
    const [managerName, setManagerName] = useState('');
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/manager/manager-info', { credentials: 'include'}) // replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            setManagerName(data.manager_name);
            setRestaurantName(data.restaurant_name);
        });
    });

    return (
        <div>
            <h1>Manager Page</h1>
            <p>Welcome, {managerName}!</p>
            <p>You are managing: {restaurantName}</p>
            {/* Add more manager-specific functionality here... */}
        </div>
    );
};

export default ManagerPageRoute;