import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/addManagerRestaurant.css';

const AddManagerAndRestaurant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        password: '',
        email: '',
        phone_number: '',
        name: '',
        location: '',
        phone_number_restaurant: '',
        type: '',
        Kosher: '',
        order_table: '',
        Availability: '',
        discounts: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Validate email format
        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    email: 'Invalid email format'
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    email: ''
                }));
            }
        }
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const addManagerAndRestaurant = () => {
        const { username, full_name, password, email, phone_number, name, location, phone_number_restaurant, type, Kosher, order_table, Availability, discounts } = formData;

        const manager = {
            username,
            full_name,
            password,
            email,
            phone_number
        };

        const restaurant = {
            name,
            location,
            phone_number: phone_number_restaurant,
            type,
            Kosher,
            order_table,
            Availability,
            discounts
        };

        const body = {
            manager,
            restaurant
        };

        fetch('http://127.0.0.1:5000/admin/add_manager_and_restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(body),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                navigate('/pages/adminPage'); 
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.message === 'Username already exists') {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        username: error.message
                    }));
                } else if (error.message === 'Email already exists') {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        email: error.message
                    }));
                } else {
                    alert('An unexpected error occurred: ' + error.message);
                }
            });
    }

    return (
        <div className="managerRestaurant">
            <div className="managerRestaurantAddForm">
                <h2>Add Manager and Restaurant</h2>
                <h2>Manager Details</h2>
                <input className="input-field" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                {errors.username && <p className="error-message">{errors.username}</p>}
                <input className="input-field" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
                <input className="input-field" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                <input className="input-field" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                {errors.email && <p className="error-message">{errors.email}</p>}
                <input className="input-field" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
                <h2>Restaurant Details</h2>
                <input className="input-field" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <input className="input-field" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                <input className="input-field" name="phone_number_restaurant" value={formData.phone_number_restaurant} onChange={handleChange} placeholder="Phone Number" />
                <input className="input-field" name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
                <select className="input-field" name="Kosher" value={formData.Kosher} onChange={handleSelectChange}>
                    <option value="">Kosher</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <select className="input-field" name="order_table" value={formData.order_table} onChange={handleSelectChange}>
                    <option value="">Order Table</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <input className="input-field" name="Availability" value={formData.Availability} onChange={handleChange} placeholder="Availability" />
                <input className="input-field" name="discounts" value={formData.discounts} onChange={handleChange} placeholder="Discounts" />
                <button className="button" onClick={addManagerAndRestaurant} disabled={!!errors.email || !!errors.username}>Add Manager and Restaurant</button>
            </div>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default AddManagerAndRestaurant;
