import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/AddManager.css"

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const addRestaurant = () => {
        const { name, location, phone_number, type, Kosher, order_table, Availability, discounts } = formData;
        const managerId = localStorage.getItem('userId'); 
        const restaurant = {
            name,
            location,
            phone_number,
            type,
            Kosher,
            order_table,
            Availability,
            discounts,
            manager_id: managerId 
        };
        fetch('http://127.0.0.1:5000/manager/add_restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    }

    return (
        <div className="AddRestaurant-container">
            <div className="form">
                <h1>Add Restaurant</h1>
                <input className="input-field" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <input className="input-field" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                <input className="input-field" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
                <input className="input-field" name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
                <select className="input-field" name="Kosher" value={formData.Kosher} onChange={handleSelectChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                <input className="input-field" name="order_table" value={formData.order_table} onChange={handleChange} placeholder="Order Table" />
                <input className="input-field" name="Availability" value={formData.Availability} onChange={handleChange} placeholder="Availability" />
                <input className="input-field" name="discounts" value={formData.discounts} onChange={handleChange} placeholder="Discounts" />
                <button className="button" onClick={addRestaurant}>Add Restaurant</button>
            </div>
            <button className='back-button' onClick={() => window.history.back()}>back</button>
        </div>
    );
};

export default AddRestaurant;
