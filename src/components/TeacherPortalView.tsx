import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  PlusCircle,
  Save,
  Users,
  Check,
  X,
  History,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  FileText,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import {
  Subject,
  TeacherProfile,
  ClassStudent,
  DailyAttendanceSession,
  AttendanceStatus,
  Note
} from '../types';

interface TeacherPortalViewProps {
  subjects: Subject[];
  teachers: TeacherProfile[];
  activeTeacher: TeacherProfile;
  setActiveTeacher: (teacher: TeacherProfile) => void;
  onAddTeacher: (teacher: TeacherProfile) => void;
  classStudents: ClassStudent[];
  dailySessions: DailyAttendanceSession[];
  onSubmitDailyAttendance: (session: DailyAttendanceSession) => void;
  onPublishTeacherNote: (note: Omit<Note, 'id' | 'lastModified'>) => void;
  onSwitchToStudentView: () => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  subjects,
  teachers,
  activeTeacher,
  setActiveTeacher,
  onAddTeacher,
  classStudents,
  dailySessions,
  onSubmitDailyAttendance,
  onPublishTeacherNote,
  onSwitchToStudentView
}) => {
  const [activeTab, setActiveTab] = useState<'mark_attendance' | 'history' | 'publish_note'>('mark_attendance');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'create'>('login');

  // New Teacher Registration Form State
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherId, setNewTeacherId] = useState(`FAC-CSE-${100 + teachers.length + 1}`);
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherDesignation, setNewTeacherDesignation] = useState('Assistant Professor');
  const [newTeacherSubjectId, setNewTeacherSubjectId] = useState(subjects[0]?.id || 'subj_cs301');

  // Attendance Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    activeTeacher.assignedSubjectIds[0] || subjects[0]?.id || 'subj_cs301'
  );
  const [selectedSection, setSelectedSection] = useState('B.Tech CSE - 3rd Year (Section A)');
  const [topicCovered, setTopicCovered] = useState('Data Structures & Algorithm Design Lecture');

  // Student Attendance Mapping for the selected session
  // studentId -> { status: AttendanceStatus, remarks: string }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach(s => {
      initial[s.id] = { status: 'present', remarks: '' };
    });
    return initial;
  });

  // Success message toast
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Note Publishing State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubjectId, setNoteSubjectId] = useState(selectedSubjectId);
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('B.Tech Core, Exam Important, CSE 3rd Year');

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Bulk actions
  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendanceMap(prev => {
      const updated = { ...prev };
      classStudents.forEach(s => {
        updated[s.id] = { ...updated[s.id], status };
      });
      return updated;
    });
  };

  const handleStudentStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleStudentRemarkChange = (studentId: string, remarks: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  // Submit Attendance
  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();

    const records = classStudents.map(student => ({
      studentId: student.id,
      rollNumber: student.rollNumber,
      studentName: student.name,
      status: attendanceMap[student.id]?.status || 'present',
      remarks: attendanceMap[student.id]?.remarks || undefined
    }));

    const newSession: DailyAttendanceSession = {
      id: `session_${Date.now()}`,
      date: selectedDate,
      subjectId: selectedSubjectId,
      teacherId: activeTeacher.teacherId,
      teacherName: activeTeacher.name,
      topicCovered: topicCovered.trim() || undefined,
      records,
      timestamp: new Date().toISOString()
    };

    onSubmitDailyAttendance(newSession);

    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount = records.filter(r => r.status === 'absent').length;

    setSuccessToast(
      `Attendance submitted for ${selectedSubject.code} on ${selectedDate}: ${presentCount} Present, ${absentCount} Absent. Student records synchronized!`
    );

    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  // Create New Teacher Handler
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const createdTeacher: TeacherProfile = {
      id: `teach_${Date.now()}`,
      teacherId: newTeacherId.trim() || `FAC-CSE-${Date.now().toString().slice(-3)}`,
      name: newTeacherName.trim(),
      email: newTeacherEmail.trim() || `${newTeacherName.toLowerCase().replace(/\s+/g, '.')}@faculty.mit.edu`,
      department: 'Department of Computer Science & Engineering',
      designation: newTeacherDesignation,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      assignedSubjectIds: [newTeacherSubjectId]
    };

    onAddTeacher(createdTeacher);
    setActiveTeacher(createdTeacher);
    setSelectedSubjectId(newTeacherSubjectId);
    setIsAuthModalOpen(false);
    setNewTeacherName('');
    setSuccessToast(`Welcome, ${createdTeacher.name}! Logged in as Faculty ID: ${createdTeacher.teacherId}`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Publish Note Handler
  const handlePublishNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    onPublishTeacherNote({
      title: noteTitle.trim(),
      subjectId: noteSubjectId,
      content: noteContent.trim(),
      tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
      author: `${activeTeacher.name} (Faculty Verified)`,
      isPinned: true
    });

    setNoteTitle('');
    setNoteContent('');
    setSuccessToast(`Lecture note published to B.Tech CSE students successfully!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Calculate live stats for current marking sheet
  const currentTotal = classStudents.length;
  const currentPresent = classStudents.filter(s => attendanceMap[s.id]?.status === 'present').length;
  const currentAbsent = classStudents.filter(s => attendanceMap[s.id]?.status === 'absent').length;
  const currentLate = classStudents.filter(s => attendanceMap[s.id]?.status === 'late').length;
  const currentPercentage = currentTotal > 0 ? Math.round((currentPresent / currentTotal) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Faculty Banner & Profile Switcher */}
      <header className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={activeTeacher.avatarUrl}
              alt={activeTeacher.name}
              className="w-14 h-14 rounded-2xl border-2 border-indigo-400 object-cover shadow-sm bg-indigo-900 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  B.Tech CSE Faculty Portal
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ID: {activeTeacher.teacherId}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                {activeTeacher.name}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeTeacher.designation} • {activeTeacher.department}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Switch Teacher</span>
            </button>

            <button
              onClick={() => {
                setAuthModalTab('create');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Teacher ID</span>
            </button>

            <button
              onClick={onSwitchToStudentView}
              className="px-4 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Student View</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation inside Teacher Portal */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('mark_attendance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'mark_attendance'
                ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily Attendance Marker</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Attendance Register ({dailySessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('publish_note')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'publish_note'
                ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Publish CSE Lecture Notes</span>
          </button>
        </div>
      </header>

      {/* TAB 1: DAILY ATTENDANCE MARKER */}
      {activeTab === 'mark_attendance' && (
        <form onSubmit={handleSubmitAttendance} className="space-y-6">
          {/* Controls Bar: Date, Subject, Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Daily Class Attendance Setup</span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                Department of Computer Science & Engineering
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Date of Lecture
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  B.Tech CSE Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={e => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Batch Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Class Batch / Section
                </label>
                <select
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="B.Tech CSE - 3rd Year (Section A)">B.Tech CSE - 3rd Year (Sec A)</option>
                  <option value="B.Tech CSE - 3rd Year (Section B)">B.Tech CSE - 3rd Year (Sec B)</option>
                  <option value="B.Tech CSE - 4th Year (Honors)">B.Tech CSE - 4th Year (Honors)</option>
                </select>
              </div>

              {/* Topic / Unit Covered */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Topic / Unit Taught
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graph Shortest Path or Paging"
                  value={topicCovered}
                  onChange={e => setTopicCovered(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* Quick Bulk Marking Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Bulk Actions:</span>
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Mark All Present</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5 text-rose-700" />
                  <span>Mark All Absent</span>
                </button>
              </div>

              {/* Live Attendance Counter */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  Present: <strong>{currentPresent}</strong> ({currentPercentage}%)
                </span>
                <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
                  Absent: <strong>{currentAbsent}</strong>
                </span>
                {currentLate > 0 && (
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                    Late: <strong>{currentLate}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-800">
                  Student Attendance Roster ({classStudents.length} Registered Candidates)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click <strong>Present</strong>, <strong>Absent</strong>, or <strong>Late</strong> for each student. Changes sync to student portal upon submission.
                </p>
              </div>

              <div className="text-xs font-medium text-slate-500">
                Course: <strong className="text-indigo-600">{selectedSubject.code}</strong> • Date: <strong className="text-slate-800">{selectedDate}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Roll No</th>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3 text-center">Daily Status (Present / Absent)</th>
                    <th className="px-6 py-3">Teacher Remarks / Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {classStudents.map(student => {
                    const currentRecord = attendanceMap[student.id] || { status: 'present', remarks: '' };
                    const isStudentUser = student.id === 'usr_1028';

                    return (
                      <tr
                        key={student.id}
                        className={`hover:bg-slate-50/70 transition ${isStudentUser ? 'bg-indigo-50/30' : ''}`}
                      >
                        {/* Roll Number */}
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 whitespace-nowrap">
                          {student.rollNumber}
                        </td>

                        {/* Student Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover bg-slate-200 border border-slate-300 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <span>{student.name}</span>
                                {isStudentUser && (
                                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                                    Current Student Profile
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400">{student.batch}</span>
                            </div>
                          </div>
                        </td>

                        {/* Daily Status Toggles (Present / Absent / Late) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Present Button */}
                            <button
                              type="button"
                              onClick={() => handleStudentStatusChange(student.id, 'present')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                currentRecord.status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            {/* Absent Button */}
                            <button
                              type="button"
                              onClick={() => handleStudentStatusChange(student.id, 'absent')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                currentRecord.status === 'absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>

                            {/* Late Button */}
                            <button
                              type="button"
                              onClick={() => handleStudentStatusChange(student.id, 'late')}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                currentRecord.status === 'late'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Late</span>
                            </button>
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            placeholder="Optional note (e.g. Lab viva, Medical)"
                            value={currentRecord.remarks}
                            onChange={e => handleStudentRemarkChange(student.id, e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Submit Bar */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Submitted by: <strong className="text-slate-800">{activeTeacher.name}</strong> (Faculty ID: {activeTeacher.teacherId})
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Reset to All Present
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Submit Attendance for {selectedDate}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: ATTENDANCE HISTORY & REGISTER */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              B.Tech CSE Attendance Register & Past Lectures
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Review previously recorded class sessions, attendance ratios, and syllabus topics taught.
            </p>

            <div className="space-y-4">
              {dailySessions.map(session => {
                const subject = subjects.find(s => s.id === session.subjectId);
                const presentCount = session.records.filter(r => r.status === 'present').length;
                const absentCount = session.records.filter(r => r.status === 'absent').length;
                const lateCount = session.records.filter(r => r.status === 'late').length;
                const total = session.records.length;
                const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

                return (
                  <div
                    key={session.id}
                    className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-xs transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded text-xs">
                            {subject?.code || 'CS301'}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {subject?.name || 'Computer Science Subject'}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-500">{session.date}</span>
                        </div>
                        {session.topicCovered && (
                          <p className="text-xs text-slate-600 mt-1">
                            <strong>Topic:</strong> {session.topicCovered}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          {presentCount} / {total} Present ({pct}%)
                        </span>
                        {absentCount > 0 && (
                          <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                            {absentCount} Absent
                          </span>
                        )}
                        <span className="text-slate-400 font-mono text-[11px]">
                          By: {session.teacherName}
                        </span>
                      </div>
                    </div>

                    {/* Compact student status list */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {session.records.map(rec => (
                        <span
                          key={rec.studentId}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                            rec.status === 'present'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : rec.status === 'absent'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span>{rec.studentName.split(' ')[0]}</span>
                          <span className="uppercase text-[9px] opacity-75 font-mono">({rec.status[0]})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {dailySessions.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No attendance sessions recorded yet. Use the "Daily Attendance Marker" to mark today's class.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISH CSE LECTURE NOTES */}
      {activeTab === 'publish_note' && (
        <form onSubmit={handlePublishNoteSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Publish B.Tech CSE Course Notes & Formula Sheets
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Lecture notes published here are pinned and marked as <strong>Faculty Verified</strong> in the student repository.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Note Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Unit 3: Dynamic Programming & Bellman-Ford Recurrence"
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Subject
              </label>
              <select
                value={noteSubjectId}
                onChange={e => setNoteSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={noteTags}
              onChange={e => setNoteTags(e.target.value)}
              placeholder="e.g. B.Tech Core, Exam Important, Algorithms"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Lecture Notes / Content (Markdown supported)
            </label>
            <textarea
              required
              rows={8}
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Enter comprehensive lecture summaries, code snippets, algorithms, and key exam questions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Publish Note to Students</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL: TEACHER LOGIN / CREATE TEACHER ID */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Faculty Authentication</h2>
                <p className="text-xs text-slate-500">Department of Computer Science & Engineering</p>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className={`py-2 rounded-lg transition ${
                  authModalTab === 'login' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In as Faculty
              </button>
              <button
                type="button"
                onClick={() => setAuthModalTab('create')}
                className={`py-2 rounded-lg transition ${
                  authModalTab === 'create' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create New Teacher ID
              </button>
            </div>

            {/* Modal Content: LOGIN */}
            {authModalTab === 'login' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Select an existing faculty member from the CSE department to manage class attendance and publish notes:
                </p>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {teachers.map(t => {
                    const isSelected = t.id === activeTeacher.id;
                    const assignedSubject = subjects.find(s => t.assignedSubjectIds.includes(s.id));

                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveTeacher(t);
                          if (t.assignedSubjectIds[0]) {
                            setSelectedSubjectId(t.assignedSubjectIds[0]);
                          }
                          setIsAuthModalOpen(false);
                          setSuccessToast(`Signed in as ${t.name} (${t.teacherId})`);
                          setTimeout(() => setSuccessToast(null), 4000);
                        }}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400'
                            : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatarUrl}
                            alt={t.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-300 bg-slate-200"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{t.name}</span>
                              {isSelected && (
                                <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {t.designation} • <span className="font-mono font-semibold text-slate-700">{t.teacherId}</span>
                            </p>
                            {assignedSubject && (
                              <span className="inline-block text-[10px] font-medium text-indigo-600 bg-indigo-50/80 px-1.5 py-0.5 rounded mt-0.5">
                                {assignedSubject.code}: {assignedSubject.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                          <span>Select</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Content: CREATE NEW TEACHER ID */}
            {authModalTab === 'create' && (
              <form onSubmit={handleCreateTeacher} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Teacher Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ananya Sen"
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Teacher / Faculty ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FAC-CSE-106"
                      value={newTeacherId}
                      onChange={e => setNewTeacherId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Designation
                    </label>
                    <select
                      value={newTeacherDesignation}
                      onChange={e => setNewTeacherDesignation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Lab Instructor">Lab Instructor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Department of Computer Science & Engineering (B.Tech CSE)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Faculty Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ananya.sen@faculty.mit.edu"
                    value={newTeacherEmail}
                    onChange={e => setNewTeacherEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Assigned Primary CSE Subject
                  </label>
                  <select
                    value={newTeacherSubjectId}
                    onChange={e => setNewTeacherSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create ID & Sign In as Teacher</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
