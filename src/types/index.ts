export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  department: string;
  year: number;
  profileImage?: string;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  timeIn?: string;
  timeOut?: string;
  subject: string;
  teacher: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  totalStudents: number;
}

export interface AttendanceStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
}

export interface SubjectAttendance {
  subject: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
}