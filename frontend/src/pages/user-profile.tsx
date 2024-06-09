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
                        setName(data.user.name);
                        setEmail(data.user.email);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user_id]);


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
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    {/* <button onClick={handleSave}>Save</button> */}
                    <button onClick={() => setEditMode(false)}>Cancel</button>
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
                navigate("/")
            }}>Logout</button>
            <button className='reservation' onClick={() => {
                navigate("/pages/UserReservationPage")
            }}>Reservations</button>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>

        </div>
    );
};

export default UserProfile;
