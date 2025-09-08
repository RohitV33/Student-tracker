import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Calendar, CalendarIcon, Search, QrCode, Users, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { cn } from "./ui/utils";
import { format } from "date-fns";
import { mockStudents, mockAttendanceRecords } from '../data/mockData';

export function AttendanceTracking() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [searchTerm, setSearchTerm] = useState('');
  
  const subjects = ['Mathematics', 'Physics', 'Programming', 'Electronics', 'Thermodynamics'];
  
  // Get attendance records for selected date and subject
  const dateString = selectedDate.toISOString().split('T')[0];
  const todayAttendanceRecords = mockAttendanceRecords.filter(
    record => record.date === dateString && record.subject === selectedSubject
  );

  const filteredStudents = mockStudents.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentAttendanceStatus = (studentId: string) => {
    const record = todayAttendanceRecords.find(record => record.studentId === studentId);
    return record?.status || 'not-marked';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">Not Marked</Badge>;
    }
  };

  const getAttendanceStats = () => {
    const totalStudents = filteredStudents.length;
    const markedStudents = filteredStudents.filter(student => 
      getStudentAttendanceStatus(student.id) !== 'not-marked'
    ).length;
    const presentStudents = filteredStudents.filter(student => 
      getStudentAttendanceStatus(student.id) === 'present'
    ).length;
    const lateStudents = filteredStudents.filter(student => 
      getStudentAttendanceStatus(student.id) === 'late'
    ).length;
    const absentStudents = filteredStudents.filter(student => 
      getStudentAttendanceStatus(student.id) === 'absent'
    ).length;

    return {
      totalStudents,
      markedStudents,
      presentStudents,
      lateStudents,
      absentStudents,
      attendanceRate: totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0
    };
  };

  const stats = getAttendanceStats();

  const QuickActions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Quickly mark attendance for all students
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" variant="outline">
          <QrCode className="mr-2 h-4 w-4" />
          Generate QR Code
        </Button>
        <Button className="w-full" variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Mark All Present
        </Button>
        <Button className="w-full" variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          Auto-Import from System
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>Attendance Tracking</h1>
        <p className="text-muted-foreground">
          Mark and track student attendance for classes
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
              <CardDescription>
                Select date and subject for attendance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Students</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <QuickActions />
      </div>

      {/* Attendance Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.presentStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lateStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absentStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Student Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance - {selectedSubject}</CardTitle>
          <CardDescription>
            {format(selectedDate, "EEEE, MMMM do, yyyy")} • {stats.markedStudents} of {stats.totalStudents} marked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const status = getStudentAttendanceStatus(student.id);
                const record = todayAttendanceRecords.find(r => r.studentId === student.id);
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.firstName[0]}{student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{student.rollNumber}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{getStatusBadge(status)}</TableCell>
                    <TableCell>{record?.timeIn || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={status === 'present' ? 'default' : 'outline'}
                          className="h-8"
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'late' ? 'default' : 'outline'}
                          className="h-8"
                        >
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'absent' ? 'destructive' : 'outline'}
                          className="h-8"
                        >
                          Absent
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}