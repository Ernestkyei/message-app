import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 font-sans">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
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
                        className="bg-white text-blue-700 text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90 transition"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="flex flex-col items-center justify-center text-center px-4 py-24">
                <div className="bg-white bg-opacity-10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                    🚀 Real-time messaging for teams
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
                        className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:opacity-90 transition text-sm"
                    >
                        Get Started Free
                    </button>
                    <button className="border border-white border-opacity-40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition text-sm">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 px-16 pb-24">
                {[
                    { icon: "💬", title: "Real-time Messaging", desc: "Send and receive messages instantly with real-time updates." },
                    { icon: "👥", title: "Group Conversations", desc: "Create group chats and collaborate with your entire team." },
                    { icon: "🔒", title: "Secure & Private", desc: "Your messages are protected with industry-standard security." },
                ].map(f => (
                    <div key={f.title} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-white">
                        <div className="text-3xl mb-3">{f.icon}</div>
                        <div className="font-bold text-lg mb-2">{f.title}</div>
                        <div className="text-blue-100 text-sm leading-relaxed">{f.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;