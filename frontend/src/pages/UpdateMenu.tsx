import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    phone_number: string;
    type: string;
    Kosher: string;
    order_table: string;
    availability: string;
    menu: Array<{ name: string, description: string, price: string }>;
}

const UpdateMenu: React.FC = () => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    
        
    
    useEffect(() => {
        const restaurantId = localStorage.getItem('restaurantId'); 
        
        fetch(`http://localhost:5000/restaurant_page/${restaurantId}`)
            .then(response => response.json())
            .then(data => {
                if (data.restaurant) {
                    setRestaurant(data.restaurant);
                } else {
                    console.error('Restaurant data not found');
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleAddMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!restaurant || !restaurant.id) {
            alert('Restaurant data is not loaded yet');
            return;
        }
    
        const response = await fetch(`http://localhost:5000/restaurant_page/menu/${restaurant.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name, description, price })
        });
    
        const data = await response.json();
    
        if (response.ok) {
            setName('');
            setDescription('');
            setPrice('');
            alert(data.message);
            navigate(`/restaurant/${restaurant.id}`);
            console.log(data);
            
        } else {
            alert('Error: ' + data.message);
        }
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
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                    Description:
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
                </label>
                <input type="submit" value="Add Menu Item" />
            </form>
            <div className='back'>
                <button onClick={() => {
                    window.history.back();
                }}>Back</button>


            </div>
        </div>
    );
};

export default UpdateMenu;