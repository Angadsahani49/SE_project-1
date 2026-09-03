export interface StudentProfile {
  id: string;
  name: string;
  studentId: string; // Roll number e.g. "21BCSE088" or "CS-2024-8842"
  email: string;
  degree: string; // "B.Tech"
  major: string; // "Computer Science & Engineering (CSE)"
  semester: string; // "Semester 5 (3rd Year)"
  section: string; // "Section A"
  university: string;
  avatarUrl: string;
  academicYear: string;
  attendanceGoal: number; // e.g. 75%
}

export interface TeacherProfile {
  id: string;
  teacherId: string; // e.g. "FAC-CSE-101"
  name: string;
  email: string;
  department: string; // "Department of Computer Science & Engineering"
  designation: string; // "Associate Professor"
  avatarUrl: string;
  assignedSubjectIds: string[];
}

export interface ClassStudent {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  batch: string;
  avatarUrl: string;
}

export interface DailyAttendanceEntry {
  studentId: string;
  rollNumber: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface DailyAttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  teacherId: string;
  teacherName: string;
  topicCovered?: string;
  records: DailyAttendanceEntry[];
  timestamp: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  professor: string;
  credits: number;
  color: string;
  badgeBg: string;
  room: string;
  attendanceGoal?: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface SubjectAttendanceStats {
  subject: Subject;
  totalClasses: number;
  attendedClasses: number; // present + late * 0.5 or present
  absentClasses: number;
  lateClasses: number;
  excusedClasses: number;
  percentage: number;
  isSafe: boolean;
  canBunkCount: number;
  needToAttendCount: number;
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  content: string;
  tags: string[];
  lastModified: string;
  isPinned?: boolean;
  author: string;
}

export type AssignmentPriority = 'low' | 'medium' | 'high';
export type AssignmentStatus = 'pending' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // ISO date string or YYYY-MM-DD HH:mm
  priority: AssignmentPriority;
  points: number;
  weightPercentage: number;
  status: AssignmentStatus;
  instructions: string;
  submittedAt?: string;
  submissionAttachment?: string;
  submissionNotes?: string;
  score?: number;
  feedback?: string;
}

export type GradeCategory = 'quiz' | 'assignment' | 'midterm' | 'project' | 'final';

export interface AssessmentGrade {
  id: string;
  subjectId: string;
  name: string;
  category: GradeCategory;
  score: number;
  maxScore: number;
  weightPercentage: number;
  date: string;
}

export interface CourseGradeSummary {
  subject: Subject;
  assessments: AssessmentGrade[];
  currentPercentage: number;
  letterGrade: string;
  gradePoint: number;
}

export interface TimetableSlot {
  id: string;
  subjectId: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5; // 1 = Monday, 5 = Friday
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  type: 'Lecture' | 'Lab' | 'Tutorial';
  room: string;
  instructor: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subjectId?: string;
  completed: boolean;
  pomodoroMinutes: number;
  createdAt: string;
}
