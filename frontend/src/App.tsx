import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import AdminPage from './pages/adminPage.tsx';
import AddManager from './pages/AddManager';
import AddRestaurant from './pages/AddRestaurant';
import RestaurantPage from './pages/restaurantPage.tsx';
import UsersTable from './pages/UsersTable.tsx';
import AddManagerAndRestaurant from './pages/add_manager_restaurant.tsx';
import RestaurantDetailPage from './pages/RestaurantDetailPage.tsx';
import UpdateRestaurantPage from './pages/RestaurantUpdateForm.tsx';
import UserProfile from './pages/user-profile.tsx';
import ManagersTable from './pages/ManagersTable.tsx';
import ManagerPage from './pages/ManagerPage.tsx';
import AddMenuItem from './pages/UpdateMenu.tsx';
import AddAdmin from './pages/AddAdmin.tsx';
import ReservationPage from './pages/ReservationPage.tsx';
import UserReservationPage from './pages/UserReservationPage.tsx';
import ManagerReservationPage from './pages/ManagerReservationPage.tsx';
import { AuthProvider, useAuth } from './authContext';
import { Button } from 'react-bootstrap';
import './css/homepage.css';

const ProtectedRoute = ({ element, requiredRole }: { element: JSX.Element; requiredRole?: string }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to="/pages/login" />;
  }

  return element;
};






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
            <AuthProvider>
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages/login" element={<Login />} />
                <Route path="/pages/register" element={<Register />} />
                <Route path="/pages/about" element={<About />} />
                <Route path="/pages/adminPage" element={<ProtectedRoute element={<AdminPage />} requiredRole="admin" />} />
                <Route path="/restaurant/:id/update" element={<ProtectedRoute element={<UpdateRestaurantPage />} requiredRole="manager" />} />
                <Route path="/pages/AddManager" element={<ProtectedRoute element={<AddManager />} requiredRole="admin" />} />
                <Route path="/pages/AddRestaurant" element={<ProtectedRoute element={<AddRestaurant />} requiredRole="admin" />} />
                <Route path="/pages/restaurantPage" element={<ProtectedRoute element={<RestaurantPage />} />} />
                <Route path="/pages/users" element={<ProtectedRoute element={<UsersTable />} requiredRole="admin" />} />
                <Route path="/pages/add_manager_restaurant" element={<ProtectedRoute element={<AddManagerAndRestaurant />} requiredRole="admin" />} />
                <Route path="/restaurant/:id" element={<ProtectedRoute element={<RestaurantDetailPage />} />} />
                <Route path="/pages/user-profile" element={<ProtectedRoute element={<UserProfile />} />} />
                <Route path="/pages/ManagersTable" element={<ProtectedRoute element={<ManagersTable />} requiredRole="admin" />} />
                <Route path="/pages/managerPage" element={<ProtectedRoute element={<ManagerPage />} requiredRole="manager" />} />
                <Route path="/restaurant/:id/menu" element={<ProtectedRoute element={<AddMenuItem />} requiredRole="manager" />} />
                <Route path='/pages/RestaurantUpdateForm'  element={<UpdateRestaurantPage />} />
                <Route path="/pages/AddAdmin" element={<ProtectedRoute element={<AddAdmin />} requiredRole="admin" />} />
                <Route path="/restaurant/:id/reservation" element={<ProtectedRoute element={<ReservationPage />} requiredRole="user" />} />
                <Route path="/pages/UserReservationPage" element={<ProtectedRoute element={<UserReservationPage />} requiredRole="user" />} />
                <Route path="/pages/ManagerReservationPage" element={<ProtectedRoute element={<ManagerReservationPage />} requiredRole="manager" />} />
                </Routes>
            </AuthProvider>
            </BrowserRouter>
    
);
}
