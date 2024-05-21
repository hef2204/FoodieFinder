import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate} from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import './css/homepage.css';
import AdminPage from './pages/adminPage.tsx'; 
import { UserProvider } from './UserContext';
import AddManager from './pages/AddManager';
import AddRestaurant from './pages/AddRestaurant';
import RestaurantPage from './pages/restaurantPage.tsx';
import UsersTable from './pages/UsersTable.tsx';
import  AddManagerAndRestaurant from './pages/add_manager_restaurant.tsx';
import RestaurantDetailPage from './pages/RestaurantDetailPage.tsx';
import UpdateRestaurantPage from './pages/RestaurantUpdateForm.tsx';
import { Button } from 'react-bootstrap';
import UserProfile from './pages/user-profile.tsx';
import ManagersTable from './pages/ManagersTable.tsx';
import ManagerPage from './pages/ManagerPage.tsx';
import AddMenuItem from './pages/UpdateMenu.tsx';
import ResultsPage from './ResultsPage.tsx';
import AddAdmin from './pages/AddAdmin.tsx';
import ReservationPage from './pages/ReservationPage.tsx';
import UserReservationPage from './pages/UserReservationPage.tsx';
import ManagerReservationPage from './pages/ManagerReservationPage.tsx';






function HomePage() {
    const [user, setUser] = useState<{ username: string, role: string } | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (username && role) {
            setUser({ username, role });
        }
    }, []);

   

    return (
        <div>
    <div className='header'>
        <h1>Foodie Finder</h1>
        {user && user.role === 'user' ? (
            <p>Welcome, {user.username}! Find the best food in town!</p>
        ) : (
            <p>Find the best food in town!</p>
        )}
    </div>
    <div className="link-container">
        {user ? (
            <>
                <Button onClick={() => {
                    localStorage.clear();
                    setUser(null);
                    navigate("/")
                    }}>Logout</Button>
                <Link to="/pages/restaurantPage">Restaurants</Link> 
                {user.role === 'admin' && <Link to="/pages/adminPage">Admin Page</Link>}
                {user.role === 'manager' && <Link to="/pages/managerPage">Profile</Link>}
                {user.role === 'user' && <Link to="/pages/user-profile">Profile</Link>}
            </>
        ) : (
            <>
                <Link to="/pages/login">Login</Link>
                <Link to="/pages/register">Register</Link>
            </>
        )}
        <Link to="/pages/about">About</Link>
    </div>
</div>
    );
}


export default function App() {
     return (
        
        <BrowserRouter>
            <Helmet>
                <title>FoodieFinder</title>
            </Helmet>
            <UserProvider>
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages/login" element={<Login />} />
                <Route path="/pages/register" element={<Register />} />
                <Route path="/pages/about" element={<About />} />
                <Route path="/pages/adminPage" element={<AdminPage />} />
                <Route path="/restaurant/:id/update" element={<UpdateRestaurantPage />} />
                <Route path="/pages/AddManager" element={<AddManager />} />
                <Route path="/pages/AddRestaurant" element={<AddRestaurant />} />
                <Route path="/pages/restaurantPage" element={<RestaurantPage />} />
                <Route path="/pages/users" element={<UsersTable />} />
                <Route path="/pages/add_manager_restaurant" element={<AddManagerAndRestaurant />} />
                <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                <Route path="/pages/user-profile" element={<UserProfile />} />
                <Route path="/pages/ManagersTable" element={<ManagersTable />} />
                <Route path="/pages/managerPage" element={<ManagerPage />} />
                <Route path="/restaurant/:id/menu" element={<AddMenuItem />} />
                <Route path="/pages/results" element={<ResultsPage />} />
                <Route path='/pages/RestaurantUpdateForm' element={<UpdateRestaurantPage />} />
                <Route path="/pages/AddAdmin" element={<AddAdmin />} />
                <Route path="/restaurant/:id/reservation" element={<ReservationPage />} />
                <Route path="/pages/UserReservationPage" element={<UserReservationPage />} />
                <Route path="/pages/ManagerReservationPage" element={<ManagerReservationPage />} />
                
                </Routes>
            </UserProvider>
        </BrowserRouter>
    
);
}
