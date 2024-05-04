import React from 'react';



class AddManagerAndRestaurant extends React.Component {
    state = {
        // Manager state
        username: '',
        full_name: '',
        password: '',
        email: '',
        restaurant: '',
        phone_number: '',
        // Restaurant state
        name: '',
        location: '',
        phone_number_restaurant: '',
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

    addManagerAndRestaurant = () => {
        const manager = {
            username: this.state.username,
            full_name: this.state.full_name,
            password: this.state.password,
            email: this.state.email,
            restaurant: this.state.restaurant,
            phone_number: this.state.phone_number
        };

        const restaurant = {
            name: this.state.name,
            location: this.state.location,
            phone_number: this.state.phone_number_restaurant,
            type: this.state.type,
            Kosher: this.state.Kosher,
            order_table: this.state.order_table,
            Availability: this.state.Availability,
            discounts: this.state.discounts
        };

        const body = {
            manager,
            restaurant
        };

        fetch('http://127.0.0.1:5000/admin/add_manager_and_restaurant', {
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
                    <h1>Add Manager and Restaurant</h1>
                    {/* Start of Manager form fields */}
                    <h2>Manager Details</h2>
                    <input className="input-field" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                    <input className="input-field" name="full_name" value={this.state.full_name} onChange={this.handleChange} placeholder="Full Name" />
                    <input className="input-field" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                    <input className="input-field" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
                    <input className="input-field" name="restaurant" value={this.state.restaurant} onChange={this.handleChange} placeholder="Restaurant" />
                    <input className="input-field" name="phone_number" value={this.state.phone_number} onChange={this.handleChange} placeholder="Phone Number" />

                    <h2>Restaurant Details</h2>
                    <input className="input-field" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
                    <input className="input-field" name="location" value={this.state.location} onChange={this.handleChange} placeholder="Location" />
                    <input className="input-field" name="phone_number_restaurant" value={this.state.phone_number_restaurant} onChange={this.handleChange} placeholder="Phone Number" />
                    <input className="input-field" name="type" value={this.state.type} onChange={this.handleChange} placeholder="Type" />
                    <input className="input-field" name="Kosher" value={this.state.Kosher} onChange={this.handleChange} placeholder="Kosher" />
                    <input className="input-field" name="order_table" value={this.state.order_table} onChange={this.handleChange} placeholder="Order Table" />
                    <input className="input-field" name="Availability" value={this.state.Availability} onChange={this.handleChange} placeholder="Availability" />
                    <input className="input-field" name="discounts" value={this.state.discounts} onChange={this.handleChange} placeholder="Discounts" />
                    {/* End of Restaurant form fields */}
                    
                    <button className="button" onClick={this.addManagerAndRestaurant}>Add Manager and Restaurant</button>
                </div>
                <button className='back-button' onClick={() => window.history.back()}>back</button>
            </div>
        );
    }
}

export default AddManagerAndRestaurant;