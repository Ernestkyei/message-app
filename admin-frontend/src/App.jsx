import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/admin/auth/Login'; 
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';


function App() {
  const mockToken = localStorage.getItem('mockToken');
  const mockIsAdmin = localStorage.getItem('mockIsAdmin') === 'true';

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={mockToken && mockIsAdmin ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          
        </Route>
        
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;