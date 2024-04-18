import React from 'react';
import '../css/AddRestaurant.css';


class AddRestaurant extends React.Component {
    state = {
        name: '',
        location: '',
        phone_number: '',
        type: '',
        Kosher: '',
        order_table: '',
        Availability: '',
        rating: '',
        discounts: ''
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    addRestaurant = () => {
        const restaurant = {
            name: this.state.name,
            location: this.state.location,
            phone_number: this.state.phone_number,
            type: this.state.type,
            Kosher: this.state.Kosher,
            order_table: this.state.order_table,
            Availability: this.state.Availability,
            discounts: this.state.discounts
        };
        const managerId = ''; // You need to set this to the actual managerId
        const body = {
            restaurant,
            managerId
        };
        fetch('http://127.0.0.1:5000/admin/add_restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })  
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    render() {
        return (
            <div className="container">
                <div className="form">
                    <input className="input-field" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
                    <input className="input-field" name="location" value={this.state.location} onChange={this.handleChange} placeholder="Location" />
                    <input className="input-field" name="phone_number" value={this.state.phone_number} onChange={this.handleChange} placeholder="Phone Number" />
                    <input className="input-field" name="type" value={this.state.type} onChange={this.handleChange} placeholder="Type" />
                    <input className="input-field" name="Kosher" value={this.state.Kosher} onChange={this.handleChange} placeholder="Kosher" />
                    <input className="input-field" name="order_table" value={this.state.order_table} onChange={this.handleChange} placeholder="Order Table" />
                    <input className="input-field" name="Availability" value={this.state.Availability} onChange={this.handleChange} placeholder="Availability" />
                    <input className="input-field" name="discounts" value={this.state.discounts} onChange={this.handleChange} placeholder="Discounts" />
                    <button className="button" onClick={this.addRestaurant}>Add Restaurant</button>
                </div>
                <button className='back-button' onClick={() => window.history.back()}>back</button>
            </div>
        );
    }
}

export default AddRestaurant;