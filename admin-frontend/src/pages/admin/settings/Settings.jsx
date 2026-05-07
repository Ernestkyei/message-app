import { useState } from 'react';
import { Save, User, Lock, Bell, Shield, Globe, Mail, Smartphone, Database, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@messageapp.com',
    role: 'Super Admin',
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

  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setLoading(false);
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Notification settings saved');
      setLoading(false);
    }, 1000);
  };

  const handleSaveSecurity = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Security settings updated');
      setLoading(false);
    }, 1000);
  };

  const handleSaveSystem = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('System settings saved');
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your application preferences and configurations</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border-b rounded-none justify-start gap-6 p-0 h-auto">
          <TabsTrigger value="profile" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-1 py-3">
            <User size={16} className="mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-1 py-3">
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-1 py-3">
            <Shield size={16} className="mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:border-b-2数据-[state=active]:border-blue-500 rounded-none px-1 py-3">
            <Database size={16} className="mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={profile.role} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Role cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">Email Alerts</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch checked={notifications.emailAlerts} onCheckedChange={(v) => setNotifications({...notifications, emailAlerts: v})} />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive browser push notifications</p>
                  </div>
                  <Switch checked={notifications.pushNotifications} onCheckedChange={(v) => setNotifications({...notifications, pushNotifications: v})} />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">Message Reports</p>
                    <p className="text-sm text-gray-500">Get notified about flagged messages</p>
                  </div>
                  <Switch checked={notifications.messageReports} onCheckedChange={(v) => setNotifications({...notifications, messageReports: v})} />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">User Activity</p>
                    <p className="text-sm text-gray-500">Receive updates about new users</p>
                  </div>
                  <Switch checked={notifications.userActivity} onCheckedChange={(v) => setNotifications({...notifications, userActivity: v})} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={security.twoFactorAuth} onCheckedChange={(v) => setSecurity({...security, twoFactorAuth: v})} />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">Login Alerts</p>
                    <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                  </div>
                  <Switch checked={security.loginAlerts} onCheckedChange={(v) => setSecurity({...security, loginAlerts: v})} />
                </div>
                <div className="py-3 border-b">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={security.sessionTimeout} onValueChange={(v) => setSecurity({...security, sessionTimeout: v})}>
                    <SelectTrigger className="w-48 mt-2">
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
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Put the application in maintenance mode</p>
                  </div>
                  <Switch checked={system.maintenanceMode} onCheckedChange={(v) => setSystem({...system, maintenanceMode: v})} />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-800">Auto Backup</p>
                    <p className="text-sm text-gray-500">Automatically backup database daily</p>
                  </div>
                  <Switch checked={system.autoBackup} onCheckedChange={(v) => setSystem({...system, autoBackup: v})} />
                </div>
                <div className="py-3 border-b">
                  <Label>Log Level</Label>
                  <Select value={system.logLevel} onValueChange={(v) => setSystem({...system, logLevel: v})}>
                    <SelectTrigger className="w-48 mt-2">
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
                <Button onClick={handleSaveSystem} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;