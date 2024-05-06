import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



interface Menu {
    id: string;
    name: string;
    // Add more properties as needed
}

interface Restaurant {
    id: string;
    name: string;
    // Add more properties as needed
}


const AddMenuItem: React.FC = () => {
    const { id } = useParams();
    const [, setMenu] = useState<Menu | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant/${id}/menu`)
            .then(response => response.json())
            .then(data => {
                setRestaurant(data.restaurant);
                setMenu(data.menu);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const handleAddMenuItem = () => {
        // Add code to add a menu item
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Add Menu Item</h1>
            <p>Restaurant: {restaurant.name}</p>
            <form onSubmit={handleAddMenuItem}>
                <label>
                    Name:
                    <input type="text" />
                </label>
                <label>
                    Description:
                    <input type="text" />
                </label>
                <label>
                    Price:
                    <input type="number" />
                </label>
                <button type="submit">Add Menu Item</button>
            </form>
        </div>
    );
}

export default AddMenuItem;