import React, { useState, useEffect } from 'react';
import '../css/UserReservationPage.css';

interface Reservation {
    id: number;
    restaurant_name: string;
    date: string;
    time: string;
    number_of_people: number;
}

const UserReservationPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [message, setMessage] = useState<string>('');
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        fetchUserReservations();
    }, [user_id]);

    const fetchUserReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/user_profile/${user_id}/reservations`, {
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

    const deleteReservation = async (reservationId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/user_profile/${user_id}/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                setMessage('Reservation deleted successfully');
                fetchUserReservations();  // Refresh the list of reservations
            } else {
                setMessage('Failed to delete reservation');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred');
        }
    };

    return (
        <div className='reservations'>
            <h2>Your Reservations</h2>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Restaurant Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Number of People</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation: Reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.restaurant_name}</td>
                            <td>{reservation.date}</td>
                            <td>{reservation.time}</td>
                            <td>{reservation.number_of_people}</td>
                            <td>
                            <button onClick={() => deleteReservation(reservation.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='back-button' onClick={() => window.history.back()}>Back</button>

        </div>
    );
};

export default UserReservationPage;