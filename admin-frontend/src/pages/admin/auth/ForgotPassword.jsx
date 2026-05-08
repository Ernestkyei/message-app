// admin-frontend/src/pages/admin/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';
import api from '@/service/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            
            if (response.data.success) {
                setIsEmailSent(true);
                toast.success('Reset link sent to your email!');
            }
        } catch (error) {
            // Don't reveal if email exists for security
            toast.error('If an account exists with this email, you will receive a reset link.');
            setIsEmailSent(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('Reset link resent! Check your email.');
        } catch (error) {
            toast.error('Failed to resend. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-70" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {!isEmailSent 
                            ? "Enter your email to receive a reset link"
                            : "Check your email for the reset link"}
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                    {!isEmailSent ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="w-full h-12 rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Reset Link</span>
                                    </>
                                )}
                            </button>

                            {/* Back to Login */}
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-5">
                            {/* Success Icon */}
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-green-400" />
                                </div>
                            </div>
                            
                            {/* Success Message */}
                            <div className="space-y-2">
                                <p className="text-white font-medium">
                                    We sent a reset link to:
                                </p>
                                <p className="text-blue-400 font-semibold break-all">
                                    {email}
                                </p>
                                <p className="text-gray-400 text-sm mt-4">
                                    Click the link in the email to reset your password.
                                    The link will expire in 1 hour.
                                </p>
                            </div>

                            {/* Resend Button */}
                            <button
                                onClick={handleResend}
                                disabled={isLoading}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                {isLoading ? 'Sending...' : "Didn't receive email? Resend"}
                            </button>

                            {/* Back to Login */}
                            <div className="pt-2">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Text */}
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-xs">
                        For security reasons, we only send reset links to verified email addresses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;