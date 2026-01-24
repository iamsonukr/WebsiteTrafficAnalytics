import { createContext, useContext, useEffect, useState } from "react";
import { healthService } from "../api/axios";
import { useAuth } from "./AuthContext";

const PosterContext = createContext(null);

export const usePoster = () => useContext(PosterContext);

const PosterProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);
    const [posterData, setPosterData] = useState(null);
    const [posterId,setPosterId]=useState('');
    const {UserRole}=useAuth()
    const [cart,setCart]=useState()

    const [error, setError] = useState(null);
    const baseUrl=import.meta.env.VITE_BACKEND_URL || "https://api.PayTrack Analytics.com/api/"
    // const baseUrl='http://localhost:5000/'

const formatImageUrl = (posterPath) => {
  if (!posterPath) return null;

  // Case 1: File object (from <input type="file">)
  if (posterPath instanceof File) {
    return URL.createObjectURL(posterPath);
  }

  // Case 2: String path (from backend / DB)
  const cleanPath = posterPath
    .replace(/\\/g, "/")      // fix Windows backslashes
    .replace(/^uploads\//, "uploads/"); // normalize prefix
    console.log("Retuting this url",`https://api.PayTrack Analytics.com/${cleanPath}`)

  return `https://api.PayTrack Analytics.com/${cleanPath}`;
};


    const fetchTemplates = async (isRefresh = false) => {
        try {
            const response = await healthService.get('/template/admin/scheduled-templates');
            console.log(response);

            if (response?.data?.status === "success") {
                setTemplates(response?.data?.data?.templates);
                console.log(response);
            } else {
                setError('Failed to fetch templates');
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            setError('Error fetching templates');
        }
    };

    useEffect(() => {
        if(UserRole==='admin'){
            fetchTemplates();
        }
    }, [UserRole]);

    // Fix 3: Properly declare the value object
    const value = {
        templates,
        fetchTemplates,
        error,
        baseUrl,
        formatImageUrl,
        posterData,
        setPosterData,
        posterId,
        setPosterId,   
        setCart,
        cart     
    };

    return (
        <PosterContext.Provider value={value}>
            {children}
        </PosterContext.Provider>
    );
};

export default PosterProvider;