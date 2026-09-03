import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  Subject,
  AttendanceRecord,
  Note,
  Assignment,
  AssessmentGrade,
  TimetableSlot,
  StudyTask,
  TeacherProfile,
  ClassStudent,
  DailyAttendanceSession
} from './types';
import {
  initialProfile,
  initialSubjects,
  initialAttendanceRecords,
  initialNotes,
  initialAssignments,
  initialAssessments,
  initialTimetableSlots,
  initialStudyTasks
} from './data/mockData';
import {
  initialTeachers,
  initialClassStudents,
  initialDailyAttendanceSessions
} from './data/btechCseData';
import {
  calculateOverallAttendance,
  calculateCourseGrades
} from './utils/studentCalculations';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { AttendanceView } from './components/AttendanceView';
import { NotesView } from './components/NotesView';
import { AssignmentsView } from './components/AssignmentsView';
import { GradesView } from './components/GradesView';
import { TimetableAndStudyView } from './components/TimetableAndStudyView';
import { TeacherPortalView } from './components/TeacherPortalView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Persistence in localStorage
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('portal_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('portal_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('portal_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('portal_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('portal_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [assessments, setAssessments] = useState<AssessmentGrade[]>(() => {
    const saved = localStorage.getItem('portal_assessments');
    return saved ? JSON.parse(saved) : initialAssessments;
  });

  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('portal_timetable');
    return saved ? JSON.parse(saved) : initialTimetableSlots;
  });

  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('portal_study_tasks');
    return saved ? JSON.parse(saved) : initialStudyTasks;
  });

  // Faculty & Class State for B.Tech CSE
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    const saved = localStorage.getItem('portal_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('portal_active_teacher');
    return saved ? JSON.parse(saved) : initialTeachers[0];
  });

  const [classStudents, setClassStudents] = useState<ClassStudent[]>(() => {
    const saved = localStorage.getItem('portal_class_students');
    return saved ? JSON.parse(saved) : initialClassStudents;
  });

  const [dailySessions, setDailySessions] = useState<DailyAttendanceSession[]>(() => {
    const saved = localStorage.getItem('portal_daily_sessions');
    return saved ? JSON.parse(saved) : initialDailyAttendanceSessions;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('portal_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portal_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('portal_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('portal_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('portal_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('portal_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('portal_timetable', JSON.stringify(timetableSlots));
  }, [timetableSlots]);

  useEffect(() => {
    localStorage.setItem('portal_study_tasks', JSON.stringify(studyTasks));
  }, [studyTasks]);

  useEffect(() => {
    localStorage.setItem('portal_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('portal_active_teacher', JSON.stringify(activeTeacher));
  }, [activeTeacher]);

  useEffect(() => {
    localStorage.setItem('portal_class_students', JSON.stringify(classStudents));
  }, [classStudents]);

  useEffect(() => {
    localStorage.setItem('portal_daily_sessions', JSON.stringify(dailySessions));
  }, [dailySessions]);

  // Overall metrics calculation
  const overallAttendance = calculateOverallAttendance(
    subjects,
    attendanceRecords,
    profile.attendanceGoal
  );

  const gradeStats = calculateCourseGrades(subjects, assessments);

  const pendingAssignmentsCount = assignments.filter(a => a.status === 'pending').length;

  // Handlers for Attendance
  const handleAddAttendanceRecord = (newRec: Omit<AttendanceRecord, 'id'>) => {
    const record: AttendanceRecord = {
      ...newRec,
      id: `att_${Date.now()}`
    };
    setAttendanceRecords(prev => [record, ...prev]);
  };

  const handleDeleteAttendanceRecord = (id: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateGoal = (newGoal: number) => {
    setProfile(prev => ({ ...prev, attendanceGoal: newGoal }));
  };

  const handleQuickMarkToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newRecords: AttendanceRecord[] = subjects.map(s => ({
      id: `att_${Date.now()}_${s.id}`,
      subjectId: s.id,
      date: todayStr,
      status: 'present',
      remarks: 'Fast check-in from dashboard'
    }));

    setAttendanceRecords(prev => [...newRecords, ...prev]);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handlers for Notes
  const handleAddNote = (newNote: Omit<Note, 'id' | 'lastModified'>) => {
    const note: Note = {
      ...newNote,
      id: `note_${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    setNotes(prev => [note, ...prev]);
  };

  const handleUpdateNote = (id: string, updated: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updated, lastModified: new Date().toISOString() } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Handlers for Assignments
  const handleAddAssignment = (newAsg: Omit<Assignment, 'id'>) => {
    const asg: Assignment = {
      ...newAsg,
      id: `asg_${Date.now()}`
    };
    setAssignments(prev => [asg, ...prev]);
  };

  const handleSubmitAssignment = (id: string, notesText: string, attachmentUrl?: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'submitted',
              submittedAt: new Date().toISOString(),
              submissionNotes: notesText,
              submissionAttachment: attachmentUrl
            }
          : a
      )
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // Handlers for Assessments & Grades
  const handleAddAssessment = (newItem: Omit<AssessmentGrade, 'id'>) => {
    const item: AssessmentGrade = {
      ...newItem,
      id: `gr_${Date.now()}`
    };
    setAssessments(prev => [item, ...prev]);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  // Handlers for Study Tasks
  const handleAddStudyTask = (newTask: Omit<StudyTask, 'id' | 'createdAt'>) => {
    const task: StudyTask = {
      ...newTask,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStudyTasks(prev => [task, ...prev]);
  };

  const handleToggleStudyTask = (id: string) => {
    setStudyTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteStudyTask = (id: string) => {
    setStudyTasks(prev => prev.filter(t => t.id !== id));
  };

  // Handlers for Faculty / Teacher Portal
  const handleAddTeacher = (newTeacher: TeacherProfile) => {
    setTeachers(prev => [newTeacher, ...prev]);
    setActiveTeacher(newTeacher);
  };

  const handleSubmitDailyAttendance = (session: DailyAttendanceSession) => {
    setDailySessions(prev => [session, ...prev]);

    // Check if the current student (Alex Rivera, roll CS-2024-8842, id usr_1028) was marked in this batch session
    const studentRecord = session.records.find(
      r => r.studentId === profile.id || r.rollNumber === profile.studentId || r.studentName.toLowerCase().includes('alex')
    );

    if (studentRecord) {
      setAttendanceRecords(prev => {
        const existingIdx = prev.findIndex(
          r => r.subjectId === session.subjectId && r.date === session.date
        );

        const updatedRecord: AttendanceRecord = {
          id: existingIdx >= 0 ? prev[existingIdx].id : `att_${Date.now()}_faculty`,
          subjectId: session.subjectId,
          date: session.date,
          status: studentRecord.status,
          remarks: studentRecord.remarks || `Daily attendance marked by ${session.teacherName} (Faculty)`
        };

        if (existingIdx >= 0) {
          const clone = [...prev];
          clone[existingIdx] = updatedRecord;
          return clone;
        } else {
          return [updatedRecord, ...prev];
        }
      });

      if (studentRecord.status === 'present') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Backup & Reset Functionality
  const handleExportData = () => {
    const backupData = {
      profile,
      subjects,
      attendanceRecords,
      notes,
      assignments,
      assessments,
      timetableSlots,
      studyTasks,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_portal_backup_${profile.studentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all portal records back to the initial sample university state?')) {
      localStorage.clear();
      setProfile(initialProfile);
      setSubjects(initialSubjects);
      setAttendanceRecords(initialAttendanceRecords);
      setNotes(initialNotes);
      setAssignments(initialAssignments);
      setAssessments(initialAssessments);
      setTimetableSlots(initialTimetableSlots);
      setStudyTasks(initialStudyTasks);
      setTeachers(initialTeachers);
      setActiveTeacher(initialTeachers[0]);
      setClassStudents(initialClassStudents);
      setDailySessions(initialDailyAttendanceSessions);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col lg:flex-row">
      {/* Professional Polish Sidebar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={profile}
        overallAttendancePct={overallAttendance.overallPercentage}
        currentGpa={gradeStats.semesterGpa}
        pendingAssignmentsCount={pendingAssignmentsCount}
        onExportData={handleExportData}
        onResetData={handleResetData}
        activeTeacherName={activeTeacher.name}
        activeTeacherId={activeTeacher.teacherId}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewDashboard
              profile={profile}
              subjects={subjects}
              attendanceRecords={attendanceRecords}
              notes={notes}
              assignments={assignments}
              assessments={assessments}
              onNavigate={setCurrentTab}
              onQuickMarkToday={handleQuickMarkToday}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              subjects={subjects}
              attendanceRecords={attendanceRecords}
              attendanceGoal={profile.attendanceGoal}
              onUpdateGoal={handleUpdateGoal}
              onAddRecord={handleAddAttendanceRecord}
              onDeleteRecord={handleDeleteAttendanceRecord}
              onNavigateToTeacherPortal={() => setCurrentTab('teacher_portal')}
            />
          )}

          {currentTab === 'notes' && (
            <NotesView
              notes={notes}
              subjects={subjects}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {currentTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              subjects={subjects}
              onAddAssignment={handleAddAssignment}
              onSubmitAssignment={handleSubmitAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          )}

          {currentTab === 'grades' && (
            <GradesView
              subjects={subjects}
              assessments={assessments}
              onAddAssessment={handleAddAssessment}
              onDeleteAssessment={handleDeleteAssessment}
            />
          )}

          {currentTab === 'timetable' && (
            <TimetableAndStudyView
              timetableSlots={timetableSlots}
              subjects={subjects}
              studyTasks={studyTasks}
              onAddTask={handleAddStudyTask}
              onToggleTask={handleToggleStudyTask}
              onDeleteTask={handleDeleteStudyTask}
            />
          )}

          {currentTab === 'teacher_portal' && (
            <TeacherPortalView
              subjects={subjects}
              teachers={teachers}
              activeTeacher={activeTeacher}
              setActiveTeacher={setActiveTeacher}
              onAddTeacher={handleAddTeacher}
              classStudents={classStudents}
              dailySessions={dailySessions}
              onSubmitDailyAttendance={handleSubmitDailyAttendance}
              onPublishTeacherNote={handleAddNote}
              onSwitchToStudentView={() => setCurrentTab('overview')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-6 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">ScholarFlow B.Tech CSE Portal</span>
              <span>•</span>
              <span>{profile.degree || 'B.Tech Computer Science'} (Sem {profile.semester || 5}, Sec {profile.section || 'A'})</span>
              <span>•</span>
              <span>{profile.university}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Roll: <strong className="font-mono text-slate-700">{profile.studentId}</strong></span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Auto-Sync Active</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
