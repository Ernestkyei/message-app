import { Navigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";


const ProtectedRoute = ({children }) =>{
    const {token } = useAuthStore;    
        if(!token){
        return <Navigate to="/auth/login"/>
    }
        return children;
}




export default ProtectedRoute;