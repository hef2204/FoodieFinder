import React from 'react';
import { Link } from 'react-router-dom';

type ManagerPageProps = {
    managerName: string;
    restaurantName: string;
};

const ManagerPage: React.FC<ManagerPageProps> = ({ managerName, restaurantName }) => {
    return (
        <div>
            <h1>Welcome, {managerName}!</h1>
            <h2>You are managing: {restaurantName}</h2>
            <p>From here, you can manage different aspects of your restaurant.</p>
            <ul>
                <li><Link to="/manage-menu">Manage Menu</Link></li>
                <li><Link to="/manage-orders">Manage Orders</Link></li>
                <li><Link to="/manage-staff">Manage Staff</Link></li>
                <li><Link to="/manage-reviews">Manage Reviews</Link></li>
            </ul>
        </div>
    );
};

export default ManagerPage;