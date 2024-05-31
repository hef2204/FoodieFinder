import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/AddRestaurant.css";

const AddRestaurant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        phone_number: '',
        type: '',
        Kosher: '',
        order_table: '',
        Availability: '',
        discounts: ''
    });
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                setError(`Field ${key} is required`);
                return false;
            }
        }
        setError('');
        return true;
    };

    const addRestaurant = () => {
        if (!validateForm()) {
            return;
        }

        const { name, location, phone_number, type, Kosher, order_table, Availability, discounts } = formData;
        const token = localStorage.getItem('token'); // Get JWT token from localStorage
        
        const restaurant = {
            name,
            location,
            phone_number,
            type,
            Kosher,
            order_table,
            Availability,
            discounts
        };

        fetch('http://127.0.0.1:5000/manager/add_restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include JWT token in Authorization header
            },
            body: JSON.stringify(restaurant),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                navigate('/pages/managerPage');
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="AddRestaurant-container">
            <div className="AddRestaurant-form">
                <h1>Add Restaurant</h1>
                {error && <p className="error-message">{error}</p>}
                <label>Restaurant Name: <span className="required">*</span> </label>
                <input className="input-field" name="name" value={formData.name} onChange={handleChange} placeholder="Restaurant Name" />
                <label>Location: <span className="required">*</span> </label>
                <input className="input-field" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                <label>Phone Number: <span className="required">*</span> </label>
                <input className="input-field" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
                <label>Type: <span className="required">*</span> </label>
                <input className="input-field" name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
                <label>Kosher: <span className="required">*</span> </label>
                <select className="input-field" name="Kosher" value={formData.Kosher} onChange={handleSelectChange}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <label>Order Table: <span className="required">*</span> </label>
                <input className="input-field" name="order_table" value={formData.order_table} onChange={handleChange} placeholder="Order Table" />
                <label>Availability: <span className="required">*</span> </label>
                <input className="input-field" name="Availability" value={formData.Availability} onChange={handleChange} placeholder="Availability" />
                <label>Discounts: <span className="required">*</span> </label>
                <input className="input-field" name="discounts" value={formData.discounts} onChange={handleChange} placeholder="Discounts" />
                <button className="button" onClick={addRestaurant}>Add Restaurant</button>
            </div>
            <button className="back-button" onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default AddRestaurant;
