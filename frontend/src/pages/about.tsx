import { useNavigate } from 'react-router-dom';
import '../css/about.css';

const About = () => {
    const isLoggedIn = localStorage.getItem('token');
    const navigate = useNavigate();
    return (
        <div>
            <h1>About US</h1>
            <p className='About'>
            "Welcome to FoodieFinder - your ultimate dining companion!
            Easily discover restaurants based on location, cuisine, kosher status, prices, and ratings. 
            You can also make reservations, order takeout, and even get discounts.
            With FoodieFinder, you can find the perfect restaurant for any occasion,
            whether it's a casual lunch, a romantic dinner, or a special celebration.
            Download the app today and start exploring the best dining options in your area!"
            </p>
            <button className='back-button' onClick={() => window.location.href = '/'}>back</button>
            <div className="AboutLink-container">
            {!isLoggedIn && (
                <>
                    <button onClick={() => navigate("/pages/login")}>Login</button>
                    <button onClick={() => navigate("/pages/register")}>Register</button>
                </>
            )}
            </div>
        </div>
    );
};

export default About;