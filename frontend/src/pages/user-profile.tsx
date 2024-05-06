import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
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
        <div>
           <h1>User Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
             {/* Add more profile information here */}
         
         <button className='LogOut' onClick={() => {
            localStorage.clear();
            setUser(null);
            navigate("/")
            }}>Logout</button>
        </div>
    );
};

export default UserProfile;