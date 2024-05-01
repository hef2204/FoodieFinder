import React, { useState } from 'react';

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        age: 0,
        // Add more fields as per your requirements
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Perform update logic here
        console.log(userData);
    };

    return (
        <div>
            <h2>User Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={userData.age}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UserProfile;