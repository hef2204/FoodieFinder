import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        password: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(''); 

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
        <div className="container">
            <h2>Add Admin</h2>
            <form className="add-admin-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <button type="submit">Add Admin</button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
            <button className="back-button" onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default AddAdmin;
