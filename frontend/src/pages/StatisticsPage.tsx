import React, { useEffect, useState } from 'react';

const StatisticsPage = () => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        // Fetch the statistics from your server
        fetch('http://localhost:5000/admin/view_statistics')
            .then(response => response.json())
            .then(data => setStatistics(data))
            .catch(error => console.error('Error:', error));
    }, []);

    if (!statistics) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Statistics</h1>
            <p>Number of users: {statistics.numUsers}</p>
            <p>Number of active users: {statistics.numActiveUsers}</p>
            // Add more statistics here...
            <div className='back-button'>
            <button onClick={() => window.location.href = '/pages/adminPage'}>Back</button>
            </div>
        
        </div>


            
    );
};

export default StatisticsPage;