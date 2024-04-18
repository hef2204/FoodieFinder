import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import "../css/UsersTable.css"


interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    Kosher: string;
    role: string;
    
    
    // Add other properties as needed
}

const UsersTable = ({ match }: RouteComponentProps<MatchParams>) => {
    const [user, setUser] = useState<User[]>([]);

    useEffect(() => {
        // Fetch the user data from your server
        fetch(`http://localhost:5000/admin/manage_users`)
            .then(response => response.json())
            .then(data => setUser(data.users)) // Assuming the data is an object with a 'users' property
            .catch(error => console.error('Error:', error));
    }, []);

    if (!user.length) {
        return <div>Loading...</div>;
    }
return (
    <div className='userTable'>
        <h1>Users</h1>
    
    <table>
        <thead>
            <tr>
                <th>username</th>
                <th>email</th>
                <th>first_name</th>
                <th>last_name</th>
                <th>role</th>
            </tr>
        </thead>
        <tbody>
            {user.map((user) => (
                <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.role}</td>
                    
                </tr>
            ))}
        </tbody>
    </table>
    <div className='back-button-UserTable'>
        <button onClick={() => window.history.back()}>Back</button>
    </div>
    </div>
);

};

export default UsersTable;
