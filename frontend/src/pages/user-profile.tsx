import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    full_name: string;
}

const UserProfile: React.FC = () => {
    const user_id = localStorage.getItem('user_id');
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user_id) {
            fetch(`http://localhost:5000/user_profile/${user_id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        setUser(data.user);
                        setName(data.user.full_name);
                        setEmail(data.user.email);
                        setUsername(data.user.username);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user_id]);

    const validateEmail = (email: string) => {
        const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return EMAIL_REGEX.test(email);
    };

    const handleSave = () => {
        if (!window.confirm('Are you sure you want to save the changes?')) {
            return;
        }

        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }

        if (password && (password.length < 6 || password.includes(' '))) {
            setError('Password must be at least 6 characters long and contain no spaces');
            return;
        }

        if (user_id) {
            const updateData: { [key: string]: string } = {};
            if (name) updateData['name'] = name;
            if (email) updateData['email'] = email;
            if (username) updateData['username'] = username;
            if (password) updateData['password'] = password;

            fetch(`http://localhost:5000/user_profile/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setUser(data.user);
                        setEditMode(false);
                        setError('');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='userprofile-container'>
            <h1>User Profile</h1>
            {editMode ? (
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </label>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter a new password (optional)"
                        />
                    </label>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Full Name: {user.full_name}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            )}
            <button className='LogOut' onClick={() => {
                localStorage.clear();
                setUser(null);
                navigate("/");
            }}>Logout</button>
            <button className='reservation' onClick={() => {
                navigate("/pages/UserReservationPage");
            }}>Reservations</button>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default UserProfile;
