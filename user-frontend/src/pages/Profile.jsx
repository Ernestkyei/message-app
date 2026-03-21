import useAuthStore from '@/stores/authStore';

const Profile = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex flex-col items-center">
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                        alt="Profile"
                    />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">{user?.name}</h2>
                    <p className="mt-2 text-gray-600">{user?.email}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Details</h3>
                    <div className="mt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Role</span>
                            <span className="text-gray-800 font-medium">{user?.role}</span>
                        </div>

                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;