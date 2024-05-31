import React from 'react';
import '../css/AddManager.css';

interface State {
    username: string;
    full_name: string;
    password: string;
    email: string;
    phone_number: string;
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
        this.setState({ [name]: value } as unknown as Pick<State, keyof State>);
    };

    validateFields = () => {
        const { username, full_name, password, email, phone_number } = this.state;
        if (!username || !full_name || !password || !email || !phone_number ) {
            this.setState({ error: 'All fields are required' });
            return false;
        }
        return true;
    };

    addManager = async () => {
        if (!this.validateFields()) {
            return;
        }

        const { username, full_name, password, email, phone_number, restaurantId } = this.state;

        const managerData = {
            username,
            full_name,
            password,
            email,
            phone_number,
            restaurantId
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
            } else {
                this.setState({
                    username: '',
                    full_name: '',
                    password: '',
                    email: '',
                    phone_number: '',
                    restaurantId: '',
                    error: null,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: 'An error occurred' });
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
                    <input className="input-field" name="password" value={password} onChange={this.handleChange} placeholder="Password" />
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
