import React from 'react';
import '../css/AddManager.css';


class AddManager extends React.Component {
    state = {
        username: '',
        full_name: '',
        password: '',
        email: '',
        restaurant: '',
        phone_number: ''
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    addManager = () => {
        const manager = this.state;
        fetch('http://127.0.0.1:5000/admin/add_manager', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(manager),
        })  
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
    
    
    render() {
        return (
            <div className="container">
                <div className="form">
                    <h1>Add Manager</h1>
                    <input className="input-field" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                    <input className="input-field" name="full_name" value={this.state.full_name} onChange={this.handleChange} placeholder="Full Name" />
                    <input className="input-field" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                    <input className="input-field" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
                    <input className="input-field" name="restaurant" value={this.state.restaurant} onChange={this.handleChange} placeholder="Restaurant" />
                    <input className="input-field" name="phone_number" value={this.state.phone_number} onChange={this.handleChange} placeholder="Phone Number" />
                    <button className="button" onClick={this.addManager}>Add Manager</button>
                </div>
                <button className='back-button' onClick={() => window.history.back()}>back</button>
            </div>
        );
        
    }
}

export default AddManager;