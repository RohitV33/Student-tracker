import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react';
import { getTodayStats, getWeeklyAttendanceData, getDepartmentAttendanceData } from '../data/mockData';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const todayStats = getTodayStats();
  const weeklyData = getWeeklyAttendanceData();
  const departmentData = getDepartmentAttendanceData();
  
  const pieData = [
    { name: 'Present', value: todayStats.presentToday, color: '#22c55e' },
    { name: 'Late', value: todayStats.lateToday, color: '#f59e0b' },
    { name: 'Absent', value: todayStats.absentToday, color: '#ef4444' }
  ];

  const StatCard = ({ title, value, icon: Icon, description, trend }: {
    title: string;
    value: string | number;
    icon: any;
    description: string;
    trend?: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {trend && (
            <>
              <TrendingUp className="h-3 w-3" />
              <span className="text-green-600">+{trend}%</span>
            </>
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>Attendance Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time attendance monitoring and analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={todayStats.totalStudents}
          icon={Users}
          description="Registered students"
        />
        <StatCard
          title="Present Today"
          value={todayStats.presentToday}
          icon={UserCheck}
          description="Students in attendance"
          trend={5}
        />
        <StatCard
          title="Absent Today"
          value={todayStats.absentToday}
          icon={UserX}
          description="Students not present"
        />
        <StatCard
          title="Attendance Rate"
          value={`${todayStats.attendanceRate}%`}
          icon={TrendingUp}
          description="Overall attendance"
          trend={2}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Attendance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>
              Distribution of attendance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
            <CardDescription>
              Attendance patterns over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Present"
                />
                <Line 
                  type="monotone" 
                  dataKey="late" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Late"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>
              Attendance rates by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                <Bar dataKey="attendanceRate" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest attendance updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { student: "Rohit Verma", action: "Marked Present", time: "9:15 AM", subject: "Mathematics" },
              { student: "Pradeep Singh", action: "Marked Late", time: "9:20 AM", subject: "Physics" },
              { student: "Nikhil Kanaujia", action: "Marked Present", time: "9:10 AM", subject: "Programming" },
              { student: "Preeti Mandel", action: "Marked Present", time: "9:05 AM", subject: "Electronics" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{activity.student}</p>
                  <p className="text-sm text-muted-foreground">{activity.subject}</p>
                </div>
                <div className="text-right">
                  <Badge variant={activity.action.includes('Late') ? 'destructive' : 'default'}>
                    {activity.action}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}