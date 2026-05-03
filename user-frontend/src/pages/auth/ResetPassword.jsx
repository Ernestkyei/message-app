import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import endpoints from '@/config/endpoints';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!token) {
            setValidToken(false);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match', { position: "top-center", duration: 3000 });
            return;
        }
        
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters', { position: "top-center", duration: 3000 });
            return;
        }
        
        setLoading(true);
        
        try {
            // Using centralized endpoint
            const response = await axios.post(endpoints.auth.resetPassword(token), { password });
            
            if (response.data.success) {
                setSubmitted(true);
                toast.success('Password reset successful! Redirecting to login...', {
                    position: "top-center",
                    duration: 3000,
                });
                
                setTimeout(() => {
                    navigate('/auth/login');
                }, 3000);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Something went wrong';
            
            if (message.includes('expired') || message.includes('invalid')) {
                setValidToken(false);
            }
            
            toast.error(message, { position: "top-center", duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    if (!validToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-blue-400/20">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid or Expired Link</h2>
                    <p className="text-blue-200 mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Link to="/auth/forgot-password">
                        <Button className="bg-white/20 hover:bg-white/30 text-white">
                            Request New Link
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-blue-400/20">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
                    <p className="text-blue-200 mb-6">
                        Your password has been successfully reset.
                    </p>
                    <p className="text-blue-300 text-sm">
                        Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-lg opacity-70" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create New Password</h1>
                    <p className="text-blue-200 text-sm mt-2">
                        Enter your new password below
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/20">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Lock className="w-4 h-4 text-blue-300" />
                            </div>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New password"
                                className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-10 text-white placeholder:text-blue-300 focus:bg-blue-900/50"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="group relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Lock className="w-4 h-4 text-blue-300" />
                            </div>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-4 text-white placeholder:text-blue-300 focus:bg-blue-900/50"
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Resetting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Reset Password</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;