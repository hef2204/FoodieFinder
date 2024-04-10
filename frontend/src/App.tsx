import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import './css/homepage.css';


function HomePage() {
    return (
        <div>
            <div>
                <h1>Foodie Finder</h1>
                <p>Find the best food in town!</p>
            </div>
            <div className="link-container">
                <Link to="/pages/login'">Login</Link>
                <Link to="/pages/register">Register</Link>
            </div>
        </div>
    );
}
        

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages/login" element={<Login />} />
                <Route path="/pages/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}
