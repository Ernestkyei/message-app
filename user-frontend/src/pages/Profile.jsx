import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X, 
  LogOut,
  ChevronLeft,
  Award,
  Calendar,
  Shield
} from 'lucide-react';
import api from '../services/api';
import useAuthStore from '@/stores/authStore';

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        bio: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/me');
            const userData = response.data.user || response.data;
            
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                bio: userData.bio || ''
            });
            
            
            const currentToken = user?.token || localStorage.getItem('token');
            setUser(userData, currentToken);
            
        } catch (error) {
            console.error('Failed to load profile');
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const response = await api.patch('/users/me', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                bio: formData.bio
            });
            
            const updatedUser = response.data.user || response.data;
            
            
            const currentToken = user?.token || localStorage.getItem('token');
            setUser(updatedUser, currentToken);
            
            // Update form data with new values
            setFormData({
                name: updatedUser.name || '',
                email: updatedUser.email || '',
                phone: updatedUser.phone || '',
                address: updatedUser.address || '',
                bio: updatedUser.bio || ''
            });
            
            toast.success('Profile updated successfully!');
            setEditMode(false);
            
        } catch (error) {
            console.error('Failed to update profile');
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    if (loading && !formData.name) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Dashboard</span>
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                toast.success('Logged out!');
                                navigate('/auth/login');
                            }}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    
                    {/* Avatar Section */}
                    <div className="relative px-8 pb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-xl">
                                    <span className="text-white text-4xl font-bold">
                                        {getInitials(formData.name || user?.name)}
                                    </span>
                                </div>
                            </div>
                            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {formData.name || user?.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-2 flex-wrap justify-center md:justify-start">
                                    <span className="flex items-center gap-1 text-sm text-gray-500">
                                        <Mail className="w-4 h-4" />
                                        {formData.email || user?.email}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm text-gray-500">
                                        <Shield className="w-4 h-4" />
                                        <span className="capitalize">{user?.role || 'User'}</span>
                                    </span>
                                </div>
                                {formData.bio && !editMode && (
                                    <p className="mt-3 text-gray-600 max-w-lg">{formData.bio}</p>
                                )}
                            </div>
                            {!editMode && (
                                <div className="md:ml-auto mt-4 md:mt-0">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                {editMode ? (
                    // Edit Mode Form - Inputs pre-filled with formData
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-blue-600" />
                                Edit Profile Information
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
                        </div>
                        
                        <form onSubmit={handleUpdate} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Award className="w-4 h-4 inline mr-1" />
                                        Role
                                    </label>
                                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 capitalize">
                                        {user?.role || 'User'}
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Your address"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Tell us about yourself..."
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl transition-all duration-200"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    // View Mode - Information Cards
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Personal Information
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <p className="mt-1 text-gray-800 font-medium">{formData.name || user?.name || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <p className="mt-1 text-gray-800">{formData.email || user?.email || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <p className="mt-1 text-gray-800">{formData.phone || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    Additional Information
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</label>
                                    <p className="mt-1 text-gray-800 capitalize">{user?.role || 'User'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</label>
                                    <p className="mt-1 text-gray-800 flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date().getFullYear()}
                                    </p>
                                </div>
                                {formData.address && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                                        <p className="mt-1 text-gray-800">{formData.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio Card - Full Width */}
                        {formData.bio && (
                            <div className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-800">Bio</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
                                </div>
                            </div>
                        )}

                        {/* Stats Card */}
                        <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-6 py-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center text-white">
                                        <p className="text-3xl font-bold">0</p>
                                        <p className="text-sm opacity-90 mt-1">Messages Sent</p>
                                    </div>
                                    <div className="text-center text-white">
                                        <p className="text-3xl font-bold">0</p>
                                        <p className="text-sm opacity-90 mt-1">Messages Received</p>
                                    </div>
                                    <div className="text-center text-white">
                                        <p className="text-3xl font-bold">0</p>
                                        <p className="text-sm opacity-90 mt-1">Active Chats</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;