import React, {  useEffect, useState } from 'react';


const ManagerPage: React.FC = () => {
    const [managerName, setManagerName] = useState('');
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        const storedManagerName = localStorage.getItem('managerName');
        if (storedManagerName) {
            setManagerName(storedManagerName);
        }
    }, []);

    useEffect(() => {
        const storedRestaurantName = localStorage.getItem('restaurantName');
        if (storedRestaurantName) {
            setRestaurantName(storedRestaurantName);
        }
    }, []);
    

    

    useEffect(() => {
        fetch('http://localhost:5000/manager/profilePage')
        .then(response => response.json())
        .then(data => {
            setManagerName(data.manager_name);
            setRestaurantName(data.restaurant_name);
        });
    }, []);

    
    return (
        <div>
            <h1>Manager Page</h1>
            <p>Welcome, {managerName}!</p>
            <p>You are managing: {restaurantName}</p>
            {/* Add more manager-specific functionality here... */}
        </div>
    );
};

export default ManagerPage;