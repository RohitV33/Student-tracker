import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, TrendingDown, Calendar, Users, BookOpen } from 'lucide-react';
import { mockStudents, mockAttendanceRecords } from '../data/mockData';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Calculate analytics data
  const getAnalyticsData = () => {
    const now = new Date();
    const daysBack = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    const filteredRecords = mockAttendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const student = mockStudents.find(s => s.id === record.studentId);
      
      return recordDate >= startDate && 
             (selectedDepartment === 'all' || student?.department === selectedDepartment);
    });

    return filteredRecords;
  };

  const getDailyAttendanceData = () => {
    const records = getAnalyticsData();
    const dailyData: { [key: string]: { present: number; absent: number; late: number; total: number } } = {};
    
    records.forEach(record => {
      if (!dailyData[record.date]) {
        dailyData[record.date] = { present: 0, absent: 0, late: 0, total: 0 };
      }
      
      dailyData[record.date][record.status]++;
      dailyData[record.date].total++;
    });

    return Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14) // Last 14 days
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: data.present,
        absent: data.absent,
        late: data.late,
        rate: Math.round((data.present / data.total) * 100)
      }));
  };

  const getSubjectPerformance = () => {
    const records = getAnalyticsData();
    const subjectData: { [key: string]: { present: number; total: number } } = {};
    
    records.forEach(record => {
      if (!subjectData[record.subject]) {
        subjectData[record.subject] = { present: 0, total: 0 };
      }
      
      if (record.status === 'present') {
        subjectData[record.subject].present++;
      }
      subjectData[record.subject].total++;
    });

    return Object.entries(subjectData).map(([subject, data]) => ({
      subject,
      attendanceRate: Math.round((data.present / data.total) * 100),
      totalClasses: data.total
    })).sort((a, b) => b.attendanceRate - a.attendanceRate);
  };

  const getStudentPerformance = () => {
    const records = getAnalyticsData();
    const studentData: { [key: string]: { present: number; total: number; late: number } } = {};
    
    records.forEach(record => {
      if (!studentData[record.studentId]) {
        studentData[record.studentId] = { present: 0, total: 0, late: 0 };
      }
      
      if (record.status === 'present') {
        studentData[record.studentId].present++;
      } else if (record.status === 'late') {
        studentData[record.studentId].late++;
      }
      studentData[record.studentId].total++;
    });

    return mockStudents.map(student => {
      const data = studentData[student.id] || { present: 0, total: 0, late: 0 };
      return {
        ...student,
        attendanceRate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
        totalClasses: data.total,
        presentClasses: data.present,
        lateClasses: data.late
      };
    }).filter(student => student.totalClasses > 0)
      .sort((a, b) => b.attendanceRate - a.attendanceRate);
  };

  const getDepartmentComparison = () => {
    const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
    
    return departments.map(dept => {
      const deptStudents = mockStudents.filter(s => s.department === dept);
      const deptRecords = mockAttendanceRecords.filter(record => 
        deptStudents.some(student => student.id === record.studentId)
      );
      
      const presentCount = deptRecords.filter(r => r.status === 'present').length;
      const totalCount = deptRecords.length;
      
      return {
        department: dept,
        attendanceRate: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0,
        totalStudents: deptStudents.length,
        averageAttendance: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0
      };
    });
  };

  const dailyData = getDailyAttendanceData();
  const subjectPerformance = getSubjectPerformance();
  const studentPerformance = getStudentPerformance();
  const departmentComparison = getDepartmentComparison();

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive attendance analytics and performance insights
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+2.1%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  Classes conducted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                <Users className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">8</div>
                <p className="text-xs text-muted-foreground">
                  Below 65% attendance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Perfect Attendance</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">23</div>
                <p className="text-xs text-muted-foreground">
                  100% attendance rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance Trend</CardTitle>
                <CardDescription>Attendance rate over the last 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Average attendance by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                    <Bar dataKey="attendanceRate" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Present, late, and absent trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} name="Present" />
                  <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} name="Late" />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} name="Absent" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Attendance rates by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Total Classes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectPerformance.map((subject) => (
                    <TableRow key={subject.subject}>
                      <TableCell className="font-medium">{subject.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{subject.attendanceRate}%</span>
                          <div className="w-full bg-gray-200 rounded-full h-2 flex-1 max-w-20">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${subject.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{subject.totalClasses}</TableCell>
                      <TableCell>
                        {subject.attendanceRate >= 85 ? 
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge> :
                          subject.attendanceRate >= 75 ?
                          <Badge variant="secondary">Good</Badge> :
                          <Badge variant="destructive">Needs Attention</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Ranking</CardTitle>
              <CardDescription>Students ranked by attendance rate</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Classes Attended</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentPerformance.slice(0, 10).map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="text-sm text-muted-foreground">{student.rollNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{student.attendanceRate}%</span>
                          <div className="w-full bg-gray-200 rounded-full h-2 flex-1 max-w-20">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${student.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.presentClasses}/{student.totalClasses}
                      </TableCell>
                      <TableCell>
                        {student.attendanceRate >= 85 ? 
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge> :
                          student.attendanceRate >= 75 ?
                          <Badge variant="secondary">Good</Badge> :
                          student.attendanceRate >= 65 ?
                          <Badge variant="outline">Average</Badge> :
                          <Badge variant="destructive">At Risk</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
                <CardDescription>Attendance rates across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentComparison} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" width={120} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                    <Bar dataKey="attendanceRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Statistics</CardTitle>
                <CardDescription>Detailed metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentComparison.map((dept) => (
                    <div key={dept.department} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{dept.department}</h4>
                        <Badge 
                          variant={dept.attendanceRate >= 85 ? "default" : 
                                   dept.attendanceRate >= 75 ? "secondary" : "destructive"}
                        >
                          {dept.attendanceRate}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Total Students: {dept.totalStudents}</p>
                        <p>Average Attendance: {dept.averageAttendance}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${dept.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}