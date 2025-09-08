import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, Plus, Edit, UserCheck, UserX, Clock } from 'lucide-react';
import { mockStudents, mockAttendanceRecords } from '../data/mockData';
import { Student } from '../types';

export function StudentManagement() {
  const [students] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    const matchesYear = yearFilter === 'all' || student.year.toString() === yearFilter;
    
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const getStudentAttendanceStats = (studentId: string) => {
    const studentRecords = mockAttendanceRecords.filter(record => record.studentId === studentId);
    const totalClasses = studentRecords.length;
    const presentClasses = studentRecords.filter(record => record.status === 'present').length;
    const lateClasses = studentRecords.filter(record => record.status === 'late').length;
    const absentClasses = studentRecords.filter(record => record.status === 'absent').length;
    
    return {
      totalClasses,
      presentClasses,
      lateClasses,
      absentClasses,
      attendanceRate: totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0
    };
  };

  const getAttendanceStatusBadge = (rate: number) => {
    if (rate >= 85) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rate >= 75) return <Badge variant="secondary">Good</Badge>;
    if (rate >= 65) return <Badge variant="outline">Average</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  const AddStudentDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's information to add them to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@college.edu" />
          </div>
          <div>
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input id="rollNumber" placeholder="CS2024001" />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">Add Student</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1>Student Management</h1>
          <p className="text-muted-foreground">
            Manage student information and view attendance statistics
          </p>
        </div>
        <AddStudentDialog />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>
            Complete list of registered students with attendance statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const stats = getStudentAttendanceStats(student.id);
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
                    <TableCell>Year {student.year}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stats.attendanceRate}%</span>
                        <div className="text-xs text-muted-foreground">
                          ({stats.presentClasses}/{stats.totalClasses})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getAttendanceStatusBadge(stats.attendanceRate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
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

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered in system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredStudents.filter(student => getStudentAttendanceStats(student.id).attendanceRate >= 85).length}
            </div>
            <p className="text-xs text-muted-foreground">
              ≥85% attendance rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poor Attendance</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredStudents.filter(student => getStudentAttendanceStats(student.id).attendanceRate < 65).length}
            </div>
            <p className="text-xs text-muted-foreground">
              &lt;65% attendance rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}