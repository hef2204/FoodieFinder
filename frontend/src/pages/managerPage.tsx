import React from 'react';

interface ManagerPageProps {
    manager_name: string;
    // Add any other props that you need
}

const ManagerPage: React.FC<ManagerPageProps> = ({ manager_name }) => {
    return (
        <div>
            <h1>Welcome, {manager_name}!</h1>
            <div>
                <h2>Your Profile</h2>
                {/* Display the user's profile information here */}
            </div>
            <div>
                <h2>Your Activity</h2>
                {/* Display the user's activity or other data here */}
            </div>
            <button>Logout</button>
        </div>
    );
};

export default ManagerPage;