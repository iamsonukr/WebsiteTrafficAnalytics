import { createContext, useContext, useEffect, useState } from "react";
import { healthService } from "../api/axios";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        profileImage: "", // Removed duplicate
        subscriptionId: "", 
        email: "",
        password: "",   
        phoneNumber: "",
        bio: "",
        hindiBio:"",
        hindiUsername:"",
        frameOne:"",
        frameTwo:"",
        frameThree:"",
        activeFrame:"",
    });

    const [subscriptionData, setSubscriptionData] = useState(null);
    const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false);

    const [AccessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('AccessToken') || '';
    });

    const [UserRole, setUserRole] = useState(() => {
        return localStorage.getItem('UserRole') || '';
    });

    const [auth, setAuth] = useState(() => {
        const accessToken = localStorage.getItem('AccessToken');
        const userRole = localStorage.getItem('UserRole');
        return accessToken ? { accessToken, userRole } : null;
    });

    // PROFILE DATA
    const fetchProfileData = async () => {
        try {
            const response = await healthService.get('/user/profile-detail');
            console.log(response);
            setProfileData(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    // PROFILE DATA
    const fetchSubscriptionData = async () => {
        // try {
        //     const response = await healthService.get('/subscription-mapping/user/subscription-mapping');
        //     console.log(response);
        //     setProfileData(response.data.data);
        //     setSubscriptionData(response.data.data.subscriptionMapping[0]);
            
        //     // Convert ISO string to Date object for proper comparison
        //     const endDate = new Date(response.data.data.subscriptionMapping[0].endDate);
        //     const currentDate = new Date();
            
        //     console.log("Subscription end date: ", endDate);
        //     console.log("Current date: ", currentDate);
            
        //     // Compare dates: if endDate is in the future, subscription is active
        //     if(endDate > currentDate){
        //         setIsSubscriptionExpired(false);
        //     }else{
        //         setIsSubscriptionExpired(true);
        //     }
           
        //     console.log("This is auth details",response.data.data.subscriptionMapping[0]);
            
        // } catch (error) {
        //     console.log(error);
        // }
    };

    // Login function
    const login = (token, role) => {
        setAccessToken(token);
        setUserRole(role);
    };

    // Logout function
    const logout = () => {
        setAccessToken('');
        setUserRole('');
        localStorage.removeItem('AccessToken');
        localStorage.removeItem('UserRole');
        setAuth(null);
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!AccessToken;
    };

    // Check if user has specific role
    const hasRole = (requiredRole) => {
        return UserRole === requiredRole;
    };

    useEffect(() => {
        console.log("Fetching profile data");
        fetchProfileData();
    }, [AccessToken]); // Added dependency - fetch profile when token changes

    // Sync localStorage when state changes
    useEffect(() => {
        if (AccessToken) {
            localStorage.setItem('AccessToken', AccessToken);
        } else {
            localStorage.removeItem('AccessToken');
        }
    }, [AccessToken]);

    useEffect(() => {
        if (UserRole) {
            localStorage.setItem('UserRole', UserRole);
        } else {
            localStorage.removeItem('UserRole');
        }
    }, [UserRole]);

    // Update auth object when AccessToken or UserRole changes
    useEffect(() => {
        if (AccessToken && UserRole) {
            setAuth({ accessToken: AccessToken, userRole: UserRole });
        } else {
            setAuth(null);
        }
        fetchSubscriptionData();
    }, [AccessToken, UserRole]);

    // Setup interceptors when auth changes
    useEffect(() => {
        if (auth) {
            console.log("Interceptor is being setup");
            // Uncomment when you have setupInterceptors function
            // setupInterceptors(auth, setAuth);
        }
    }, [auth]);

  

    const values = {
        AccessToken,
        setAccessToken,
        UserRole,
        setUserRole,
        auth,
        setAuth,
        login,
        logout,
        isAuthenticated,
        hasRole,
        profileData,
        setProfileData,
        subscriptionData,
        fetchSubscriptionData,
        isSubscriptionExpired
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;