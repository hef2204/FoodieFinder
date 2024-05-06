import  { useEffect, useState } from 'react';
import "../css/UsersTable.css"



interface manager {
    id: string;
    username: string;
    full_name: string;
    email: string;
    restaurant: string;
    phone_number: string;
    role: string;
    
    
    
    
}




const ManagersTable = () => {
    const [manager, setManager] = useState<manager[]>([]);

    useEffect(() => {
        fetch(`http://localhost:5000/admin/manage_managers`)
            .then(response => response.json())
            .then((data) => {
                setManager(data.managers)
                console.log(data)
            
            }) 
            .catch(error => console.error('Error:', error));
    }, []);

    

    if (!manager || !manager.length) {
        return <div>Loading...</div>;
    }
return (
    <div className='managerTable'>
        <h1>managers</h1>
    
    <table>
        <thead>
            <tr>
                <th>username</th>
                <th>email</th>
                <th>full_name</th>
                <th>role</th>
            </tr>
        </thead>
        <tbody>
            {manager.map((manager) => (
                <tr key={manager.id}>
                    <td>{manager.username}</td>
                    <td>{manager.email}</td>
                    <td>{manager.full_name}</td>
                    <td>{manager.role}</td>
                    
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
