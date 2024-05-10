import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/RestaurantUpdateForm.css';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    phone_number: string;
    type: string;
    Kosher: string;
    order_table: string;
    Availability: string;
    
}



const UpdateRestaurantPage = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant_page/${id}`)
            .then(response => response.json())
            .then(data => { 
                
                setRestaurant(data.restaurant);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const handleUpdateRestaurant = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!restaurant) {
            console.error('Restaurant data is not loaded yet');
            return;
        }
    
        const updatedRestaurantData = {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            phone_number: restaurant.phone_number,
            type: restaurant.type,
            Kosher: restaurant.Kosher,
            order_table: restaurant.order_table,
            Availability: restaurant.Availability
        };
    
        console.log("before fetch");
        fetch(`http://localhost:5000/manager/restaurant_page/${restaurant.id}/update_restaurant`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRestaurantData)
        })
        .then(response => {
            console.log("Response:", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Before navigate")
            console.log("Data:", data);
            console.log("Response Data:", data);
            console.log("Data:", data);
            navigate(`/restaurant/${id}`);
        })
        .catch(error => console.error('Error:', error));
        
        console.log("Updated Restaurant Data:", updatedRestaurantData);
        console.log("After fetch");
        
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
                    <input type="text" value={restaurant.Availability} onChange={e => setRestaurant({...restaurant, Availability: e.target.value})} />
                </label>
                <button type="submit">Update</button>
            </form>
        
        </div>
    
    );
};

export default UpdateRestaurantPage;