import React from 'react';
import { Link } from 'react-router-dom';

function UserDashboard() {
    return (
        <div>
            <h1>User Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to="/user/profile">Edit Profile</Link></li>
                    <li><Link to="/user/restaurants">Find Restaurants</Link></li>
                    <li><Link to="/user/reviews">Leave a Review</Link></li>
                </ul>
            </nav>
            <main>
                <h2>Welcome, User!</h2>
                <p>Use the links above to navigate to different sections of your dashboard.</p>
            </main>
        </div>
    );
}

export default UserDashboard;