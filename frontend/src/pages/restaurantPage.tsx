import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    Availability: string;
    discounts: string;
}

const RestaurantPage = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filters, setFilters] = useState({ location: '', type: '' });
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [types, setTypes] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const userRole = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurantTypes = () => {
            fetch('http://localhost:5000/restaurant/types')
                .then(response => response.json())
                .then(data => setTypes(data.types))
                .catch(error => console.error('Error:', error));
        };

        const fetchRestaurantLocations = () => {
            fetch('http://localhost:5000/restaurant/locations')
                .then(response => response.json())
                .then(data => setLocations(data.locations))
                .catch(error => console.error('Error:', error));
        };

        fetchRestaurantTypes();
        fetchRestaurantLocations();
    }, []);

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
            <h2>in order to enter a restaurant, click on the restaurant name</h2>
            <div className="filter-icon" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                <FontAwesomeIcon icon={faFilter} />
            </div>
            {showFilterOptions && (
                <div className="filter-options">
                    <select name="location" value={filters.location} onChange={handleFilterChange}>
                        <option value="">Filter by location</option>
                        {locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">Filter by type of food</option>
                        {types.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            )}
            
            <table>
                <thead>
                    <tr className='detail-of-restaurant'>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Phone Number</th>
                        <th>Type</th>
                        <th>Kosher</th>
                        <th>Order Table</th>
                        <th>Availability</th>
                        <th>Discounts</th>
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
                            <td>{restaurant.Kosher}</td>
                            <td>{restaurant.order_table}</td>
                            <td>{restaurant.Availability}</td>
                            <td>{restaurant.discounts}</td>
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
            <button className="Back-button-restaurantPage" onClick={() => navigate("/")}>Back</button>
        </div>
    );
};

export default RestaurantPage;
