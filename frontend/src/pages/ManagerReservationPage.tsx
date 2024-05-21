import React, { useState, useEffect } from 'react';

interface Reservation {
    id: number;
    date: string;
    time: string;
    numberOfPeople: number;
}

const ManagerReservationPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchManagerReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/manager/manager_reservations', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setReservations(data.reservations);
                } else {
                    setMessage('Failed to fetch reservations');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('An error occurred');
            }
        };

        fetchManagerReservations();
    }, []);

    return (
        <div className='reservations'>
            <h2>Manager Reservations</h2>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Number of People</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation: Reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>{reservation.date}</td>
                            <td>{reservation.time}</td>
                            <td>{reservation.numberOfPeople}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => window.history.back()}>Go Back</button>
        </div>
    );
};

export default ManagerReservationPage;
