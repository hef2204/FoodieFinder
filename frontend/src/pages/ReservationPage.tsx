import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ReservationPage.css'; // Import the CSS

const ReservationPage: React.FC = () => {
    const [formData, setFormData] = useState({
        user_id: localStorage.getItem('user_id') || "", 
        date: '',
        time: '',
        number_of_people: '',
        restaurant_name: localStorage.getItem('restaurantName') || "",
    });
    const [message, setMessage] = useState('');
    const restaurantId = localStorage.getItem("restaurantId"); 
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isDateInPast = (date: string) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00 to compare only the date part
        return selectedDate < today;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isDateInPast(formData.date)) {
            setMessage('Selected date is in the past. Please choose a valid date.');
            return;
        }

        if (parseInt(formData.number_of_people) <= 0) {
            setMessage('Number of people cannot be 0.');
            return;
        }

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
                navigate('/restaurant/' + restaurantId);
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
        <div className='restaurant-reservations'>
            <h2>Make a Reservation</h2>
            <form  onSubmit={handleSubmit}>
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
            <div className="back-to-restaurant"> 
                <button onClick={() => navigate('/restaurant/' + restaurantId)}>Back to Restaurant</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReservationPage;
