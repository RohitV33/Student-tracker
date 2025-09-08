import { Student, AttendanceRecord, Department, AttendanceStats } from '../types';

export type WeeklyAttendanceData = {
  date: string;
  present: number;
  late: number;
  absent: number;
};

export const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Rohit',
    lastName: 'Verma',
    email: 'rohit.verma@college.edu',
    rollNumber: 'CS2021001',
    department: 'Computer Science',
    year: 3,
    joinDate: '2021-08-15'
  },
  {
    id: '2',
    firstName: 'Pradeep',
    lastName: 'Singh',
    email: 'pradeep.singh@college.edu',
    rollNumber: 'CS2021002',
    department: 'Computer Science',
    year: 3,
    joinDate: '2021-08-15'
  },
  {
    id: '3',
    firstName: 'Nikhil',
    lastName: 'Kanaujia',
    email: 'nikhil.kanaujia@college.edu',
    rollNumber: 'CS2022001',
    department: 'Electrical Engineering',
    year: 2,
    joinDate: '2022-08-15'
  },
  {
    id: '4',
    firstName: 'Preeti',
    lastName: 'Mandel',
    email: 'preeti.mandel@college.edu',
    rollNumber: 'ME2021001',
    department: 'Mechanical Engineering',
    year: 3,
    joinDate: '2021-08-15'
  },
  {
    id: '5',
    firstName: 'Pratul',
    lastName: 'Tiwari',
    email: 'pratul.tiwari@college.edu',
    rollNumber: 'CS2022008',
    department: 'Computer Science',
    year: 3,
    joinDate: '2022-08-15'
  },
  {
    id: '6',
    firstName: 'Nitin',
    lastName: 'Mathur',
    email: 'nitin.mathur@college.edu',
    rollNumber: 'EE2021004',
    department: 'Electrical Engineering',
    year: 3,
    joinDate: '2021-08-15'
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Computer Science',
    code: 'CS',
    totalStudents: 300
  },
  {
    id: '2',
    name: 'Electrical Engineering',
    code: 'EE',
    totalStudents: 120
  },
  {
    id: '3',
    name: 'Mechanical Engineering',
    code: 'ME',
    totalStudents: 100
  }
];


export const generateMockAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const subjects = ['Mathematics', 'Physics', 'Programming', 'Electronics', 'Mechanical'];
  const teachers = ['Prof. Ram Kumar', 'Prof. Shayam', 'Prof. Manish', 'Prof. Jatin', 'Prof. Ansul Sagar'];
  
  const today = new Date();
  
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateString = date.toISOString().split('T')[0];
    
    mockStudents.forEach(student => {
    
      const classCount = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < classCount; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        
        // 85% chance of being present
        const statusRand = Math.random();
        let status: 'present' | 'absent' | 'late';
        if (statusRand < 0.85) {
          status = 'present';
        } else if (statusRand < 0.95) {
          status = 'late';
        } else {
          status = 'absent';
        }
        
        const timeIn = status !== 'absent' ? 
          `${9 + Math.floor(Math.random() * 8)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : 
          undefined;
        
        const timeOut = status !== 'absent' ? 
          `${10 + Math.floor(Math.random() * 8)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : 
          undefined;
        
        records.push({
          id: `${student.id}-${dateString}-${i}`,
          studentId: student.id,
          date: dateString,
          status,
          timeIn,
          timeOut,
          subject,
          teacher
        });
      }
    });
  }
  
  return records;
};

export const mockAttendanceRecords = generateMockAttendanceRecords();

export const getTodayStats = (): AttendanceStats => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = mockAttendanceRecords.filter(record => record.date === today);
  
  const uniqueStudents = new Set(todayRecords.map(record => record.studentId));
  const totalStudents = uniqueStudents.size;
  
  const presentStudents = new Set(
    todayRecords.filter(record => record.status === 'present').map(record => record.studentId)
  );
  
  const lateStudents = new Set(
    todayRecords.filter(record => record.status === 'late').map(record => record.studentId)
  );
  
  const absentStudents = new Set(
    todayRecords.filter(record => record.status === 'absent').map(record => record.studentId)
  );
  
  const presentToday = presentStudents.size;
  const lateToday = lateStudents.size;
  const absentToday = Math.max(0, mockStudents.length - presentToday - lateToday);
  
  return {
    totalStudents: mockStudents.length,
    presentToday,
    absentToday,
    lateToday,
    attendanceRate: totalStudents > 0 ? Math.round((presentToday / mockStudents.length) * 100) : 0
  };
};

export const getWeeklyAttendanceData = (): WeeklyAttendanceData[] => {
  const data: WeeklyAttendanceData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayRecords = mockAttendanceRecords.filter(record => record.date === dateString);
    const uniqueStudents = new Set(dayRecords.map(record => record.studentId));
    
    const present = new Set(
      dayRecords.filter(record => record.status === 'present').map(record => record.studentId)
    ).size;
    
    const late = new Set(
      dayRecords.filter(record => record.status === 'late').map(record => record.studentId)
    ).size;
    
    const absent = Math.max(0, mockStudents.length - present - late);
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      present,
      late,
      absent
    });
  }
  
  return data;
};

export const getDepartmentAttendanceData = () => {
  return mockDepartments.map(dept => {
    const deptStudents = mockStudents.filter(student => student.department === dept.name);
    const today = new Date().toISOString().split('T')[0];
    
    const todayRecords = mockAttendanceRecords.filter(
      record => record.date === today && deptStudents.some(student => student.id === record.studentId)
    );
    
    const presentCount = new Set(
      todayRecords.filter(record => record.status === 'present').map(record => record.studentId)
    ).size;
    
    return {
      department: dept.code,
      attendanceRate: deptStudents.length > 0 ? Math.round((presentCount / deptStudents.length) * 100) : 0,
      totalStudents: deptStudents.length
    };
  });
};
