import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6 && !password.includes(' ');
    };

    const validatePhoneNumber = (phoneNumber: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const validateUsername = (username: string) => {
        return username.trim().length > 0;
    };

    const validateFullName = (fullName: string) => {
        return fullName.trim().length > 0;
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateUsername(username)) {
            setErrorMessage('Username is required');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 6 characters long and cannot contain spaces');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Invalid email format');
            return;
        }

        if (!validateFullName(fullName)) {
            setErrorMessage('Full name is required');
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            setErrorMessage('Phone number must be 10 digits');
            return;
        }

        const user = {
            username: username,
            password: password,
            email: email,
            full_name: fullName,
            phone_number: phoneNumber
        };

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (response.status === 409) {
                setErrorMessage('Username already taken');
                return;
            }

            if (response.status === 410) {
                setErrorMessage('Email already taken');
                return;
            }

            if (!response.ok) {
                throw new Error('Register failed');
            }

            const data = await response.json();
            console.log(data); // For debugging

            // Automatically log in the user after successful registration
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id); // Store user_id in localStorage
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            navigate("/pages/user-profile"); // Navigate to the user profile page after login
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred during registration');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <label>Username: <span className="required">*</span></label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => {
                        setUsername(e.target.value);
                        setErrorMessage('');
                    }} 
                    placeholder='Username' 
                />
                <label>Password: <span className="required">*</span></label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => {
                        setPassword(e.target.value);
                        setErrorMessage('');
                    }} 
                    placeholder='Password' 
                />
                <label>Email: <span className="required">*</span></label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={e => {
                        setEmail(e.target.value);
                        setErrorMessage('');
                    }} 
                    placeholder='Email' 
                />
                <label>Full Name: <span className="required">*</span></label>
                <input 
                    type="text" 
                    value={fullName} 
                    onChange={e => {
                        setFullName(e.target.value);
                        setErrorMessage('');
                    }} 
                    placeholder='Full Name'
                />
                <label>Phone Number: <span className="required">*</span></label>
                <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={e => {
                        setPhoneNumber(e.target.value);
                        setErrorMessage('');
                    }} 
                    placeholder='Phone Number'
                />
                <button type="submit">Register</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button className='back-button' onClick={() => window.history.back()}>Back</button>

        </div>
    );
};

export default Register;
