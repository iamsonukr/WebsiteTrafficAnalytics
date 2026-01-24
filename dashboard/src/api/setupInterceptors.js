import {
    healthService,
} from "./axios";

export const setupInterceptors = (auth, setAuth) => {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {    
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    const logout = () => {
        console.log("Logging out user due to auth failure");
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("RefreshToken");
        setAuth(null);
        if(window.location.href !== '/login'){
                        window.location.href !== '/login'
                    }
      
    };

    const setupServiceInterceptor = (service, serviceName) => {
        console.log(`Setting up interceptor for ${serviceName}`);
        service.interceptors.response.use(
            (res) => res,
            async (err) => {
                console.log(`Error in ${serviceName} interceptor:`, err);
                const originalRequest = err.config;
                if (err.response?.status === 401 && !originalRequest._retry) {
                    logout()
                    
                    
                                        
                    // console.log("401 error detected, attempting token refresh");
                    // const refreshToken = localStorage.getItem("RefreshToken");
                    // if (!refreshToken) {
                    //     console.log("No refresh token available, redirecting to login");
                    //     logout();
                    //     return Promise.reject(err);
                    // }
                    // originalRequest._retry = true;
                    // if (isRefreshing) {
                    //     console.log("Already refreshing, adding to queue");
                    //     return new Promise((resolve, reject) => {
                    //         failedQueue.push({
                    //             resolve: (token) => {
                    //                 originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    //                 resolve(service(originalRequest));
                    //             },
                    //             reject: (err) => reject(err),
                    //         });
                    //     });
                    // }
                    // isRefreshing = true;
                    // try {
                    //     console.log("Attempting to refresh token with:", refreshToken);
                        
                    //     const response = await healthService.post(
                    //         "/user/refresh-access-token",
                    //         {
                    //             refreshToken: refreshToken,
                    //         }
                    //     );

                    //     console.log("Refresh token response:", response);

                    //     if (response?.data?.data?.token && response?.data?.data?.refreshToken) {
                    //         const newAccessToken = response.data.data.token;
                    //         const newRefreshToken = response.data.data.refreshToken;

                    //         console.log("Token refresh successful");

                    //         localStorage.setItem("AccessToken", newAccessToken);
                    //         localStorage.setItem("RefreshToken", newRefreshToken);

                    //         setAuth((prev) => ({
                    //             ...prev,
                    //             refreshToken: newRefreshToken,
                    //             accessToken: newAccessToken,
                    //         }));

                    //         processQueue(null, newAccessToken);
                            
                    //         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    //         return service(originalRequest);
                    //     } else {
                    //         throw new Error("Invalid refresh token response");
                    //     }

                    // } catch (refreshError) {
                    //     console.log("Refresh token failed:", refreshError);
                        
                    //     if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                    //         console.log("Refresh token expired or invalid");
                    //     }

                    //     processQueue(refreshError, null);
                    //     logout();
                    //     return Promise.reject(refreshError);

                    // } finally {
                    //     isRefreshing = false;
                    // }
                }
                
                return Promise.reject(err);
            }
        );
    };

    setupServiceInterceptor(healthService, "healthService");
};