import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ManagerPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant/${id}`)
            .then(response => response.json())
            .then(data => setRestaurant(data.restaurant))
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="manager-page">
            <h1>{restaurant.name}</h1>
            <p>Location: {restaurant.location}</p>
            <p>Phone Number: {restaurant.phone_number}</p>
            <p>Type: {restaurant.type}</p>
            <p>Kosher: {restaurant.Kosher ? 'Yes' : 'No'}</p>
            <p>Order Table: {restaurant.order_table}</p>
            <p>Availability: {restaurant.availability}</p>
            {/* Add more restaurant details and manager-specific features here */}
        </div>
    );
};

export default ManagerPage;