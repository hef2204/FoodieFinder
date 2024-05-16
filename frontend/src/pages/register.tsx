import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';


const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const navigate = useNavigate()
    

    
    const handleRegister = async () => {
        const user = {
            username: username,
            password: password,
            email: email,
            first_name: first_name,
            last_name: last_name
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
                console.error('Username already taken');
                return;
            }

            if (response.status === 410) {
                console.error('Email already taken');
                return;
            }
    
            if (!response.ok) {
                throw new Error('register failed');
            }
    
            const data = await response.json();
    
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            localStorage.clear();
            navigate("/pages/login")
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form>
                <label>Username:</label>
                <input type="username" value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' />
                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
                <label>First Name:</label>
                <input type="first name" value={first_name} onChange={e => setFirstName(e.target.value)} placeholder='First Name'/>
                <label>Last Name:</label>
                <input type="lastName" value={last_name} onChange={e => setLastName(e.target.value)} placeholder='Last Name' />
                <button type="button" onClick={handleRegister}>Register</button>
            </form>
            <button className='back-button' onClick={() => navigate('/')}>back</button>
            
        </div>
    );
};

export default Register;