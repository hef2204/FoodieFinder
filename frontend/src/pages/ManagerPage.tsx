import React, {  useEffect, useState } from 'react';


const ManagerPage: React.FC = () => {
    const [managerName, setManagerName] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const token = localStorage.getItem('token'); // Define token here

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
        if (!token) return; // Check if token exists here

        fetch(`http://localhost:5000/manager/profilePage`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Token: ${token}`);
            console.log(data);
            setManagerName(data.manager_name);
            setRestaurantName(data.restaurant_name);
        });
    }, [token]); // Add token as a dependency

    if (!token) {
        console.error('No token found');
        return null; // Return null or some fallback UI
    }

    return (
        <div>
            <h1>Manager Page</h1>
            <p>Welcome, {managerName}!</p>
            <p>You are managing: {restaurantName}</p>
            {/* Add more manager-specific functionality here... */}
        </div>
    );
}

export default ManagerPage;