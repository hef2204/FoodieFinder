import React from 'react';
import '../css/AddManager.css'; 


interface State {
    username: string;
    full_name: string;
    password: string;
    email: string;
    phone_number: string; // Keep this as string for input handling
    restaurantId: string;
    error: string | null;
}

class AddManager extends React.Component<Record<string, never>, State> {
    state: State = {
        username: '',
        full_name: '',
        password: '',
        email: '',
        phone_number: '',
        restaurantId: '',
        error: null,
    };

    

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
    
        if (name === 'password' && value.includes(' ')) {
            this.setState({ error: 'Password cannot contain spaces' });
        } else if (name === 'phone_number' && !/^\d+$/.test(value)) {
            this.setState({ error: 'Phone number must contain only numbers' });
        } else {
            this.setState({ [name]: value, error: null } as Pick<State, keyof State>);
        }
    };

    validateFields = () => {
        const { username, full_name, password, email, phone_number } = this.state;

        if (!username) {
            this.setState({ error: 'Username is required' });
            return false;
        }
        if (!full_name) {
            this.setState({ error: 'Full name is required' });
            return false;
        }
        if (!password) {
            this.setState({ error: 'Password is required' });
            return false;
        }
        if (password.includes(' ')) {
            this.setState({ error: 'Password cannot contain spaces' });
            return false;
        }
        if (!email) {
            this.setState({ error: 'Email is required' });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ error: 'Invalid email format' });
            return false;
        }
        if (!phone_number) {
            this.setState({ error: 'Phone number is required' });
            return false;
        }
        if (isNaN(Number(phone_number))) {
            this.setState({ error: 'Phone number must be a valid number' });
            return false;
        }
        if (phone_number.length < 7 || phone_number.length > 10) {
            this.setState({ error: 'Phone number must be between 7 and 10 digits' });
            return false;
        }
        return true;

        
    };

    addManager = async () => {
        if (!this.validateFields()) {
            return;
        }

        const { username, full_name, password, email, phone_number } = this.state;

        const managerData = {
            username,
            full_name,
            password,
            email,
            phone_number,
        };

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://127.0.0.1:5000/manager/add_manager', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(managerData),
            });

            if (!response.ok) {
                const data = await response.json();
                this.setState({ error: data.message });
                window.alert('Failed to add manager: ' + data.message); // Display failure message
            } else {
                this.setState({
                    username: '',
                    full_name: '',
                    password: '',
                    email: '',
                    phone_number: '',
                    error: null,
                });
                window.alert('Manager added successfully!');
                
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: 'An error occurred' });
            window.alert('An error occurred while adding the manager'); // Display error message
        }
    };

    render() {
        const { username, full_name, password, email, phone_number, error } = this.state;
        return (
            <div className="AddManagerContainer">
                <div className="form">
                    <h1>Add Manager</h1>
                    <label>Username: <span className="required">*</span></label>
                    <input className="input-field" name="username" value={username} onChange={this.handleChange} placeholder="Username" />
                    <label>FullName: <span className="required">*</span></label>
                    <input className="input-field" name="full_name" value={full_name} onChange={this.handleChange} placeholder="Full Name" />
                    <label>Password: <span className="required">*</span></label>
                    <input className="input-field" type='password' name="password" value={password} onChange={this.handleChange} placeholder="Password" />
                    <label>Email: <span className="required">*</span></label>
                    <input className="input-field" name="email" value={email} onChange={this.handleChange} placeholder="Email" />
                    <label>Phone Number: <span className="required">*</span></label>
                    <input className="input-field" name="phone_number" value={phone_number} onChange={this.handleChange} placeholder="Phone Number" />
                    <button className="button" onClick={this.addManager}>Add Manager</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
                <button className='back-button' onClick={() => window.history.back()}>back</button>
            </div>
        );
    }
}

export default AddManager;
