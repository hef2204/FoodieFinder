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
    opening_time: string;
    closing_time: string;
}

const UpdateRestaurantPage = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant_page/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurant data');
                }
                return response.json();
            })
            .then(data => {
                setRestaurant(data.restaurant);
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Failed to load restaurant data');
            });
    }, [id]);

    const handleUpdateRestaurant = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!restaurant) {
            setError('Restaurant data is not loaded yet');
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
            opening_time: restaurant.opening_time,
            closing_time: restaurant.closing_time
        };

        fetch(`http://localhost:5000/manager/restaurant_page/${restaurant.id}/update_restaurant`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRestaurantData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update restaurant');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                navigate(`/restaurant/${id}`);
                localStorage.setItem('restaurantName', restaurant.name);
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Failed to update restaurant');
            });
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div className='update-restaurant-container'>
            <h2>Update Restaurant</h2>
            <form onSubmit={handleUpdateRestaurant} className="update-restaurant-form">
                <label>Name:</label>
                <input
                    type="text"
                    value={restaurant.name}
                    onChange={e => setRestaurant({ ...restaurant, name: e.target.value })}
                    placeholder="Restaurant Name"
                />
                <label>Location:</label>
                <input
                    type="text"
                    value={restaurant.location}
                    onChange={e => setRestaurant({ ...restaurant, location: e.target.value })}
                    placeholder="Restaurant Location"
                />
                <label>Phone Number:</label>
                <input
                    type="text"
                    value={restaurant.phone_number}
                    onChange={e => setRestaurant({ ...restaurant, phone_number: e.target.value })}
                    placeholder="Restaurant Phone Number"
                    pattern="\d*"
                />
                <label>Type:</label>
                <input
                    type="text"
                    value={restaurant.type}
                    onChange={e => setRestaurant({ ...restaurant, type: e.target.value })}
                    placeholder="Restaurant Type"
                />
                <label>Kosher:</label>
                <select
                    value={restaurant.Kosher}
                    onChange={e => setRestaurant({ ...restaurant, Kosher: e.target.value })}
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <label>Order Table:</label>
                <select
                    value={restaurant.order_table}
                    onChange={e => setRestaurant({ ...restaurant, order_table: e.target.value })}
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <label>Opening Time:</label>
                <input
                    type="time"
                    value={restaurant.opening_time}
                    onChange={e => setRestaurant({ ...restaurant, opening_time: e.target.value })}
                />
                <label>Closing Time:</label>
                <input
                    type="time"
                    value={restaurant.closing_time}
                    onChange={e => setRestaurant({ ...restaurant, closing_time: e.target.value })}
                />
                <button type="submit" className="submit-button">Update</button>
            </form>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default UpdateRestaurantPage;
