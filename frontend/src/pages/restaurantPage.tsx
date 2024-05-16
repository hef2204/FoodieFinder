import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../css/restaurantPage.css";

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
}

const RestaurantPage = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filters, setFilters] = useState({ location: '', type: '' });
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const userRole = localStorage.getItem('role');


    useEffect(() => {
        const fetchRestaurants = () => {
            const url = `http://localhost:5000/restaurants?location=${filters.location}&type=${filters.type}`;
            fetch(url)
                .then(response => response.json())
                .then(data => setRestaurants(data.restaurants))
                .catch(error => console.error('Error:', error));
        };

        fetchRestaurants();
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const handleLinkClick = (id: number) => {
        localStorage.setItem('restaurantId', id.toString());
        localStorage.setItem('restaurantName', restaurants.find(restaurant => restaurant.id === id)?.name || '');
    };

    const handleRemoveRestaurant = (id: number, name: string) => {
        if (window.confirm('Are you sure you want to remove this restaurant?'))
        fetch('http://localhost:5000/admin/delete_restaurant', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            setRestaurants(prevRestaurants => prevRestaurants.filter(restaurant => restaurant.id !== id));
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Restaurants</h1>
            <div className="filter-icon" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                <FontAwesomeIcon icon={faFilter} />
            </div>
            {showFilterOptions && (
                <div className="filter-options">
                    <select name="location" value={filters.location} onChange={handleFilterChange}>
                        <option value="">Filter by location</option>
                        <option value="Tel Aviv">Tel Aviv</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                        <option value="Haifa">Haifa</option>
                    </select>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">Filter by type of food</option>
                        <option value="Italian">Italian</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Japanese">Japanese</option>
                    </select>
                </div>
            )}
            
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Phone Number</th>
                        <th>Type</th>
                        {userRole === 'admin' && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                            <td>
                                <Link to={`/restaurant/${restaurant.id}`} onClick={() => handleLinkClick(restaurant.id)}>
                                    {restaurant.name}
                                </Link>
                            </td>
                            <td>{restaurant.location}</td>
                            <td>{restaurant.phone_number}</td>
                            <td>{restaurant.type}</td>
                            {userRole === 'admin' && (
                                <td>
                                    <button onClick={() => handleRemoveRestaurant(restaurant.id, restaurant.name)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="Back-button" onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default RestaurantPage;
