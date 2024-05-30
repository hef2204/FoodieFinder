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
    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/user_profile/${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        setUser(data.user);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='userprofile-container'>
           <h1>User Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Full Name: {user.full_name}</p>
         
            <button className='LogOut' onClick={() => {
            localStorage.clear();
            setUser(null);
            navigate("/")
            }}>Logout</button>
            <button className='reservation' onClick={() => {
                navigate("/pages/UserReservationPage")
            }}>Reservations</button>
            <button className='back' onClick={() => {
                navigate(-1)
            }}>Back</button>
        </div>
    );
};

export default UserProfile;