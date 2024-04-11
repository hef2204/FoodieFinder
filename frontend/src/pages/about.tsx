import React from 'react';

const About: React.FC = () => {
    return (
        <div>
            <h1>About US</h1>
            <p>Welcome to the FoodieFinder app!</p>
            <p>
            "Welcome to FoodieFinder – your ultimate dining companion!
            Easily discover restaurants based on location, cuisine, kosher status, prices, and ratings. 
            You can also make reservations, order takeout, and even get discounts.
            With FoodieFinder, you can find the perfect restaurant for any occasion,
            whether it’s a casual lunch, a romantic dinner, or a special celebration.
            Download the app today and start exploring the best dining options in your area!"
            </p>
            <button className='back-button' onClick={() => window.location.href = '/'}>back</button>
        </div>
    );
};

export default About;