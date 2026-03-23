import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
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
        if (page === 'register' && !agreeTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        setLoading(true);
        setError('');
        try {
            if (page === 'login') {
                const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
                setUser(data.user, data.token);
                navigate('/dashboard');
            } else {
                const { data } = await api.post('/auth/register', form);
                setUser(data.user, data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background circles - matching landing page */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white opacity-5" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white opacity-5" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Brand */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-lg opacity-70 animate-pulse" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        MessageApp
                    </h1>
                    <p className="text-white/80 text-sm mt-2">
                        {page === "login" ? "Welcome back! Let's get you signed in" : "Join us and start connecting"}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20 transition-all duration-300">
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
                                        : 'text-blue-200 hover:text-white'
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
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                    <User className="w-4 h-4 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                                </div>
                                <Input
                                    name="name"
                                    value={form.name}
                                    onChange={handle}
                                    placeholder="Full name"
                                    className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-4 text-sm text-white placeholder:text-blue-300 focus:bg-blue-900/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 outline-none"
                                />
                            </div>
                        )}

                        <div className="group relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <Mail className="w-4 h-4 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                            </div>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handle}
                                placeholder="Email address"
                                className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-4 text-sm text-white placeholder:text-blue-300 focus:bg-blue-900/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 outline-none"
                            />
                        </div>

                        <div className="group relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <Lock className="w-4 h-4 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                            </div>
                            <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handle}
                                placeholder="Password"
                                className="w-full h-12 rounded-xl border border-blue-400/20 bg-blue-900/30 pl-10 pr-10 text-sm text-white placeholder:text-blue-300 focus:bg-blue-900/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {page === "login" && (
                            <div className="flex justify-end">
                                <button className="text-xs text-blue-300 hover:text-blue-200 font-medium transition-colors hover:underline">
                                    Forgot password
                                </button>
                            </div>
                        )}

                        {page === "register" && (
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-900/20">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-blue-400/30 bg-blue-900/50 text-blue-500 focus:ring-blue-400 focus:ring-2 cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-xs text-blue-200">
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
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>{page === "login" ? "Sign In" : "Create Account"}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
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
                                className="text-white font-semibold hover:text-blue-200 transition-colors hover:underline"
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
    );
};

export default Login;