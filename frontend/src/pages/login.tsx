import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import { useAuth } from '../authContext'; // Ensure this path is correct

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Get auth context
  console.log("Rendering login page")

  useEffect(() => {
    if (user) {
      console.log("User is already logged in", user)
      navigate('/');
    }
  }, [user, navigate]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Both fields are required');
      return;
    }

    const loginData = { username, password };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', data.user.id); // Store user_id in localStorage
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('role', data.user.role);
        console.log(data.user.id);

        login(data.user.username, data.user.role); // Use login function from context

        if (data.user.role === 'admin') {
          navigate('/pages/adminPage');
        } else if (data.user.role === 'manager') {
          navigate('/pages/managerPage');
        } else {
          navigate('/pages/user-profile'); // Redirect to the user profile page after login
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <label>Username: <span className="required">*</span></label>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={handleUsernameChange} 
        />
        <label>Password: <span className="required">*</span></label>
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={handlePasswordChange} 
        />
        <button type="submit">Login</button>
      </form>
      <button className='back-button' onClick={() => window.history.back()}>Back</button>
    </div>
  );
};

export default Login;
