import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '@/services/api';
import { endpoints } from '@/config/endpoints';
import useAuthStore from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
    const [page, setPage] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        // Validation
        if (!form.email || !form.password) {
            const message = 'Email and password are required';
            setError(message);
            toast.error(message, { position: "top-center", duration: 3000 });
            return;
        }

        if (page === 'register' && !form.name) {
            const message = 'Full name is required';
            setError(message);
            toast.error(message, { position: "top-center", duration: 3000 });
            return;
        }

        if (page === 'register' && !agreeTerms) {
            const message = 'Please agree to the Terms of Service and Privacy Policy';
            setError(message);
            toast.error(message, { position: "top-center", duration: 3000 });
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;

            if (page === 'login') {
                response = await api.post(endpoints.auth.login, {
                    email: form.email,
                    password: form.password
                });
            } else {
                response = await api.post(endpoints.auth.register, form);
            }

            const { data } = response;
            setUser(data.user, data.token);
            
            // Show success toast - duration 3000 (3 seconds)
            toast.success(
                page === 'login'
                    ? 'Login successful! 🎉'
                    : 'Account created successfully! 🚀',
                {
                    position: "top-center",
                    duration: 3000,
                }
            );
            
            // Navigate after toast
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Something went wrong';

            setError(message);
            
            // Clear error after 5 seconds
            setTimeout(() => {
                setError('');
            }, 5000);
            
            setLoading(false);
        }
    };

    return (
        <>
            {/* Main Login Form */}
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
                            {page === "login" ? "Welcome back! Let's get you signed in" : "Join us and start connecting"}
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20 transition-all duration-300 hover:shadow-blue-500/30">
                        {/* Tab Switcher */}
                        <div className="flex gap-2 bg-blue-900/30 rounded-xl p-1 mb-8">
                            {["login", "register"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => {
                                        setPage(p);
                                        setError('');
                                    }}
                                    className={`
                                        flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-300
                                        ${page === p
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                            : 'text-blue-200 hover:text-white hover:scale-105'
                                        }
                                    `}
                                >
                                    {p === "login" ? "Sign In" : "Create Account"}
                                </button>
                            ))}
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-in slide-in-from-top-2 duration-200">
                                <p className="text-red-300 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-5">
                            {page === "register" && (
                                <div className="group relative animate-in slide-in-from-left-2 duration-300">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-transform group-focus-within:scale-110">
                                        <User className="w-4 h-4 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                                    </div>
                                    <Input
                                        name="name"
                                        value={form.name}
                                        onChange={handle}
                                        placeholder="Full name"
                                        className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-4 text-sm text-white placeholder:text-blue-300 focus:bg-blue-900/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 outline-none focus:scale-105"
                                    />
                                </div>
                            )}

                            <div className="group relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-transform group-focus-within:scale-110">
                                    <Mail className="w-4 h-4 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                                </div>
                                <Input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handle}
                                    placeholder="Email address"
                                    className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-4 text-sm text-white placeholder:text-blue-300 focus:bg-blue-900/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 outline-none focus:scale-105"
                                />
                            </div>

                            <div className="group relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-transform group-focus-within:scale-110">
                                    <Lock className="w-4 h-4 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                                </div>
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handle}
                                    placeholder="Password"
                                    className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-10 text-sm text-white placeholder:text-blue-300 focus:bg-blue-900/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 outline-none focus:scale-105"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-all duration-300 hover:scale-110"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {page === "login" && (
                                <div className="flex justify-end">
                                    <Link 
                                        to="/auth/forgot-password" 
                                        className="text-xs text-blue-300 hover:text-blue-200 font-medium transition-all duration-300 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            )}

                            {page === "register" && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-900/20">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="w-4 h-4 rounded border-blue-400/30 bg-blue-900/50 text-blue-500 focus:ring-blue-400 focus:ring-2 cursor-pointer transition-all duration-200 hover:scale-110"
                                    />
                                    <label htmlFor="terms" className="text-xs text-blue-200 transition-colors hover:text-white">
                                        I agree to the{' '}
                                        <span className="text-blue-200 font-medium hover:text-white cursor-pointer hover:underline">
                                            Terms of Service
                                        </span>
                                        {' '}and{' '}
                                        <span className="text-blue-200 font-medium hover:text-white cursor-pointer hover:underline">
                                            Privacy Policy
                                        </span>
                                    </label>
                                </div>
                            )}

                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>{page === "login" ? "Sign In" : "Create Account"}</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </Button>
                        </div>

                        {/* Switch Account Type */}
                        <div className="text-center mt-6 pt-4 border-t border-blue-400/20">
                            <p className="text-sm text-blue-200">
                                {page === "login" ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setPage(page === "login" ? "register" : "login");
                                        setError('');
                                        setAgreeTerms(false);
                                    }}
                                    className="text-white font-semibold hover:text-blue-200 transition-all duration-300 hover:underline hover:scale-105 inline-block"
                                >
                                    {page === "login" ? "Create one now" : "Sign in instead"}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-blue-300 mt-6">
                        By continuing, you agree to our Terms and Privacy Policy
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;