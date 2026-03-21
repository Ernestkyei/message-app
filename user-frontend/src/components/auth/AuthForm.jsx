import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

const AuthForm = ({ type, form, onChange, onSubmit, loading, error }) => {
    return (
        <div className="flex flex-col gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {type === 'register' && (
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">
                        Full Name
                    </label>
                    <Input
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={onChange}
                    />
                </div>
            )}

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Email Address
                </label>
                <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                />
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Password
                </label>
                <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                />
            </div>

            <Button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800"
            >
                {loading ? 'Please wait...' : type === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
        </div>
    );
};

export default AuthForm;