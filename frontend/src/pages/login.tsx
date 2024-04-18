import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/login.css"
import { useNavigate } from 'react-router-dom';





export type LoginProps = {
    onLogin: (username: string, role: string) => void;
};

const Login: React.FC<LoginProps> = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

   


    const handleSubmit = async (e: React.FormEvent) => {
        console.log('Form submitted');
        e.preventDefault();

        if (!username || !password) {
            console.log('Both fields are required');
            setError('Both fields are required');
            
            return
        }



        const loginData = {
            username,
            password
        };

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.status === 200) {
                console.log('Login successful');
            } else {
                console.log('Login failed');
                setError('Login failed');
            }
         

            const data = await response.json();
            console.log('response data:', data);
            onLogin(username, data.user.role); 

            // Redirect to the home page
            if (data.user.role === 'manager') {
                    navigate('/pages/managerPage');
            } else if (data.user.role === 'user') {
                navigate('/pages/userPage');
            } else if (data.user.role === 'admin') {
                navigate('/pages/adminPage');
            }
                
            


        } catch (error) {
            console.error(error);
            setError((error as Error).message);
        }
        

    };

    return (
        <div>
            <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            {error && <div>{error}</div>}
            <input type="text" placeholder="Username" value={username} onChange={handleEmailChange} />
            <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
            <button type="submit">Login</button>
        </form>
        <button className='back-button' onClick={() => window.location.href = '/'}>back</button>
            <div className="link-container2">
                <Link to="/pages/about">About</Link>
            </div>

        </div>
        
    );
};

export default Login;