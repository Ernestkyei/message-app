import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { endpoints } from '@/config/endpoints';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        
        setLoading(true);
        
        try {
            // Using centralized API endpoint
            const response = await api.post(endpoints.auth.forgotPassword, { email });
            
            if (response.data.success) {
                setSubmitted(true);
                toast.success('Password reset link sent to your email!', {
                    position: "top-center",
                    duration: 4000,
                });
            }
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || 'Something went wrong';
            
            // Handle rate limiting (429)
            if (status === 429) {
                setError('Too many requests. Please wait 15 minutes before trying again.');
            } else {
                setError(message);
            }
            
            // Clear error after 5 seconds
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-blue-400/20">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                    <p className="text-blue-200 mb-4">
                        We've sent a password reset link to:
                        <br />
                        <strong className="text-white">{email}</strong>
                    </p>
                    <p className="text-blue-300 text-sm mb-6">
                        This link will expire in 10 minutes.
                    </p>
                    <Link to="/auth/login">
                        <Button className="bg-white/20 hover:bg-white/30 text-white">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background circles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white opacity-5 animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white opacity-5 animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Brand */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-lg opacity-70 animate-pulse" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 duration-300">
                                <Sparkles className="w-8 h-8 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        Message App
                    </h1>
                    <p className="text-white/80 text-sm mt-2">
                        Enter your email to reset your password
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20 transition-all duration-300 hover:shadow-blue-500/30">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-in slide-in-from-top-2 duration-200">
                            <p className="text-red-300 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-transform group-focus-within:scale-110">
                                <Mail className="w-4 h-4 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                            </div>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-4 text-sm text-white placeholder:text-blue-300 focus:bg-blue-900/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 outline-none focus:scale-105"
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </div>
                        </Button>
                    </form>

                    <div className="text-center mt-6 pt-4 border-t border-blue-400/20">
                        <Link 
                            to="/auth/login" 
                            className="text-sm text-blue-300 hover:text-white transition-all duration-300 hover:underline inline-block"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-blue-300 mt-6">
                    We'll send you a link to reset your password
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;