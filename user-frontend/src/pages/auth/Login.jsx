import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import useAuthStore from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [page, setPage] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        console.log('submitting', form)
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

    const inputClass = "border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none w-full";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 flex items-center justify-center p-4 font-sans">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

            {/* Background circles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white opacity-5" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white opacity-5" />
            </div>

            <div className="w-full max-w-md relative">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white bg-opacity-20 inline-flex items-center justify-center mb-3 backdrop-blur-sm">
                        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </div>
                    <div className="text-white font-bold text-2xl">Message App</div>
                    <div className="text-blue-200 text-sm mt-1">
                        {page === "login" ? "Welcome back! Sign in to continue" : "Create your account to get started"}
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl">

                    {/* Tabs */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-7">
                        {["login", "register"].map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                                    page === p
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-slate-500'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="flex flex-col gap-4">
                        {page === "register" && (
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Full Name</label>
                                <Input
                                    name="name"
                                    value={form.name}
                                    onChange={handle}
                                    placeholder="John Doe"
                                    className={inputClass}
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email Address</label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handle}
                                placeholder="Enter  your email address"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                {page === "login" && (
                                    <span className="text-xs text-blue-700 font-medium cursor-pointer">Forgot password?</span>
                                )}
                            </div>
                            {/* Password with eye toggle */}
                            <div className="relative">
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handle}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {page === "register" && (
                            <div className="flex items-start gap-2">
                                <input type="checkbox" id="terms" className="mt-0.5 accent-blue-700" />
                                <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
                                    I agree to the <span className="text-blue-700 font-medium cursor-pointer">Terms of Service</span> and <span className="text-blue-700 font-medium cursor-pointer">Privacy Policy</span>
                                </label>
                            </div>
                        )}

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white font-bold text-sm rounded-xl mt-1 hover:opacity-90"
                        >
                            {loading ? 'Please wait...' : page === "login" ? "Sign In" : "Create Account"}
                        </Button>
                    </div>

                    {/* Switch */}
                    <div className="text-center mt-5 text-sm text-slate-500">
                        {page === "login" ? "Don't have an account? " : "Already have an account? "}
                        <span
                            onClick={() => setPage(page === "login" ? "register" : "login")}
                            className="text-blue-700 font-semibold cursor-pointer"
                        >
                            {page === "login" ? "Sign up" : "Sign in"}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;