import React, { useState, ChangeEvent, FormEvent } from 'react';


const ReservationPage: React.FC = () => {
    const [formData, setFormData] = useState({
        user_id: localStorage.getItem('userId') || "", 
        date: '',
        time: '',
        number_of_people: '',
        restaurant_name: localStorage.getItem('restaurantName') || "",
    });
    const [message, setMessage] = useState('');
    const restaurantId = localStorage.getItem("restaurantId"); // Replace with the actual restaurant ID

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/restaurant_page/${restaurantId}/reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
            } else {
                setMessage('Failed to add reservation');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred');
        }
    };
    if (!restaurantId) {
        return <div>Error: Restaurant ID not found</div>;
    }

    return (
        <div className='reservations'>
            <h2>Make a Reservation</h2>
            <form onSubmit={handleSubmit}>
                <label>Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <br />
                <label>Time:</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                <br />
                <label>Number of People:</label>
                <input type="number" name="number_of_people" value={formData.number_of_people} onChange={handleChange} required />
                <br />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReservationPage;
