import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/addManagerRestaurant.css';

interface FormData {
    username: string;
    full_name: string;
    password: string;
    email: string;
    phone_number: string;
    name: string;
    location: string;
    phone_number_restaurant: string;
    type: string;
    Kosher: string;
    order_table: string;
    opening_time: string;
    closing_time: string;
    discounts: string;
}

interface Errors {
    username: string;
    full_name: string;
    password: string;
    email: string;
    phone_number: string;
    name: string;
    location: string;
    phone_number_restaurant: string;
    type: string;
    Kosher: string;
    order_table: string;
    opening_time: string;
    closing_time: string;
    discounts: string;
}

const AddManagerAndRestaurant: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
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
        opening_time: '',
        closing_time: '',
        discounts: ''
    });

    const [errors, setErrors] = useState<Partial<Errors>>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        validateField(name, value);
    };

    const validateField = (name: string, value: string) => {
        let error = '';
        if (!value) {
            error = `${name.replace('_', ' ')} is required`;
        } else if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                error = 'Invalid email format';
            }
        } else if (name === 'phone_number' || name === 'phone_number_restaurant') {
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(value)) {
                error = 'Phone number must be 10 digits';
            }
        } else if (name === 'password' && value.length < 6) {
            error = 'Password must be at least 6 characters';
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const validateForm = () => {
        const newErrors: Partial<Errors> = {};
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                newErrors[key as keyof Errors] = `${key.replace('_', ' ')} is required`;
            } else if (key === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    newErrors[key as keyof Errors] = 'Invalid email format';
                }
            } else if (key === 'phone_number' || key === 'phone_number_restaurant') {
                const phonePattern = /^[0-9]{10}$/;
                if (!phonePattern.test(value)) {
                    newErrors[key as keyof Errors] = 'Phone number must be 10 digits';
                }
            } else if (key === 'password' && value.length < 6) {
                newErrors[key as keyof Errors] = 'Password must be at least 6 characters';
            }
        }
        setErrors(newErrors as Errors);
        return Object.keys(newErrors).length === 0;
    };

    const addManagerAndRestaurant = () => {
        if (!validateForm()) {
            return;
        }

        const { username, full_name, password, email, phone_number, name, location, phone_number_restaurant, type, Kosher, order_table, opening_time, closing_time, discounts } = formData;

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
            opening_time,
            closing_time,
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
    };

    const isFormValid = () => {
        return Object.values(errors).every(error => !error) &&
            Object.values(formData).every(value => value !== '');
    };

    return (
        <div className="managerRestaurant">
            <div className="form-container">
                <div className="Manager-form-section">
                    <h2>Manager Details</h2>
                    <label>Username: <span className="required">*</span></label>
                    <input className="input-field" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                    {errors.username && <p className="error-message">{errors.username}</p>}
                    <label>Full Name: <span className="required">*</span></label>
                    <input className="input-field" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
                    {errors.full_name && <p className="error-message">{errors.full_name}</p>}
                    <label>Password: <span className="required">*</span></label>
                    <input className="input-field" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                    <label>Email: <span className="required">*</span></label>
                    <input className="input-field" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    <label>Phone Number: <span className="required">*</span></label>
                    <input className="input-field" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
                    {errors.phone_number && <p className="error-message">{errors.phone_number}</p>}
                </div>
                <div className="Restaurant-form-section">
                    <h2>Restaurant Details</h2>
                    <label>Name: <span className="required">*</span></label>
                    <input className="input-field" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                    <label>Location: <span className="required">*</span></label>
                    <input className="input-field" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                    {errors.location && <p className="error-message">{errors.location}</p>}
                    <label>Phone Number: <span className="required">*</span></label>
                    <input className="input-field" name="phone_number_restaurant" value={formData.phone_number_restaurant} onChange={handleChange} placeholder="Phone Number" />
                    {errors.phone_number_restaurant && <p className="error-message">{errors.phone_number_restaurant}</p>}
                    <label>Type: <span className="required">*</span></label>
                    <input className="input-field" name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
                    {errors.type && <p className="error-message">{errors.type}</p>}
                    <label>Kosher: <span className="required">*</span></label>
                    <select className="input-field" name="Kosher" value={formData.Kosher} onChange={handleChange}>
                        <option value="">Kosher</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    {errors.Kosher && <p className="error-message">{errors.Kosher}</p>}
                    <label>Order Table: <span className="required">*</span></label>
                    <select className="input-field" name="order_table" value={formData.order_table} onChange={handleChange}>
                        <option value="">Order Table</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    {errors.order_table && <p className="error-message">{errors.order_table}</p>}
                    <label>Opening Time: <span className="required">*</span></label>
                    <input className="input-field" name="opening_time" type="time" value={formData.opening_time} onChange={handleChange} />
                    {errors.opening_time && <p className="error-message">{errors.opening_time}</p>}
                    <label>Closing Time: <span className="required">*</span></label>
                    <input className="input-field" name="closing_time" type="time" value={formData.closing_time} onChange={handleChange} />
                    {errors.closing_time && <p className="error-message">{errors.closing_time}</p>}
                    <label>Discounts: <span className="required">*</span></label>
                    <input className="input-field" name="discounts" value={formData.discounts} onChange={handleChange} placeholder="Discounts" />
                    {errors.discounts && <p className="error-message">{errors.discounts}</p>}
                </div>
            </div>
            <button className="button" onClick={addManagerAndRestaurant} disabled={!isFormValid()}>Add Manager and Restaurant</button>
            <button className="back-button" onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default AddManagerAndRestaurant;
