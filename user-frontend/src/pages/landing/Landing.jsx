import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Shield, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 font-sans">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

            {/* Background circles - matching login page */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white opacity-5" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white opacity-5" />
            </div>

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-5 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg">Message App</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="bg-white text-blue-700 text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center px-4 py-24 relative z-10">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Real-time messaging for teams</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight max-w-2xl">
                    Connect, Collaborate & Communicate
                </h1>
                <p className="text-blue-100 text-lg mb-10 max-w-xl">
                    A simple and powerful messaging platform for teams and individuals. Send messages, manage conversations and stay connected.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:opacity-90 transition text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg group"
                    >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="border border-white border-opacity-40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition text-sm">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 md:px-16 pb-24 relative z-10">
                {[
                    { 
                        icon: MessageSquare, 
                        title: "Real-time Messaging", 
                        desc: "Send and receive messages instantly with real-time updates.",
                        color: "text-blue-200"
                    },
                    { 
                        icon: Users, 
                        title: "Group Conversations", 
                        desc: "Create group chats and collaborate with your entire team.",
                        color: "text-blue-200"
                    },
                    { 
                        icon: Shield, 
                        title: "Secure & Private", 
                        desc: "Your messages are protected with industry-standard security.",
                        color: "text-blue-200"
                    },
                ].map((feature, index) => (
                    <div 
                        key={feature.title} 
                        className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-opacity-20 transition-all duration-300 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <feature.icon className={`w-6 h-6 ${feature.color}`} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-blue-100 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;