import { Helmet } from 'react-helmet';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import './css/homepage.css';



function HomePage() {
    return (
        <div>
            <div>
                <h1>Foodie Finder</h1>
                <p>Find the best food in town!</p>
            </div>
            <div className="link-container">
                <Link to="/pages/login">Login</Link>
                <Link to="/pages/register">Register</Link>
                <Link to="/pages/about">About</Link>
            </div>
        </div>
    );
}
        

export default function App() {
    const handleLogin = (username: string, role: string) => {
        console.log(`Logged in as ${username} with role ${role}`);
    };
    return (
        <BrowserRouter>
            <Helmet>
                <title>FoodieFinder</title>
            </Helmet>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/pages/register" element={<Register />} />
                <Route path="/pages/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}
