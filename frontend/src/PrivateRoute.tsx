import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ children, ...rest }: any) {
    const userRole = localStorage.getItem('role'); // Get user role from local storage

    return (
        <Route
            {...rest}
            render={({ location }) =>
                userRole === 'manager' ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}