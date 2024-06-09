import React, { useState, useEffect } from 'react';
import '../css/AddManager.css';

interface State {
    username: string;
    full_name: string;
    password: string;
    email: string;
    phone_number: string; // Keep this as string for input handling
    restaurantId: string;
    error: string | null;
}

interface Restaurant {
    id: string;
    name: string;
}

const AddManager: React.FC = () => {
    const [state, setState] = useState<State>({
        username: '',
        full_name: '',
        password: '',
        email: '',
        phone_number: '',
        restaurantId: '',
        error: null,
    });
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        console.log("Fetching restaurants...");
        fetch('http://127.0.0.1:5000/admin/get_restaurants', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            console.log("Restaurants fetched:", data);
            setRestaurants(data);
        })
        .catch(error => console.error('Error fetching restaurants:', error));
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'password' && value.includes(' ')) {
            setState({ ...state, error: 'Password cannot contain spaces' });
        } else if (name === 'phone_number' && !/^\d+$/.test(value)) {
            setState({ ...state, error: 'Phone number must contain only numbers' });
        } else {
            setState({ ...state, [name]: value, error: null });
        }
    };

    const handleRestaurantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setState({ ...state, restaurantId: event.target.value });
    };

    const validateFields = () => {
        const { username, full_name, password, email, phone_number, restaurantId } = state;
        if (!username) {
            setState({ ...state, error: 'Username is required' });
            return false;
        }
        if (!full_name) {
            setState({ ...state, error: 'Full name is required' });
            return false;
        }
        if (!password) {
            setState({ ...state, error: 'Password is required' });
            return false;
        }
        if (password.includes(' ')) {
            setState({ ...state, error: 'Password cannot contain spaces' });
            return false;
        }
        if (password.length < 6) {
            setState({ ...state, error: 'Password must be at least 6 characters long' });
            return false;
        }
        if (!email) {
            setState({ ...state, error: 'Email is required' });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setState({ ...state, error: 'Invalid email format' });
            return false;
        }
        if (!phone_number) {
            setState({ ...state, error: 'Phone number is required' });
            return false;
        }
        if (!restaurantId) {
            setState({ ...state, error: 'Restaurant selection is required' });
            return false;
        }
        return true;
    };

    const addManager = async () => {
        if (!validateFields()) return;

        const { username, full_name, password, email, phone_number, restaurantId } = state;
        const managerData = { username, full_name, password, email, phone_number, restaurant_ids: [restaurantId] };

        try {
            const response = await fetch('http://127.0.0.1:5000/admin/add_manager', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(managerData),
            });

            if (response.ok) {
                setState({
                    username: '',
                    full_name: '',
                    password: '',
                    email: '',
                    phone_number: '',
                    restaurantId: '',
                    error: null,
                });
                window.alert('Manager added successfully');
            } else {
                const errorData = await response.json();
                setState({ ...state, error: errorData.message });
                window.alert('Failed to add manager: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setState({ ...state, error: 'An error occurred' });
            window.alert('An error occurred while adding the manager');
        }
    };

    const { username, full_name, password, email, phone_number, restaurantId, error } = state;

    return (
        <div className="AddManagerContainer">
            <div className="form">
                <h1>Add Manager</h1>
                <label>Username: <span className="required">*</span></label>
                <input className="input-field" name="username" value={username} onChange={handleChange} placeholder="Username" />
                {error === 'Username is required' && <p className="error-message">{error}</p>}
                <label>FullName: <span className="required">*</span></label>
                <input className="input-field" name="full_name" value={full_name} onChange={handleChange} placeholder="Full Name" />
                {error === 'Full name is required' && <p className="error-message">{error}</p>}
                <label>Password: <span className="required">*</span></label>
                <input className="input-field" type='password' name="password" value={password} onChange={handleChange} placeholder="Password" />
                {error === 'Password is required' && <p className="error-message">{error}</p>}
                {error === 'Password cannot contain spaces' && <p className="error-message">{error}</p>}
                {error === 'Password must be at least 6 characters long' && <p className="error-message">{error}</p>}
                <label>Email: <span className="required">*</span></label>
                <input className="input-field" name="email" value={email} onChange={handleChange} placeholder="Email" />
                {error === 'Email is required' && <p className="error-message">{error}</p>}
                {error === 'Invalid email format' && <p className="error-message">{error}</p>}
                <label>Phone Number: <span className="required">*</span></label>
                <input className="input-field" name="phone_number" value={phone_number} onChange={handleChange} placeholder="Phone Number" />
                {error === 'Phone number is required' && <p className="error-message">{error}</p>}
                {error === 'Phone number must contain only numbers' && <p className="error-message">{error}</p>}
                <label>Restaurant: <span className="required">*</span></label>
                <select className="input-field" name="restaurant" value={restaurantId} onChange={handleRestaurantChange}>
                    <option value="" disabled selected>Select a Restaurant</option>
                    {restaurants.map(restaurant => (
                        <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                    ))}
                </select>
                {error === 'Restaurant selection is required' && <p className="error-message">{error}</p>}
                <button className="button" onClick={addManager}>Add Manager</button>
                
            </div>
            <button className='back-button' onClick={() => window.history.back()}>back</button>
        </div>
    );
};

export default AddManager;
