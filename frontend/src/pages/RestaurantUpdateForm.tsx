import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/RestuarantUpdateForm.css';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    phone_number: string;
    type: string;
    Kosher: string;
    order_table: string;
    availability: string;
    menu: Array<{ name: string, description: string, price: number }>;
}

interface MenuItem {
    name: string;
    description: string;
    price: number;
}

const UpdateRestaurantPage = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [newMenuItem, setNewMenuItem] = useState<MenuItem>({ name: '', description: '', price: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant_page/${id}`)
            .then(response => response.json())
            .then(data => setRestaurant(data.restaurant))
            .catch(error => console.error('Error:', error));
    }, [id]);

    const handleUpdateRestaurant = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch(`http://localhost:5000/restaurant_page/${id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(restaurant)
        })
        .then(() => navigate(`/restaurant/${id}`))
        .catch(error => console.error('Error:', error));
    };

    const handleAddMenuItem = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (restaurant) {
            setRestaurant({
                ...restaurant,
                menu: [...restaurant.menu, newMenuItem]
            });

            setNewMenuItem({ name: '', description: '', price: 0 });
        }
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div className='handleUpdateRestaurant'>
            <form onSubmit={handleUpdateRestaurant}>
                <label>
                    Name:
                    <input type="text" value={restaurant.name} onChange={e => setRestaurant({...restaurant, name: e.target.value})} />
                </label>
                <label>
                    Location:
                    <input type="text" value={restaurant.location} onChange={e => setRestaurant({...restaurant, location: e.target.value})} />
                </label>
                <label>
                    Phone Number:
                    <input type="text" value={restaurant.phone_number} onChange={e => setRestaurant({...restaurant, phone_number: e.target.value})} />
                </label>
                <label>
                    Type:
                    <input type="text" value={restaurant.type} onChange={e => setRestaurant({...restaurant, type: e.target.value})} />
                </label>
                <label>
                    Kosher:
                    <input type="text" value={restaurant.Kosher} onChange={e => setRestaurant({...restaurant, Kosher: e.target.value})} />
                </label>
                <label>
                    Order Table:
                    <input type="text" value={restaurant.order_table} onChange={e => setRestaurant({...restaurant, order_table: e.target.value})} />
                </label>
                <label>
                    Availability:
                    <input type="text" value={restaurant.availability} onChange={e => setRestaurant({...restaurant, availability: e.target.value})} />
                </label>
                
                <button type="submit">Update</button>
            </form>
        
            <form onSubmit={handleAddMenuItem}>
                <label>
                    Name:
                    <input type="text" value={newMenuItem.name} onChange={e => setNewMenuItem({...newMenuItem, name: e.target.value})} />
                </label>
                <label>
                    Description:
                    <input type="text" value={newMenuItem.description} onChange={e => setNewMenuItem({...newMenuItem, description: e.target.value})} />
                </label>
                <label>
                    Price:
                    <input type="number" value={newMenuItem.price} onChange={e => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})} />
                </label>
                <button type="submit">Add Menu Item</button>
         </form>
        </div>
    
    );
};

export default UpdateRestaurantPage;