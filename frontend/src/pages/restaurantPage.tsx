import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import "../css/restaurantPage.css";

// Define the type for the Restaurant object
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

const RestaurantPage = () => {
    // State to store the fetched restaurants
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // Specify the type explicitly

    // State to store the applied filters (location and type)
    const [filters, setFilters] = useState({ location: '', type: '' });

    // State to toggle the filter options dropdown menu
    const [showFilterOptions, setShowFilterOptions] = useState(false);

    // Effect to fetch restaurants initially and on filter change
    useEffect(() => {
        // Function to fetch restaurants based on applied filters
        const fetchRestaurants = () => {
            // Construct URL with query parameters based on applied filters
            const url = `http://localhost:5000/restaurants?location=${filters.location}&type=${filters.type}`;
            
            // Fetch restaurants data
            fetch(url)
                .then(response => response.json())
                .then(data => setRestaurants(data.restaurants))
                .catch(error => console.error('Error:', error));
        };

        // Call fetchRestaurants to fetch restaurants initially and on filter change
        fetchRestaurants();
    }, [filters]); // Include filters in the dependency array

    // Function to handle changes in filter select options
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Update the filter state based on user selection
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    return (
        <div>
            <h1>Restaurants</h1>
            {/* Filter icon that toggles the filter options dropdown menu */}
            <div className="filter-icon" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                <FontAwesomeIcon icon={faFilter} />
            </div>
            {/* Filter options dropdown menu */}
            {showFilterOptions && (
                <div className="filter-options">
                    <select name="location" value={filters.location} onChange={handleFilterChange}>
                        <option value="">Filter by location</option>
                        {/* Add options for locations */}
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                        <option value="Chicago">Haifa</option>
                        {/* Add more options as needed */}
                    </select>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">Filter by type of food</option>
                        {/* Add options for types of food */}
                        <option value="Italian">Italian</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Japanese">Japanese</option>
                        {/* Add more options as needed */}
                    </select>
                </div>
            )}
            {/* Table to display restaurants */}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Phone Number</th>
                        <th>Type</th>
                        {/* Add more table headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {/* Map through the fetched restaurants and display them */}
                    {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                            <td>
                                {/* Link to individual restaurant page */}
                                <Link to={`/restaurant/${restaurant.id}`}>
                                    {restaurant.name}
                                </Link>
                            </td>
                            <td>{restaurant.location}</td>
                            <td>{restaurant.phone_number}</td>
                            <td>{restaurant.type}</td>
                            {/* Add more table cells as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RestaurantPage;
