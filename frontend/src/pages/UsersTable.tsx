import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "../css/UsersTable.css"

interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: "user";
    phone_number: string;
}



const UsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const token = localStorage.getItem('token');
   

    useEffect(() => {
        fetch(`http://localhost:5000/admin/manage_users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then((data) => {
            if (data.message === 'Unauthorized') {
                console.error('Unauthorized request');
                return;
            }
            setUsers(data.users);
        }) 
        .catch(error => console.error('Error:', error));
    }, [token]);

    const handleDelete = (username: string) => {
        fetch(`http://localhost:5000/admin/manage_users`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username }),
        })
        .then(response => response.json())
        .then(data => {
             console.log(data);
             console.log('User deleted');
                setUsers(users.filter(user => user.username !== username));
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    if (!users.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className='userTable'>
            <h1>Users</h1>
            <table>
                <thead className='ManageUserHeader'>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Phone Number</th>
                        <th>Delete</th> 
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>
                            <td>
                                <button onClick={() => handleDelete(user.username)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
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
