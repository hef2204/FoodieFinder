import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "../css/UsersTable.css";

interface Manager {
    id: string;
    username: string;
    full_name: string;
    email: string;
    restaurant: string;
    phone_number: string;
    role: string;
}

const ManagersTable = () => {
    const [managers, setManagers] = useState<Manager[]>([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`http://localhost:5000/admin/manage_managers`, {
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
            setManagers(data.managers);
        })
        .catch(error => console.error('Error:', error));
    }, [token]);

    const deleteManager = async (username: string) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/admin/manage_managers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            } else {
                const data = await response.json();
                console.log('Success:', data.message);
                setManagers(prevManagers => prevManagers.filter(manager => manager.username !== username));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!managers.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className='managerTable'>
            <h1>Managers</h1>
            <table>
                <thead className='ManageManagerHeader'>
                    <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {managers.map((manager) => (
                        <tr key={manager.id}>
                            <td>{manager.username}</td>
                            <td>{manager.full_name}</td>
                            <td>{manager.email}</td>
                            <td>{manager.role}</td>
                            <td>
                                <button onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this manager?')) {
                                        deleteManager(manager.username);
                                    }
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='back-button-ManagerTable'>
                <button onClick={() => window.history.back()}>Back</button>
            </div>
        </div>
    );
};

export default ManagersTable;
