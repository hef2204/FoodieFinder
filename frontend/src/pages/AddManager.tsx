import React from 'react';
import '../css/AddManager.css';


class AddManager extends React.Component {
    state = {
        username: '',
        full_name: '',
        password: '',
        email: '',
        phone_number: '',
        restaurantId: '',
        error: null,
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    addManager = () => {
        const { username, full_name, password, email, phone_number, restaurantId } = this.state;
        if (!username || !full_name || !password || !email || !phone_number || !restaurantId) {
            this.setState({ error: 'All fields are required' });
            return;
        }
        const managerData = {
            username,
            full_name,
            password,
            email,
            phone_number,
            restaurantId
        };
    
        const token = localStorage.getItem('token');
        fetch('http://127.0.0.1:5000/manager/add_manager', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(managerData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                this.setState({ error: data.message });
            } else {
                console.log(data);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
    
    render() {
        return (
            <div className="AddManagerContainer" >
                <div className="form">
                    <h1>Add Manager</h1>
                    <label>UserName: <span className="required">*</span></label>
                    <input className="input-field" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                    <label>FullName: <span className="required">*</span></label>
                    <input className="input-field" name="full_name" value={this.state.full_name} onChange={this.handleChange} placeholder="Full Name" />
                    <label>Password: <span className="required">*</span></label>
                    <input className="input-field" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                    <label>Email: <span className="required">*</span></label>
                    <input className="input-field" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
                    <label>Phone Number: <span className="required">*</span></label>
                    <input className="input-field" name="phone_number" value={this.state.phone_number} onChange={this.handleChange} placeholder="Phone Number" />
                    <button className="button" onClick={this.addManager}>Add Manager</button>
                    {this.state.error && <p className="error-message">{this.state.error}</p>}
                </div>
                <button className='back-button' onClick={() => window.history.back()}>back</button>
                
            </div>
        );
        
    }
}

export default AddManager;