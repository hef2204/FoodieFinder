import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AddAdmin.css';

const AddAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        password: '',
        email: '',
        phone_number: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { username, full_name, password, email, phone_number } = formData;
        let error = '';

        if (!username) error = 'Username is required';
        else if (!full_name) error = 'Full name is required';
        else if (!password) error = 'Password is required';
        else if (password.length < 6) error = 'Password must be at least 6 characters long';
        else if (!email) error = 'Email is required';
        else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) error = 'Invalid email format';
        }
        if (!phone_number) error = 'Phone number is required';
        else {
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone_number)) error = 'Phone number must be 10 digits';
        }

        if (error) {
            setErrorMessage(error);
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        if (!validateForm()) return;

        fetch('http://localhost:5000/admin/add_admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'An error occurred');
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
            setErrorMessage(error.message);
        });
    };

    return (
        <div className="add-admin-container">
            <h2>Add Admin</h2>
            <form className="add-admin-form" onSubmit={handleSubmit}>
                <label>
                    Username: <span className="required">*</span>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                </label>
                <label>
                    Full Name: <span className="required">*</span>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />
                </label>
                <label>
                    Password: <span className="required">*</span>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </label>
                <label>
                    Email: <span className="required">*</span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </label>
                <label>
                    Phone Number: <span className="required">*</span>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number"required/>
                </label>
                <button type="submit">Add Admin</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
            <button className="back-button" onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default AddAdmin;
