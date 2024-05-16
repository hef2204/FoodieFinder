import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                navigate('/pages/adminPage'); 
            })
            .catch(error => console.error('Error:', error));
    }

    return (
        <div className="container">
            <div className="form">
                <h1>Add Manager and Restaurant</h1>
                <h2>Manager Details</h2>
                <input className="input-field" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                <input className="input-field" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
                <input className="input-field" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                <input className="input-field" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <input className="input-field" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
                <h2>Restaurant Details</h2>
                <input className="input-field" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <input className="input-field" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                <input className="input-field" name="phone_number_restaurant" value={formData.phone_number_restaurant} onChange={handleChange} placeholder="Phone Number" />
                <input className="input-field" name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
                <select className="input-field" name="Kosher" value={formData.Kosher} onChange={handleSelectChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                <input className="input-field" name="order_table" value={formData.order_table} onChange={handleChange} placeholder="Order Table" />
                <input className="input-field" name="Availability" value={formData.Availability} onChange={handleChange} placeholder="Availability" />
                <input className="input-field" name="discounts" value={formData.discounts} onChange={handleChange} placeholder="Discounts" />
                <button className="button" onClick={addManagerAndRestaurant}>Add Manager and Restaurant</button>
            </div>
            <button className='back-button' onClick={() => window.history.back()}>back</button>
        </div>
    );
};

export default AddManagerAndRestaurant;
