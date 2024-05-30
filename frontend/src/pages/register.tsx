import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('Invalid email format');
            return;
        }

        const user = {
            username: username,
            password: password,
            email: email,
            full_name: fullName,
            phone_number: phone_number
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

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            navigate("/pages/login");
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred during registration');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
                <input type="email" value={email} onChange={e => {
                        setEmail(e.target.value);
                        setErrorMessage(''); // Clear the error message when email input changes
                    }} 
                    placeholder='Email'  />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder='Full Name'/>
                <input type="text" value={phone_number} onChange={e => setPhoneNumber(e.target.value)} placeholder='Phone Number'/>
                <button type="submit">Register</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button className='back-button' onClick={() => navigate('/')}>Back</button>
        </div>
    );
};

export default Register;
