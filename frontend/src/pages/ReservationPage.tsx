import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ReservationPage.css'; // Import the CSS

const ReservationPage: React.FC = () => {
    const [formData, setFormData] = useState({
        user_id: localStorage.getItem('user_id') || "", 
        date: '',
        time: '',
        number_of_people: '1', // Set default value to 1
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

    const isDateTimeInPast = (date: string, time: string) => {
        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        return selectedDateTime < now;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isDateTimeInPast(formData.date, formData.time)) {
            setMessage('Selected date and time are in the past. Please choose a valid date and time.');
            window.alert('Selected date and time are in the past. Please choose a valid date and time.');
            return;
        }

        if (parseInt(formData.number_of_people) <= 0) {
            setMessage('Number of people must be at least 1.');
            window.alert('Number of people must be at least 1.');
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
                window.alert('Reservation added successfully!');
                navigate('/pages/restaurantPage'); // Navigate back to the restaurants list
            } else {
                setMessage('Failed to add reservation');
                window.alert('Failed to add reservation');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred');
            window.alert('An error occurred while adding the reservation');
        }
    };

    if (!restaurantId) {
        return <div>Error: Restaurant ID not found</div>;
    }

    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().split(' ')[0].substring(0, 5); // Format as HH:MM
    };

    return (
        <div className='restaurant-reservations'>
            <h2>Make a Reservation</h2>
            <form onSubmit={handleSubmit}>
                <label>Date:</label>
                <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleChange} 
                    required 
                    min={getCurrentDate()} 
                />
                <br />
                <label>Time:</label>
                <input 
                    type="time" 
                    name="time" 
                    value={formData.time} 
                    onChange={handleChange} 
                    required 
                    min={formData.date === getCurrentDate() ? getCurrentTime() : undefined}
                />
                <br />
                <label>Number of People:</label>
                <input 
                    type="number" 
                    name="number_of_people" 
                    value={formData.number_of_people} 
                    onChange={handleChange} 
                    required 
                    min="1"
                />
                <br />
                <button type="submit">Submit</button>
            </form>
            <div className="back-to-restaurant"> 
                <button onClick={() => navigate('/restaurants')}>Back to Restaurants</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReservationPage;
