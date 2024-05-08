import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

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

const ResultsPage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Fetch restaurant data from an API
        fetch('http://example.com/api/restaurants')
            .then(response => response.json())
            .then(data => {
                setRestaurants(data);
                setFilteredRestaurants(data); 
            })
            .catch(error => console.error('Error fetching restaurants:', error));
    }, []);

    const handleSearchChange = (searchQuery: string) => {
        setSearch(searchQuery);
        const filtered = restaurants.filter((restaurant) => {
            // Implement your filtering logic here
            return (
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.Kosher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.order_table.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.availability.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.discounts.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredRestaurants(filtered);
    };

    return (
        <div>
            <h1>Results Page</h1>
            <SearchBar onSearchChange={handleSearchChange} />
            {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id}>
                    <h2>{restaurant.name}</h2>
                    <p>Location: {restaurant.location}</p>
                    <p>phone number: {restaurant.phone_number}</p>
                    <p>Type: {restaurant.type}</p>
                    <p>Kosher: {restaurant.Kosher}</p>
                    <p>Order Table: {restaurant.order_table}</p>
                    <p>Availability: {restaurant.availability}</p>
                    <p>Discounts: {restaurant.discounts}</p>
                </div>
            ))}
        </div>
    );
};

export default ResultsPage;
