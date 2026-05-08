// admin-frontend/src/pages/admin/auth/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import api from '@/service/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    // Debug: Log token when component loads
    useEffect(() => {
        console.log('=== ResetPassword Component Loaded ===');
        console.log('Token from URL params:', token);
        console.log('Full URL:', window.location.href);
        console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:4000/api');
        
        if (!token) {
            console.error('No token found in URL!');
            toast.error('Invalid reset link. Missing token.');
        } else {
            console.log('Token length:', token.length);
            console.log('Token first 10 chars:', token.substring(0, 10) + '...');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('=== Form Submitted ===');
        console.log('Password length:', password.length);
        console.log('Confirm password length:', confirmPassword.length);
        console.log('Passwords match:', password === confirmPassword);

        if (!password || !confirmPassword) {
            toast.error('Please enter both password fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const url = `/auth/reset-password/${token}`;
            console.log('Making API call to:', url);
            console.log('Request body:', { password: '***hidden***' });
            
            const response = await api.post(url, {
                password
            });
            
            console.log('API Response:', response.data);
            console.log('Response success:', response.data.success);

            if (response.data.success) {
                setIsSuccess(true);
                toast.success('Password reset successfully!');
                
                setTimeout(() => {
                    console.log('Redirecting to login...');
                    navigate('/login');
                }, 3000);
            } else {
                toast.error(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('=== API Error ===');
            console.error('Error object:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            console.error('Error message:', error.message);
            
            toast.error(error.response?.data?.message || 'Invalid or expired reset link');
        } finally {
            setIsLoading(false);
        }
    };

    // Success screen
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Password Reset Success!</h2>
                        <p className="text-gray-400 mb-6">
                            Your password has been reset successfully. Redirecting to login...
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Reset password form
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-70" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create New Password</h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Enter your new password below
                    </p>
                    {token && (
                        <p className="text-xs text-gray-500 mt-2 break-all">
                            Token: {token.substring(0, 20)}...
                        </p>
                    )}
                </div>

                {/* Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full h-12 rounded-xl border border-white/20 bg-white/10 pl-10 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full h-12 rounded-xl border border-white/20 bg-white/10 pl-10 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Requirements */}
                        <div className="text-xs text-gray-400 space-y-1">
                            <p>Password must:</p>
                            <ul className="list-disc list-inside ml-2">
                                <li className={password.length >= 6 ? "text-green-400" : "text-gray-400"}>
                                    Be at least 6 characters
                                </li>
                                <li className={/[A-Z]/.test(password) ? "text-green-400" : "text-gray-400"}>
                                    Contain at least one uppercase letter
                                </li>
                                <li className={/[0-9]/.test(password) ? "text-green-400" : "text-gray-400"}>
                                    Contain at least one number
                                </li>
                            </ul>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    <span>Reset Password</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;