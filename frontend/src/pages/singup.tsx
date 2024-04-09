import React, { useState } from 'react';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    

    // Updated handleRegister function
    const handleRegister = async () => {
        const registerData = {
            email,
            password
        };

        try {
            const response = await fetch('http://localhost:5000/register', { // Replace with your backend's register endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            if (!response.ok) {
                throw new Error('register failed');
            }

            const data = await response.json();

            // Handle the response data here. For example, you can save the user's token to local storage:
            localStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Error:', error);
            // Handle the error here. For example, you can set an error message to state and display it to the user.
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form>
                <input type="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input type="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
                <button type="button" onClick={handleRegister}>register</button>
            </form>
        </div>
    );
};

export default Register;