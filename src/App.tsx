import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { AttendanceTracking } from './components/AttendanceTracking';
import { Analytics } from './components/Analytics';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import OTPLogin from './components/OTPLogin';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  Calendar,
  Settings,
  Bell,
  Search,
  Menu,
  Home,
  LogOut
} from 'lucide-react';




type ActiveTab = 'dashboard' | 'students' | 'attendance' | 'analytics';


export default function App() {
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'attendance', name: 'Attendance', icon: UserCheck },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManagement />;
      case 'attendance':
        return <AttendanceTracking />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-semibold">AttendanceTracker</h1>
                <p className="text-xs text-muted-foreground">College Management</p>
              </div>
            )}
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
                onClick={() => setActiveTab(item.id as ActiveTab)}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@college.edu</p>
              </div>
            )}
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search students, classes..."
                  className="pl-9 pr-4 py-2 border rounded-md w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4">
                <Card className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Present Today</p>
                      <p className="text-sm font-medium">142</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance Rate</p>
                      <p className="text-sm font-medium">87.3%</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
    
  );
}