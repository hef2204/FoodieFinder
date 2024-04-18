import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import "../css/restaurantPage.css"

interface Restaurant {
    id: number;
    name: string;
    location: string;
    phone_number: string;
    type: string;
    Kosher: string;
    order_table: string;
    availability: string;
    discounts: string;
    
    // Add other properties as needed
}

const RestaurantPage = ({ match }: RouteComponentProps<MatchParams>) => {
    const [restaurant, setRestaurant] = useState<Restaurant[]>([]);

    useEffect(() => {
        // Fetch the restaurant data from your server
        fetch(`http://localhost:5000/restaurants`)
            .then(response => response.json())
            .then(data => setRestaurant(data.restaurants)) // Assuming the data is an object with a 'restaurants' property
            .catch(error => console.error('Error:', error));
    }, []);

    if (!restaurant.length) {
        return <div>Loading...</div>;
    }
return (
    <div className='restaurantTable'>
        <h1>Restaurants</h1>
    
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Phone Number</th>
                <th>Type</th>
                <th>Kosher</th>
                <th>Order Table</th>
                <th>Availability</th>
                <th>Discounts</th>
            </tr>
        </thead>
        <tbody>
            {restaurant.map((restaurant) => (
                <tr key={restaurant.id}>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.location}</td>
                    <td>{restaurant.phone_number}</td>
                    <td>{restaurant.type}</td>
                    <td>{restaurant.Kosher}</td>
                    <td>{restaurant.order_table}</td>
                    <td>{restaurant.availability}</td>
                    <td>{restaurant.discounts}</td>
                </tr>
            ))}
        </tbody>
    </table>
    <div className='back-button-RestaurantTable'>
        <button onClick={() => window.history.back()}>Back</button>
    </div>
    </div>
);

};

export default RestaurantPage;
