import { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/authStore';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    messageReports: true,
    userActivity: false,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const [system, setSystem] = useState({
    maintenanceMode: false,
    autoBackup: true,
    logLevel: 'info',
  });

  // Load user data from auth store
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Admin',
      });
    }
  }, [user]);

  // Update Profile (using auth store)
  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      // In a real app, you would update the user in the backend
      // and then update the auth store
      toast.success('Profile updated successfully');
      setLoading(false);
    }, 500);
  };

  // Update Password (separate function)
  const handleChangePassword = () => {
    toast.info('Password change feature coming soon');
  };

  // Save Notification Settings
  const handleSaveNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Notification settings saved');
      setLoading(false);
    }, 500);
  };

  // Save Security Settings
  const handleSaveSecurity = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Security settings updated');
      setLoading(false);
    }, 500);
  };

  // Save System Settings
  const handleSaveSystem = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('System settings saved');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 text-xs">Manage your application preferences and configurations</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="bg-white border-b rounded-none justify-start gap-4 p-0 h-auto flex-wrap">
            <TabsTrigger value="profile" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-1 py-2 text-sm">
              <User size={14} className="mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-1 py-2 text-sm">
              <Bell size={14} className="mr-1" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-1 py-2 text-sm">
              <Shield size={14} className="mr-1" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-1 py-2 text-sm">
              <Database size={14} className="mr-1" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Profile Information</CardTitle>
                <CardDescription className="text-xs">Update your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Full Name</Label>
                    <Input 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})} 
                      className="h-9"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Email Address</Label>
                    <Input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({...profile, email: e.target.value})} 
                      className="h-9"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Role</Label>
                    <Input value={profile.role} disabled className="bg-gray-50 h-9" />
                    <p className="text-[10px] text-gray-500">Role cannot be changed</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Profile Picture</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                        {profile.name?.charAt(0) || 'A'}
                      </div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={loading} size="sm">
                    {loading && <RefreshCw size={14} className="animate-spin mr-1" />}
                    {!loading && <Save size={14} className="mr-1" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription className="text-xs">Configure how you receive alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Email Alerts</p>
                      <p className="text-xs text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch checked={notifications.emailAlerts} onCheckedChange={(v) => setNotifications({...notifications, emailAlerts: v})} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Push Notifications</p>
                      <p className="text-xs text-gray-500">Receive browser push notifications</p>
                    </div>
                    <Switch checked={notifications.pushNotifications} onCheckedChange={(v) => setNotifications({...notifications, pushNotifications: v})} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Message Reports</p>
                      <p className="text-xs text-gray-500">Get notified about flagged messages</p>
                    </div>
                    <Switch checked={notifications.messageReports} onCheckedChange={(v) => setNotifications({...notifications, messageReports: v})} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">User Activity</p>
                      <p className="text-xs text-gray-500">Receive updates about new users</p>
                    </div>
                    <Switch checked={notifications.userActivity} onCheckedChange={(v) => setNotifications({...notifications, userActivity: v})} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={loading} size="sm">
                    {loading && <RefreshCw size={14} className="animate-spin mr-1" />}
                    {!loading && <Save size={14} className="mr-1" />}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Security Settings</CardTitle>
                <CardDescription className="text-xs">Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch checked={security.twoFactorAuth} onCheckedChange={(v) => setSecurity({...security, twoFactorAuth: v})} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Login Alerts</p>
                      <p className="text-xs text-gray-500">Get notified of new login attempts</p>
                    </div>
                    <Switch checked={security.loginAlerts} onCheckedChange={(v) => setSecurity({...security, loginAlerts: v})} />
                  </div>
                  <div className="py-2 border-b">
                    <Label className="text-sm">Session Timeout (minutes)</Label>
                    <Select value={security.sessionTimeout} onValueChange={(v) => setSecurity({...security, sessionTimeout: v})}>
                      <SelectTrigger className="w-40 mt-1 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" onClick={handleChangePassword} className="text-red-600 hover:text-red-700">
                      Change Password
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSecurity} disabled={loading} size="sm">
                    {loading && <RefreshCw size={14} className="animate-spin mr-1" />}
                    {!loading && <Save size={14} className="mr-1" />}
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">System Configuration</CardTitle>
                <CardDescription className="text-xs">Manage system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Maintenance Mode</p>
                      <p className="text-xs text-gray-500">Put the application in maintenance mode</p>
                    </div>
                    <Switch checked={system.maintenanceMode} onCheckedChange={(v) => setSystem({...system, maintenanceMode: v})} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Auto Backup</p>
                      <p className="text-xs text-gray-500">Automatically backup database daily</p>
                    </div>
                    <Switch checked={system.autoBackup} onCheckedChange={(v) => setSystem({...system, autoBackup: v})} />
                  </div>
                  <div className="py-2 border-b">
                    <Label className="text-sm">Log Level</Label>
                    <Select value={system.logLevel} onValueChange={(v) => setSystem({...system, logLevel: v})}>
                      <SelectTrigger className="w-40 mt-1 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSystem} disabled={loading} size="sm">
                    {loading && <RefreshCw size={14} className="animate-spin mr-1" />}
                    {!loading && <Save size={14} className="mr-1" />}
                    Save System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;